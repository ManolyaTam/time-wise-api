import { Request, Response } from 'express';
import { Project } from '../models/model.index';
import { IProject } from '../types/types.index';
const projectController = {

  createProject: async (req: Request, res: Response) => {
    const projectData: IProject = {
      name: req.body.name,
      color: req.body.color,
      projectHours: req.body.projectHours,
      description: req.body.description
    };

    const newProject = new Project(projectData);

    await newProject.save()
      .then(() => res.status(201).json({ success: true }))
      .catch((error) => {
        console.log('error\n')
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
      })
  }
}

export default projectController;
