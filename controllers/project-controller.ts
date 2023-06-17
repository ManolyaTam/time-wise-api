import { Request, Response } from 'express';
import { Project, User } from '../models/model.index';
import { IProject } from '../types/types.index';
import jwt, { JwtPayload } from 'jsonwebtoken';
  import { ObjectId } from 'mongodb';

require('dotenv').config();

const projectController = {
  createProject: async (req: Request, res: Response) => {
    const { name, color, description } = req.body;
  
    // Check if the required fields are provided
    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required fields.' });
    }
  
    let projectHours = 0;
    const token = req.body.token || req.query.token || req.headers['token'];
  
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
  
      // Find the user based on the email
      const user = await User.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if the project name already exists for the current user
      const existingProject = user.projects.find((project: IProject) => project.name === name);
  
      if (existingProject) {
        return res.status(409).json({ error: 'Project name already exists for the current user.' });
      }
  
      const projectData: Omit<IProject, '_id'> = {
        name,
        color,
        projectHours,
        description,
        userEmail,
      };
  
      user.projects.push(projectData); // Add project to user's projects array
  
      await user.save();
  
      res.status(201).json({ success: true, project: projectData });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
,
 
  getAllProjectsData: async (req: Request, res: Response) => {
    const token = req.body.token || req.query.token || req.headers['token'];
  
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
  
      const user = await User.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      const projects = user.projects.map((project: IProject) => {
        // Omit the userEmail field and include the id field
        const { userEmail, _id, ...rest } = project;
        return { id: _id, ...rest };
      });
  
      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
,  

  getAllProjectsNames: async (req: Request, res: Response) => {
    const token = req.body.token || req.query.token || req.headers['token'];

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

      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const projects = user.projects.map((project: { _id: string; name: string }) => ({
        id: project._id,
        name: project.name
      }))

      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default projectController;
