#!/usr/bin/env python3
"""Trusted manual L1 adapter. No model invocation in --verify mode."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import uuid

ROOT = Path(__file__).resolve().parent.parent
STATE = ROOT / 'STATE.md'
LOCK = ROOT / 'automation/run.lock'


def posts(path):
    data = json.loads(path.read_text())
    if not isinstance(data, list):
        raise ValueError('input must be an array')
    seen = set()
    for post in data:
        if not isinstance(post, dict) or not isinstance(post.get('id'), str):
            raise ValueError('post needs a string id')
        if not post['id'] or post['id'] in seen:
            raise ValueError('empty or duplicate id')
        seen.add(post['id'])
        if not isinstance(post.get('question'), str) or not post['question'].strip():
            raise ValueError('post needs a question')
        if not isinstance(post.get('answers'), list):
            raise ValueError('answers must be an array')
    return [p['id'] for p in data if p['answers'] == []]


def verify(report, source):
    ids = posts(source)
    if report.stat().st_size > 65536:
        raise ValueError('report exceeds 64 KiB')
    data = json.loads(report.read_text())
    if not isinstance(data, dict) or set(data) != {'unanswered_ids', 'drafts', 'deferred_ids'}:
        raise ValueError('invalid report keys')
    if data['unanswered_ids'] != ids or data['deferred_ids'] != ids[5:]:
        raise ValueError('incomplete or reordered unanswered/deferred coverage')
    drafts = data['drafts']
    if not isinstance(drafts, list) or len(drafts) != len(ids[:5]):
        raise ValueError('invalid draft count')
    for draft, ident in zip(drafts, ids[:5]):
        if not isinstance(draft, dict) or set(draft) != {'id', 'reply', 'uncertainty'}:
            raise ValueError('invalid draft keys')
        if draft['id'] != ident:
            raise ValueError('invalid draft id')
        for key in ('reply', 'uncertainty'):
            if not isinstance(draft[key], str) or not draft[key].strip():
                raise ValueError('missing ' + key)
    return data


def events():
    result = []
    for line in STATE.read_text().splitlines():
        if line.startswith('event: '):
            result.append(json.loads(line[7:]))
    return result


def attempts(history, signature):
    count = 0
    for event in history:
        if event.get('signature') == signature:
            if event.get('kind') in ('reset', 'progress'):
                count = 0
            elif event.get('kind') == 'failure':
                count += 1
    return count


def persist(event):
    event['time'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    # A single O_APPEND write prevents overlapping exits from overwriting state.
    raw = ('\nevent: ' + json.dumps(event, sort_keys=True) + '\n').encode()
    fd = os.open(STATE, os.O_WRONLY | os.O_APPEND)
    try:
        if os.write(fd, raw) != len(raw):
            raise OSError('incomplete ledger append')
        os.fsync(fd)
    finally:
        os.close(fd)
    print(event['ending'] + ': ' + event.get('detail', ''))


def run():
    # Read authoritative state and design before any drafting action.
    design = (ROOT / 'LOOP.md').read_text()
    state = STATE.read_text()
    try:
        LOCK.mkdir()
    except FileExistsError:
        persist({'kind': 'overlap', 'ending': 'escalated', 'detail': 'existing lock; no model call'})
        return 1
    signature = 'input-validation'
    history = []
    event = {'kind': 'failure', 'ending': 'escalated'}
    started = time.monotonic()
    try:
        (LOCK / 'pid').write_text(str(os.getpid()) + '\n')
        history = events()
        levels = [line for line in state.splitlines() if line.startswith('level:')]
        if levels != ['level: L1']:
            signature = 'unsupported-level'
            raise ValueError('only human-seeded L1 is supported')
        if attempts(history, signature) >= 2:
            event['kind'] = 'blocked'
            raise ValueError('input breaker open; human reset required')
        ids = posts(ROOT / 'forum.json')
        snapshot = (ROOT / 'forum.json').read_bytes()
        signature = 'snapshot:' + hashlib.sha256(snapshot).hexdigest()
        if attempts(history, signature) >= 2:
            event['kind'] = 'blocked'
            raise ValueError('breaker open; human reset required; no third attempt')
        for previous in reversed(history):
            if previous.get('signature') == signature and previous.get('kind') == 'progress':
                prior = ROOT / previous['report']
                verify(prior, prior.parent / 'input.json')
                event.update(kind='progress', ending='progress-with-state-written',
                             report=previous['report'], detail='existing report awaits human review')
                return 0
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
        run_dir = ROOT / 'automation/runs' / (stamp + '-' + uuid.uuid4().hex[:8])
        run_dir.mkdir(parents=True)
        (run_dir / 'input.json').write_bytes(snapshot)
        report = run_dir / 'report.json'
        event['report'] = str(report.relative_to(ROOT))
        if ids:
            cli = shutil.which('codex')
            if not cli:
                raise RuntimeError('Codex CLI unavailable; no installation attempted')
            for name, content in [('LOOP.md', design), ('STATE.md', state)]:
                (run_dir / name).write_text(content)
            home = run_dir / 'home'
            home.mkdir()
            env = {'PATH': os.environ.get('PATH', '/usr/bin:/bin'),
                   'HOME': str(home), 'CODEX_HOME': str(home / '.codex')}
            if os.environ.get('OPENAI_API_KEY'):
                env['OPENAI_API_KEY'] = os.environ['OPENAI_API_KEY']
            # No inherited forum tokens, MCP config, or writable model workspace.
            usage = run_dir / 'usage.jsonl'
            event['usage_log'] = str(usage.relative_to(ROOT))
            with usage.open('w') as out, (run_dir / 'stderr.log').open('w') as err:
                subprocess.run([cli, 'exec', '--skip-git-repo-check', '--ephemeral',
                                '--sandbox', 'read-only', '-c', 'sandbox_read_only.network_access=false',
                                '--json', '--output-last-message', str(report), '-'],
                               input=(ROOT / 'loop-prompt.md').read_text(), text=True,
                               cwd=run_dir, env=env, stdout=out, stderr=err,
                               timeout=120, check=True)
        else:
            report.write_text(json.dumps({'unanswered_ids': [], 'drafts': [], 'deferred_ids': []}))
        verify(report, run_dir / 'input.json')
        if (ROOT / 'forum.json').read_bytes() != snapshot:
            raise ValueError('source changed during run; human must reconcile snapshot')
        event.update(kind='progress', ending='progress-with-state-written',
                     detail='structural check passed; human quality review pending')
        return 0
    except (Exception, KeyboardInterrupt) as exc:
        event['detail'] = str(exc) or type(exc).__name__
        event['attempts'] = attempts(history, signature) + (event['kind'] == 'failure')
        return 1
    finally:
        event['signature'] = signature
        event['elapsed_seconds'] = round(time.monotonic() - started, 3)
        try:
            persist(event)
        finally:
            shutil.rmtree(LOCK)


if __name__ == '__main__':
    if len(sys.argv) == 4 and sys.argv[1] == '--verify':
        verify(Path(sys.argv[2]), Path(sys.argv[3]))
        print('Structural check passed; human quality review still required.')
    elif len(sys.argv) == 1:
        sys.exit(run())
    else:
        sys.exit('usage: runner.py [--verify REPORT INPUT]')
