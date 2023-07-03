import express from 'express';
import barChartController from '../controllers/task-dashboard-controller';

const router = express.Router();

router.get('/bar-chart', barChartController.getBarChartData);

export default router;
