#!/bin/sh
# Add api.book-a-meal.local to /etc/hosts for frontend to use instead of localhost:8000
# Run with: sudo ./scripts/add-local-host.sh

HOST_ENTRY="127.0.0.1 api.book-a-meal.local"

if grep -q "api.book-a-meal.local" /etc/hosts 2>/dev/null; then
  echo "api.book-a-meal.local already in /etc/hosts"
else
  echo "$HOST_ENTRY" >> /etc/hosts
  echo "Added $HOST_ENTRY to /etc/hosts"
  echo "Frontend can use: https://api.book-a-meal.local (or http://api.book-a-meal.local:8000)"
fi
