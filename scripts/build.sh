#!/usr/bin/env bash

# import .env variables into bash environment
export $(cat .env | xargs)

case $NODE_ENV in
  "development"|"test")
    npm-run-all build
    ;;
  "production")
    npm-run-all build
    yarn db:migrate
    ;;
  "staging")
    npm-run-all build
    yarn db:setup
    ;;
esac
