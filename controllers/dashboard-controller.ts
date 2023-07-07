import { Request, Response } from 'express';
import { User } from '../models/model.index';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ITask } from '../types/types.index';
import { IProject } from '../models/project-schema';
require('dotenv').config();

const barChartController = {
  getBarChartData: async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

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

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Missing start or end date' });
      }
      if (startDate >= endDate) {
        return res.status(400).json({ error: 'invalid date' });

      }

      const startTimestamp = new Date(parseInt(startDate.toString()));
      const endTimestamp = new Date(parseInt(endDate.toString()));

      // Filter tasks within the given date range for the user with status "stopped"
      const stoppedTasks = user.tasks.filter((task: ITask) => {
        const taskDate = new Date(parseInt(task.beginTime.toString()));
        return taskDate >= startTimestamp && taskDate <= endTimestamp && task.status === 'stopped';
      });


      // Create an array of all dates within the range
      const dateRange: Date[] = [];
      const currentDate = new Date(startTimestamp);

      while (currentDate <= endTimestamp) {
        dateRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      const timeline: { [date: string]: { [project: string]: number } }[] = [];

      // Loop through each date in the range
      for (const date of dateRange) {
        const formattedDate = date.toLocaleDateString();

        const projectsData: { [project: string]: number } = {};

        // Loop through each stopped task on the current date
        for (const task of stoppedTasks) {
          const taskDate = new Date(parseInt(task.beginTime.toString()));

          if (taskDate.toLocaleDateString() === formattedDate) {
            const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;

            if (!project) {
              throw new Error(`Project not found for task with ID: ${task._id}`);
            }

            const duration = task.endTime - task.beginTime;

            if (projectsData[project.name]) {
              projectsData[project.name] += duration;
            } else {
              projectsData[project.name] = duration;
            }
          }
        }

        // Convert project durations from milliseconds to hours
        const projectHours: { [project: string]: number } = {};

        for (const [project, duration] of Object.entries(projectsData)) {
          projectHours[project] = duration / 3600000; // Convert to hours
        }

        // Add the date and projects data to the timeline array
        const timelineData: { [project: string]: number } = { ...projectHours };
        //Add the date and projects data to the timeline array
        timeline.push({ [formattedDate]: { ...timelineData } });


      }

      res.status(200).json({ success: true, timeline });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default barChartController;
