#!/bin/sh
# Docker setup: add api.book-a-meal.local to /etc/hosts and generate HTTPS certs
# Run as part of yarn setup:dev or standalone: yarn docker:setup

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Docker setup ==="

# Add host entry (requires sudo)
sudo "$SCRIPT_DIR/add-local-host.sh"

# Generate HTTPS certs
"$SCRIPT_DIR/generate-mkcert.sh"

echo "Docker setup complete. Use https://api.book-a-meal.local with yarn docker:up"
