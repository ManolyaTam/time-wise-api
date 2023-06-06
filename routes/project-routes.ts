import express from 'express';
import projectController from '../controllers/project-controller';

const projectRouter = express.Router();

// // Get all projects
// projectRouter.get('/', projectController.getAllProjects);

// Create a new project
projectRouter.post('/', projectController.createProject);

export default projectRouter;
