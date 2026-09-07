I’m using the be-concise skill to keep this brief and actionable.

Usually it’s poor cache reuse. Copy dependency files and install first, then copy your code; add a `.dockerignore` to exclude `node_modules`, `.git`, build outputs, and other large files. Also check slow package downloads and oversized base images.
