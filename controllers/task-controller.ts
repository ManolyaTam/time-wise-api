import { Request, Response } from 'express';
import { ITask } from '../types/types.index';
import { Project, User } from '../models/model.index';
import { IProject } from '../types/types.index';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
require('dotenv').config();

const taskController = {
  createTask: async (req: Request, res: Response) => {
    const { projectId, beginTime, endTime, description } = req.body;
    // Check if the required fields are provided
    if (!projectId || !beginTime || !endTime || !description) {
      return res.status(400).json({ error: 'projectId, beginTime, endTime and description are required' });
    }

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
      // Check if the project ID exists in any project within the user's projects array
      const projectExists = user.projects.some((project: IProject) => project._id.toString() === projectId);

      if (!projectExists) {
        return res.status(404).json({ error: 'Project not found.' });
      }

      const taskData: ITask = {
        _id: new ObjectId(),
        projectId,
        beginTime,
        endTime,
        description,
        userEmail
      };

      user.tasks.push(taskData); // Add task to user's tasks array

      await user.save();

      res.status(201).json({ success: true });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getAllDataTasks: async (req: Request, res: Response) => {
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

      // Fetch all tasks for the user
      const tasks = user.tasks;


      // Map tasks to include additional information
      const tasksWithData = await Promise.all(tasks.map(async (task: ITask) => {
        const project = user.projects.filter((p: any) => p._id == task.projectId)[0] || null;

        if (!project) {
          throw new Error(`Project not found for task with ID: ${task._id}`);
        }
        return {
          _id: task._id,
          description: task.description,
          beginTime: task.beginTime,
          endTime: task.endTime,
          projectName: project.name,
          projectColor:project.color,
        };
      }));

      res.status(200).json({ success: true, tasks: tasksWithData });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default taskController;

