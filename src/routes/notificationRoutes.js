import express from 'express';
import NotificationController from 'src/controllers/NotificationController';
import asyncWrapper from 'src/helpers/asyncWrapper';
import Authorization from 'src/middlewares/Authorization';

const notificationRoutes = express.Router();

notificationRoutes.use(Authorization.authorize);

notificationRoutes.get('/', asyncWrapper(NotificationController.getNotifications));

export default notificationRoutes;
