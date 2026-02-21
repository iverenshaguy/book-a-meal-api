#!/bin/sh
set -e

# Start SSH daemon in background (for debugging: ssh -p 2222 app@localhost)
if [ -f /usr/sbin/sshd ]; then
  mkdir -p /run/sshd
  /usr/sbin/sshd -f /etc/ssh/sshd_config
fi

# DOCKER_NEW_DB=1: destroy DB (undo all migrations), remigrate, then run seeders
# Otherwise: only run migrations (no seeders)
if [ -n "$DOCKER_NEW_DB" ]; then
  yarn sequelize-cli:es6 db:migrate:undo:all || true
fi

# Run migrations (uses DATABASE_URL from env, points at postgres service)
yarn sequelize-cli:es6 db:migrate || true

# Run seeders only when starting a fresh DB (--new flag)
if [ -n "$DOCKER_NEW_DB" ]; then
  yarn sequelize-cli:es6 db:seed:all || true
fi

# Start the API
exec node ./dist/app.js
