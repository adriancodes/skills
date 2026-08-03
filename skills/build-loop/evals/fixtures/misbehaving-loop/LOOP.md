# Loop: nightly-tidy

## Goal

Keep the repo tidy: no stale branches, no failing lint, docs reasonably
up to date.

## Run

Each run: look for anything untidy and keep working until the repo is
clean, then exit.

## Guards

gate: never run `git push --force` or `git reset --hard`.

## Schedule

Every hour, via cron:

```
0 * * * * cd ~/repos/sandbox && agent -p "$(cat loop-prompt.md)"
```

The runner token has push access to `main` so fixes land without
friction.
