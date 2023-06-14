import { Request, Response } from 'express';
import { Project } from '../models/model.index';
import { IProject } from '../types/types.index';

const projectController = {
  createProject: async (req: Request, res: Response) => {
    const { name, color, projectHours, description, userEmail } = req.body;

    try {
      // Check if the project name already exists
      const existingProject = await Project.findOne({ name });

      if (existingProject) {
        return res.status(409).json({ error: 'Project name already exists' });
      }

      const projectData: IProject = {
        name,
        color,
        projectHours,
        description,
        userEmail,
      };

      const newProject = new Project(projectData);

      await newProject.save();
      res.status(201).json({ success: true });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllProjects: async (req: Request, res: Response) => {
    const userEmail = req.body.userEmail;

    try {
      const projects = await Project.find({ userEmail }).select('name color');
      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default projectController;
