import express from 'express';
import projectController from '../controllers/project-controller';

const projectRouter = express.Router();

// Create a new project
projectRouter.post('/', projectController.createProject);

export default projectRouter;
