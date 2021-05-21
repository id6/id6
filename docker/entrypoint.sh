#!/usr/bin/env bash
set -e

caddy start --config /etc/caddy/Caddyfile --adapter caddyfile

exec "$@"
