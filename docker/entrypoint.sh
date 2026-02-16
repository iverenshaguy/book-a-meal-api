#!/bin/sh
set -e

# Start SSH daemon in background (for debugging: ssh -p 2222 app@localhost)
if [ -f /usr/sbin/sshd ]; then
  mkdir -p /run/sshd
  /usr/sbin/sshd -f /etc/ssh/sshd_config
fi

# Start the API
exec node ./dist/app.js
