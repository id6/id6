#!/usr/bin/env bash
set -e

# TODO remove this in prod
npm install sqlite3 pg --save

caddy start --config /etc/caddy/Caddyfile --adapter caddyfile

exec "$@"
