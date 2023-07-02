import { Request, Response } from 'express';
import { Task, User, Project } from '../models/model.index';
import { ITask, IUser, IProject } from '../types/types.index';
import jwt, { Secret } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
require('dotenv').config();

interface ProjectDailyTotals {
  date: string;
  projects: {
    [key: string]: number;
  };
}

const taskDashboardController = {
  getTaskDashboardData: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      // Verify and decode token
      if (!token) {
        return res.status(401).json({ error: 'Token not found' });
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as Secret);
      const userId = decoded.userId;


      const user: IUser | null = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const fromDate = String(req.query.fromDate);
      const toDate = String(req.query.toDate);

      // Validate fromDate and toDate input
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: 'fromDate and toDate are required' });
      }

      // Convert fromDate and toDate to Date objects
      const fromDateTime = new Date(fromDate);
      const toDateTime = new Date(toDate);

      // Convert Date objects to ISO strings
      const fromDateString = fromDateTime.toISOString();
      const toDateString = toDateTime.toISOString();

      // Retrieve tasks from the database
      const tasks: ITask[] = await Task.find({
        date: {
          $gte: fromDateString,
          $lte: toDateString,
        },
        user: userId,
      });

      // Calculate project totals for each day
      const projectTotals: ProjectDailyTotals[] = [];
      const dateSet = new Set();

      tasks.forEach((task: ITask) => {
        const taskStartDate = new Date(task.beginTime);
        const taskEndDate = new Date(task.endTime);
        const taskDate = taskStartDate.toISOString().slice(0, 10);

        if (!dateSet.has(taskDate)) {
          dateSet.add(taskDate);
          const projectTotal: ProjectDailyTotals = {
            date: taskDate,
            projects: {},
          };
          projectTotals.push(projectTotal);
        }
        const fromDateTime = new Date(fromDate); // Convert fromDate to Date object
const toDateTime = new Date(toDate); // Convert toDate to Date object

const projectTotal = projectTotals.find((total) => {
  const taskStartDate = new Date(task.beginTime); // Assuming task.begin represents the task start date
  const taskEndDate = new Date(task.endTime); // Assuming task.end represents the task end date
  const taskDuration = taskEndDate.getTime() - taskStartDate.getTime();
  const taskTotalHours = taskDuration / (1000 * 60 * 60); // Convert milliseconds to hours

  return taskStartDate >= fromDateTime && taskEndDate <= toDateTime;
});

if (projectTotal) {
  const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId) || null;
  if (project) {
    const projectName = project.name;
    if (projectTotal.projects.hasOwnProperty(projectName)) {
      projectTotal.projects[projectName] += ;
    } else {
      projectTotal.projects[projectName] = taskTotalHours;
    }
  }
}

        // const fromDateTime = new Date(fromDate); // Convert fromDate to Date object
        // const toDateTime = new Date(toDate); // Convert toDate to Date object

        // const projectTotal = projectTotals.find((total) => {
        //   const taskStartDate = new Date(task.beginTime); // Assuming task.begin represents the task start date
        //   const taskEndDate = new Date(task.endTime); // Assuming task.end represents the task end date
        //   const taskDuration = taskEndDate.getTime() - taskStartDate.getTime();
        //   const taskTotalHours = taskDuration / (1000 * 60 * 60); // Convert milliseconds to hours
        
        //   return taskStartDate >= fromDateTime && taskEndDate <= toDateTime;
        // });
        
        // if (projectTotal) {
        //   const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId) || null;
        //   if (project) {
        //     const projectName = project.name;
        //     if (projectTotal.projects.hasOwnProperty(projectName)) {
        //       projectTotal.projects[projectName] += taskTotalHours;
        //     } else {
        //       projectTotal.projects[projectName] = taskTotalHours;
        //     }
        //   }
        
        
        // const projectTotal = projectTotals.find((total) => {
        //   const taskStartDate = new Date(task.beginTime); // Assuming task.begin represents the task start date
        //   const taskEndDate = new Date(task.endTime); // Assuming task.end represents the task end date

        //   return taskStartDate >= fromDateTime && taskEndDate <= toDateTime;
        // });

        // if (projectTotal) {
        //   const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId) || null;
        //   if (project) {
        //     const projectName = project.name;
        //     if (projectTotal.projects.hasOwnProperty(projectName)) {
        //       projectTotal.projects[projectName] += task.totalHours;
        //     } else {
        //       projectTotal.projects[projectName] = task.totalHours;
        //     }
        //   }
        // }


        // const projectTotal = projectTotals.find((total) => total.date === taskDate);
        // if (projectTotal) {
        //   const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;
        //   if (project) {
        //     const projectName = project.name;
        //     if (projectTotal.projects.hasOwnProperty(projectName)) {
        //       projectTotal.projects[projectName] += task.totalHours;
        //     } else {
        //       projectTotal.projects[projectName] = task.totalHours;
        //     }
        //   }
        // }
      });

      return res.json(projectTotals);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },
};

export default taskDashboardController;

