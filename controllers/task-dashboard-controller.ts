import { Request, Response } from 'express';
import { User } from '../models/model.index';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ITask } from '../types/types.index';
import { IProject } from '../models/project-schema';
require('dotenv').config();
const barChartController = {
  getBarChartData: async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    console.log(startDate);

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

      // Filter tasks within the given date range for the user
      const tasks = user.tasks.filter((task: ITask) => {
        const taskDate = task.beginTime
        if (!startDate) {
          return res.status(400).json({ error: 'Missing startDate' });
        }

        if (!endDate) {
          return res.status(400).json({ error: 'Missing endDate' });
        }

        // Convert startDate and endDate to numbers
        const parsedStartDate = parseInt(startDate.toString());
        const parsedEndDate = parseInt(endDate.toString());

        // Check if parsedStartDate and parsedEndDate are valid numbers
        if (isNaN(parsedStartDate)) {
          return res.status(400).json({ error: 'Invalid startDate' });
        }

        if (isNaN(parsedEndDate)) {
          return res.status(400).json({ error: 'Invalid endDate' });
        }

        // Perform the comparison
        return taskDate >= parsedStartDate && taskDate <= parsedEndDate;;

      });
      // Map tasks to include additional information
      const tasksWithData = tasks.reduce((result: any[], task: ITask) => {
        const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;

        if (!project) {
          throw new Error(`Project not found for task with ID: ${task._id}`);
        }

        const taskDate = new Date(parseInt(task.beginTime.toString()));

        // Check if the parsed date is valid
        if (isNaN(taskDate.getTime())) {
          throw new Error(`Invalid date format for task with ID: ${task._id}`);
        }

        const formattedDate = taskDate.toLocaleDateString();

        // Check if the date already exists in the result array
        const existingDate = result.find((item: any) => item.date === formattedDate);

        // If the date exists, increment the project's total hours
        if (existingDate) {
          if (existingDate.hasOwnProperty(project.name)) {
            existingDate[project.name] += task.endTime - task.beginTime;
          } else {
            existingDate[project.name] = task.endTime - task.beginTime;
          }
        } else {
          // If the date doesn't exist, create a new object with the date and project's total hours
          const newDateObject: any = {
            date: formattedDate,
            [project.name]: task.endTime - task.beginTime,
          };
          result.push(newDateObject);
        }

        return result;
      }, []);

      // Format the result to match the desired output structure
      const timeline = tasksWithData.map((item: any) => {
        const formattedItem: any = {
          date: item.date,
        };

        for (const [project, hours] of Object.entries(item)) {
          if (project !== 'date') {
            formattedItem[project] = hours;
          }
        }

        return formattedItem;
      });

      res.status(200).json({ success: true, timeline: timeline });


    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default barChartController;

