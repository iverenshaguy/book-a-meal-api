#!/bin/sh
set -e

echo "Running database migrations..."
yarn sequelize-cli:es6 db:migrate

echo "Starting API..."
exec node ./dist/app.js
