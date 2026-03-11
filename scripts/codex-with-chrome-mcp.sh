#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

exec codex \
  -C "$repo_root" \
  -c 'mcp_servers.chrome-devtools.command="/home/qi/.codex/memories/chrome-devtools-mcp-xvfb"' \
  "$@"
