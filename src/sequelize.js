import { resolve } from 'path';

import { config as getEnv } from 'dotenv';

const environment = process.env.NODE_ENV || 'development';
const envFilePath = environment === 'test' || environment === 'e2e'
  ? resolve(process.cwd(), '.env.test')
  : resolve(process.cwd(), '.env');
getEnv({ path: envFilePath });

const devMode = environment !== 'production';

const databaseUrls = {
  development: process.env.DATABASE_URL,
  staging: process.env.DATABASE_URL,
  test: process.env.DATABASE_URL,
  e2e: process.env.DATABASE_URL,
  production: process.env.DATABASE_URL,
};

export const url = databaseUrls[environment];
export const config = {
  dialect: 'postgres',
  logging: devMode ? (log) => log : false,
};

// Sequelize CLI (migrations) expects env keys; models use url/config
module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: devMode,
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
  },
  staging: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: devMode,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
  },
  url: databaseUrls[environment],
  config: {
    dialect: 'postgres',
    logging: devMode ? (log) => log : false,
  },
};
