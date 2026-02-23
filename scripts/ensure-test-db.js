/* eslint-disable no-console */
const { config: loadEnv } = require('dotenv');
const { resolve } = require('path');
const { Client } = require('pg');

const env = process.env.NODE_ENV || 'test';
const envFilePath = env === 'test' || env === 'e2e'
  ? resolve(process.cwd(), '.env.test')
  : resolve(process.cwd(), '.env');

loadEnv({ path: envFilePath });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to ensure test DB.');
}

const testUrl = new URL(databaseUrl);
const targetDatabaseName = testUrl.pathname.replace(/^\//, '');

if (!targetDatabaseName) {
  throw new Error('DATABASE_URL must include a database name.');
}

if (!/^[A-Za-z0-9_]+$/.test(targetDatabaseName)) {
  throw new Error('Database name must contain only letters, numbers, and underscores.');
}

/**
 * Ensure the target test database exists before migrations run.
 *
 * @returns {Promise<void>} Resolves when existence check completes.
 */
async function ensureDatabaseExists() {
  const adminUrl = new URL(databaseUrl);
  adminUrl.pathname = '/postgres';

  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();

  try {
    const existsResult = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDatabaseName]
    );

    if (existsResult.rowCount > 0) {
      console.log(`Test DB "${targetDatabaseName}" already exists.`);
      return;
    }

    await client.query(`CREATE DATABASE "${targetDatabaseName}"`);
    console.log(`Created test DB "${targetDatabaseName}".`);
  } finally {
    await client.end();
  }
}

ensureDatabaseExists().catch((error) => {
  if (error instanceof Error) {
    console.error(error.stack || error.message);
  } else {
    console.error(String(error));
  }
  process.exit(1);
});
