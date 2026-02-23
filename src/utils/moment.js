import { resolve } from 'path';

import { config as loadEnv } from 'dotenv';
import moment from 'moment-timezone';

const environment = process.env.NODE_ENV || 'development';
const envFilePath = environment === 'test' || environment === 'e2e'
  ? resolve(process.cwd(), '.env.test')
  : resolve(process.cwd(), '.env');

loadEnv({ path: envFilePath });

moment.tz.setDefault(process.env.TZ || 'UTC');

export default moment;
