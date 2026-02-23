/* eslint-disable import/no-extraneous-dependencies */
import mockDate from 'mockdate';
import nodemailer from 'nodemailer';
import { server } from 'src/app';
import database from 'src/models';
import moment from 'src/utils/moment';

import userSeeder from '../db/seeders/20180503005326-user';
import mealSeeder from '../db/seeders/20180503005347-meal';
import menuSeeder from '../db/seeders/20180503005353-menu';
import orderSeeder from '../db/seeders/20180503005402-order';
import orderItemSeeder from '../db/seeders/20180503005412-order-item';
import notificationSeeder from '../db/seeders/20180503005423-notification';
import menuMealSeeder from '../db/seeders/20180504084255-menu-meal';

const transport = {
  sendMail: (data) => data,
};
const currentDay = moment().format('YYYY-MM-DD');
const FIXED_TEST_DATE = moment(
  `${currentDay} 13:00:00`,
  'YYYY-MM-DD HH:mm:ss',
).valueOf();

const { sequelize } = database;
const { queryInterface } = sequelize;

const truncateDatabase = () =>
  sequelize.query(
    'TRUNCATE "Users", "Meals", "Menu", "MenuMeals", "Orders", "OrderItems", "Notifications" CASCADE',
  );

const seedDatabase = async () => {
  await userSeeder.up(queryInterface);
  await mealSeeder.up(queryInterface);
  await menuSeeder.up(queryInterface);
  await menuMealSeeder.up(queryInterface);
  await orderSeeder.up(queryInterface);
  await orderItemSeeder.up(queryInterface);
  await notificationSeeder.up(queryInterface);
};

jest.spyOn(nodemailer, 'createTransport').mockReturnValue(transport);
mockDate.set(FIXED_TEST_DATE);

beforeAll(async () => {
  await truncateDatabase();
  await seedDatabase();
});

beforeEach(() => {
  mockDate.set(FIXED_TEST_DATE);
});

afterAll(async () => {
  mockDate.reset();
  jest.restoreAllMocks();

  if (!server || typeof server.close !== 'function') return;

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});
