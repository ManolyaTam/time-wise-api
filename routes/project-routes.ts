import express from 'express';
import projectController from '../controllers/project-controller';

const projectRouter = express.Router();

// Create a new project
projectRouter.post('/', projectController.createProject);

//Get all project Data
projectRouter.get('/cards', projectController.getAllProjectsData);

//Get all project Name
projectRouter.get('/list', projectController.getAllProjectsNames);


export default projectRouter;
