import express from 'express';


const DashboardRouter = express.Router();

//Get task for dashboard page 
DashboardRouter.get('/', projectController.createProject);



export default projectRouter;
