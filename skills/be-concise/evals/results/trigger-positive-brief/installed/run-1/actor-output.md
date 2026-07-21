I’m using the `tldr` skill to keep this concise.

Usually it’s poor cache use. Copy dependency files first, install dependencies, then copy source code; add `.dockerignore` to exclude `node_modules`, `.git`, logs, and build output. Also check for slow package downloads, large base images, and unnecessary rebuild stages.
