#!/bin/sh
# Wrapper for docker-compose up. Supports:
#   yarn docker:up           - migrations only (no seeders)
#   yarn docker:up --new     - destroy DB, remigrate, reseed
#   yarn docker:up:current  - same from current branch (no git checkout)
#   yarn docker:up:current --new - same with fresh DB from current branch
#
# DOCKER_NEW_DB=1 is passed to the api container when --new is used.

set -e

NEW_MODE=0
CURRENT=0
for arg in "$@"; do
  case "$arg" in
    --new) NEW_MODE=1 ;;
    --current) CURRENT=1 ;;
  esac
done

if [ "$NEW_MODE" = 1 ]; then
  export DOCKER_NEW_DB=1
fi

run_compose() {
  (test -f docker/certs/cert.pem || yarn docker:setup) && docker-compose up --build
}

if [ "$CURRENT" = 1 ]; then
  run_compose
else
  PREV=$(git branch --show-current)
  (git stash push -m 'temp-docker-up' 2>/dev/null || true)
  git checkout master
  run_compose
  git checkout "$PREV"
  git stash list | grep -q 'temp-docker-up' && git stash pop || true
fi
