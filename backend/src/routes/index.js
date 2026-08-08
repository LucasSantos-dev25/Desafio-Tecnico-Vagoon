import { Router } from 'express';
import authRoutes from './auth.routes.js';
import activityRoutes from './activity.routes.js';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/activities', activityRoutes);

export default routes;