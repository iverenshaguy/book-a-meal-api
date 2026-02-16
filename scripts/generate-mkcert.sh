#!/bin/sh
# Generate HTTPS certs for api.book-a-meal.local
# Run once: yarn docker:certs (or ./scripts/generate-mkcert.sh)
# Uses mkcert for trusted certs (no browser warning), or openssl fallback

set -e

DOMAIN="api.book-a-meal.local"
CERTS_DIR="$(dirname "$0")/../docker/certs"

mkdir -p "$CERTS_DIR"
cd "$CERTS_DIR"

if command -v mkcert >/dev/null 2>&1; then
  mkcert -install 2>/dev/null || true
  mkcert -cert-file cert.pem -key-file key.pem "$DOMAIN"
  echo "Generated trusted certs (mkcert) in docker/certs/"
  echo "Frontend: https://$DOMAIN (no browser warning)"
else
  echo "mkcert not found, using self-signed cert (browser will warn)"
  echo "Install mkcert for trusted certs: brew install mkcert"
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout key.pem -out cert.pem \
    -subj "/CN=$DOMAIN" -addext "subjectAltName=DNS:$DOMAIN"
  echo "Frontend: https://$DOMAIN"
fi
