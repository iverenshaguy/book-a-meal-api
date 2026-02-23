import express from 'express';
import menuRoutes from './menuRoutes';
import authRoutes from './authRoutes';
import mealRoutes from './mealRoutes';
import orderRoutes from './orderRoutes';
import notificationRoutes from './notificationRoutes';

const apiRoutes = express.Router();

apiRoutes.use('/menu', menuRoutes);
apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/meals', mealRoutes);
apiRoutes.use('/orders', orderRoutes);
apiRoutes.use('/notifications', notificationRoutes);

export default apiRoutes;
