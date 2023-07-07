import express from 'express';
import barChartController from '../controllers/dashboard-controller';

const dashboardRouter = express.Router();

dashboardRouter.get('/bar-chart', barChartController.getBarChartData);

export default dashboardRouter;
