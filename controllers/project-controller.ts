import { Request, Response } from 'express';
import { Project } from '../models/model.index';
import { IProject } from '../types/types.index';
import jwt, { JwtPayload } from 'jsonwebtoken';
require('dotenv').config();

const projectController = {
  createProject: async (req: Request, res: Response) => {
    const { name, color, description } = req.body;

    // Check if the required fields are provided
    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color is  required fields 😌' });
    }

    let projectHours = 0;
    const token = req.body.token || req.query.token || req.headers['token'];

    try {
      // Check if the project name already exists
      const existingProject = await Project.findOne({ name });

      if (existingProject) {
        return res.status(409).json({ error: 'Project name already exists 😁' });
      }

      // Check if the token is present
      if (!token) {
        return res.status(401).json({ error: 'Missing token' });
      }

      // Verify and decode the token to get the user's email
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY || 'defaultSecretKey');

      // Type guard to check if the decodedToken is not void
      if (!decodedToken) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Type assertion to specify the type as { email: string }
      const userEmail = (decodedToken as JwtPayload & { email: string }).email;

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
  getAllProjectsNames: async (req: Request, res: Response) => {
    const token = req.body.token || req.query.token || req.headers['token']

    try {
      // Check if the token is present
      if (!token) {
        return res.status(401).json({ error: 'Missing token' });
      }

      // Verify and decode the token to get the user's email
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY || 'defaultSecretKey');

      // Type guard to check if the decodedToken is not void
      if (!decodedToken) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Type assertion to specify the type as { email: string }
      const userEmail = (decodedToken as JwtPayload & { email: string }).email;

      const projects = await Project.find({ userEmail }).select('name ');
      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllProjectsData: async (req: Request, res: Response) => {
    const token = req.body.token || req.query.token || req.headers['token']

    try {
      // Check if the token is present
      if (!token) {
        return res.status(401).json({ error: 'Missing token' });
      }

      // Verify and decode the token to get the user's email
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY || 'defaultSecretKey');

      // Type guard to check if the decodedToken is not void
      if (!decodedToken) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Type assertion to specify the type as { email: string }
      const userEmail = (decodedToken as JwtPayload & { email: string }).email;

      const projects = await Project.find({ userEmail }).select('name color  description projectHours');
      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default projectController;
