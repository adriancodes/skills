"""Independent adversarial and failure controls for the storage helper."""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import subprocess
from unittest.mock import patch

module_path = Path(__file__).resolve().parents[1] / "scripts/local_env.py"
spec = importlib.util.spec_from_file_location("local_env", module_path)
env = importlib.util.module_from_spec(spec)
spec.loader.exec_module(env)

values = ["x", "a,b=c", "a'\"$\\", "a'b\\n", "café雪", "\ufefftoken", "0", "-9223372036854775809", "false", "a # b", " a "]
with tempfile.TemporaryDirectory() as directory:
    destination = Path(directory) / ".env.local"
    original = '\ufeff# user\r\nOTHER="a,b"\r\nOTHER=last\r\nragged line\r\n'.encode("utf-8")
    for value in values:
        destination.write_bytes(original)
        env.store_value(destination, "TEST_KEY", value)
        assert env.read_value(destination, "TEST_KEY") == value
        observed = subprocess.run(["node", "-e", 'process.loadEnvFile(process.argv[1]);process.stdout.write(JSON.stringify(process.env.TEST_KEY))', str(destination)],
                                  env={k:v for k,v in os.environ.items() if k != "TEST_KEY"}, capture_output=True, text=True, timeout=5, check=True)
        assert json.loads(observed.stdout) == value, "Actual Node consumer changed the value"
        assert destination.read_bytes().startswith(original)
        assert destination.stat().st_mode & 0o777 == 0o600
        saved = destination.read_bytes()
        try:
            env.store_value(destination, "TEST_KEY", "replacement")
        except env.SetupError:
            pass
        else:
            raise AssertionError("Refusal control accepted an unconfirmed overwrite")
        assert destination.read_bytes() == saved
        env.store_value(destination, "TEST_KEY", "replacement", replace=True)
        assert env.read_value(destination, "TEST_KEY") == "replacement"
    for invalid in ["", " ", "a\nb", "a\rb", "\x00", "\ud800", "a\u2028b", "a'\"`", "a'`b\\n", None, True, 1, ["x"]]:
        destination.write_bytes(original)
        try:
            env.store_value(destination, "TEST_KEY", invalid)
        except env.SetupError:
            pass
        else:
            raise AssertionError("Invalid input was accepted")
        assert destination.read_bytes() == original
    destination.write_text('TEST_KEY="first"\nOTHER=keep\nTEST_KEY="second"\n')
    try:
        env.read_value(destination, "TEST_KEY")
    except env.SetupError:
        pass
    else:
        raise AssertionError("Duplicate target control did not fail")
    env.store_value(destination, "TEST_KEY", "one", replace=True)
    assert env.read_value(destination, "TEST_KEY") == "one"
    assert "OTHER=keep\n" in destination.read_text()
    link = Path(directory) / "link"
    link.symlink_to(destination)
    previous = destination.read_bytes()
    try:
        env.store_value(link, "TEST_KEY", "bad", replace=True)
    except env.SetupError:
        pass
    else:
        raise AssertionError("Symlink control did not fail")
    assert destination.read_bytes() == previous
    destination.write_bytes(original)
    actual_read = env._read
    count = 0
    def changed_read(file):
        global count
        count += 1
        if count == 2:
            destination.write_bytes(original + b"CONCURRENT=preserve\n")
        return actual_read(file)
    with patch.object(env, "_read", changed_read):
        try:
            env.store_value(destination, "TEST_KEY", "x")
        except env.SetupError:
            pass
        else:
            raise AssertionError("Concurrent-change control did not fail")
    assert destination.read_bytes() == original + b"CONCURRENT=preserve\n"
    assert not list(Path(directory).glob(".setup-*"))
    multiline = b'USER_FLAG="first\nTEST_KEY=literal-data\nlast"\nOTHER=001\n'
    continuation = b'USER_FLAG=first\\\nTEST_KEY=literal-data\nOTHER=001\n'
    escaped = b'USER_FLAG="say \\"first\nTEST_KEY=literal-data\n"\nOTHER=001\n'
    for ambiguous in (multiline, continuation, escaped):
        for confirmation in (False, True):
            destination.write_bytes(ambiguous)
            try:
                env.store_value(destination, "TEST_KEY", "synthetic-new", replace=confirmation)
            except env.SetupError:
                pass
            else:
                raise AssertionError("Multiline configuration was not rejected safely")
            assert destination.read_bytes() == ambiguous
    bom = '\ufeffTEST_KEY="existing"\nOTHER=keep\n'.encode("utf-8")
    destination.write_bytes(bom)
    try:
        env.store_value(destination, "TEST_KEY", "new")
    except env.SetupError:
        pass
    else:
        raise AssertionError("BOM bypassed confirmation")
    assert destination.read_bytes() == bom
print("PASS: nine adversarial classes, preservation, overwrite, duplicate, symlink and concurrent-change controls")
