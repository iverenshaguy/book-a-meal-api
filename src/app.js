import { resolve } from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';

import '@babel/polyfill';

import errors from 'src/lib/errors.json';
import { NotificationEventEmitter, OrderEventEmitter } from './eventEmitters';
import { NotificationEventHandler, OrderEventHandler } from './eventHandlers';
import ErrorHandler from './middlewares/ErrorHandler';
import apiRoutes from './routes';

const environment = process.env.NODE_ENV || 'development';
const envFilePath = environment === 'test' || environment === 'e2e'
  ? resolve(process.cwd(), '.env.test')
  : resolve(process.cwd(), '.env');
config({ path: envFilePath });

const app = express();

app.use(cors());

app.use(helmet());

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(resolve(process.cwd(), 'docs')));

app.use(apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: errors[404] });
});

OrderEventEmitter.on('create', OrderEventHandler.startOrderProcess);
OrderEventEmitter.on('deliver', OrderEventHandler.markOrderAsDelivered);
NotificationEventEmitter.on(
  'createMenu',
  NotificationEventHandler.menuForTheDay,
);

app.use(ErrorHandler.sendError);

const port = process.env.PORT || 8000;

const server = environment === 'test' ? null : app.listen(port);

export { server };
export default app;
