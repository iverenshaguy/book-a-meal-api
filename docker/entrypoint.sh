#!/bin/sh
set -e

# Start SSH daemon in background (for debugging: ssh -p 2222 app@localhost)
if [ -f /usr/sbin/sshd ]; then
  mkdir -p /run/sshd
  /usr/sbin/sshd -f /etc/ssh/sshd_config
fi

# Run migrations (uses DATABASE_URL from env, points at postgres service)
yarn sequelize-cli:es6 db:migrate || true

# Run seeders (creates default users: admin, caterers, customers)
yarn sequelize-cli:es6 db:seed:all || true

# Start the API
exec node ./dist/app.js
