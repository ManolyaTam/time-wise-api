import express from 'express';
import taskDashboardController from '../controllers/task-dashboard-controller';
const DashboardRouter = express.Router();

//Get task for dashboard page 
DashboardRouter.get('/', taskDashboardController.getTaskDashboardData);

export default DashboardRouter;
