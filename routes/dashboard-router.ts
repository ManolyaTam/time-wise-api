import express from 'express';
import barChartController from '../controllers/dashboard-controller';


const dashboardRouter = express.Router();

dashboardRouter.get('/bar-chart', barChartController.getBarChartData);
dashboardRouter.get('/doughnut-chart', barChartController.getDoughnutChartData);

export default dashboardRouter;
