FROM mcr.microsoft.com/devcontainers/typescript-node:20

# Python and CLI helpers for local scripts
COPY requirements.txt /tmp/requirements.txt

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-pip curl ca-certificates && \
    pip3 install --no-cache-dir -r /tmp/requirements.txt && \
    rm -rf /var/lib/apt/lists/*

# actionlint for GitHub Actions YAML
RUN curl -s https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash | bash

# Global formatters/linters commonly used in the project
RUN npm install -g eslint prettier
