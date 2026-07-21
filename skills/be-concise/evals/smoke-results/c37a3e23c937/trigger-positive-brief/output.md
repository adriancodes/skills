I’m using the brevity skill because you asked for a short answer.

Usually it’s poor layer caching. Copy dependency files and install dependencies before copying source code; add a `.dockerignore` to exclude `node_modules`, `.git`, build output, and large files. Also check for slow package downloads, unnecessary build steps, and oversized base images.
