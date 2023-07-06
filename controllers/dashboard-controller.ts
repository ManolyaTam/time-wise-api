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
      }// Filter tasks within the given date range for the user with status "stopped"
      const stoppedTasks = user.tasks.filter((task: ITask) => {
        const taskDate = task.beginTime;

        if (!startDate || !endDate) {
          return res.status(400).json({ error: 'Missing start or end date' });
        }

        const startTimestamp = parseInt(startDate.toString());
        const endTimestamp = parseInt(endDate.toString());

        return taskDate >= startTimestamp && taskDate <= endTimestamp && task.status === "stopped";
      });

      // Group tasks by date
      const tasksByDate: { [date: string]: { [project: string]: number } } = {};

      stoppedTasks.forEach((task: ITask) => {
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

        if (!tasksByDate[formattedDate]) {
          tasksByDate[formattedDate] = {};
        }

        if (task.endTime) {
          const duration = task.endTime - task.beginTime;
          const projectHours = tasksByDate[formattedDate][project.name] || 0;
          tasksByDate[formattedDate][project.name] = projectHours + duration;
        }
      });
      // Format the result array
      const timeline: { [date: string]: { [project: string]: number } }[] = [];

      for (const [date, projects] of Object.entries(tasksByDate)) {
        const projectData: { [project: string]: number } = {};

        for (const [name, totalHours] of Object.entries(projects)) {
          projectData[name] = totalHours / 3600; // Convert to hours
        }

        timeline.push({ [date]: projectData });
      }

      console.log('Timeline:', timeline);

      res.status(200).json({ success: true, timeline });



      //       // Filter tasks within the given date range for the user with status "stopped"
      // const stoppedTasks = user.tasks.filter((task: ITask) => {
      //   const taskDate = task.beginTime;

      //   if (!startDate || !endDate) {
      //     return res.status(400).json({ error: 'Missing start or end date' });
      //   }

      //   const startTimestamp = parseInt(startDate.toString());
      //   const endTimestamp = parseInt(endDate.toString());

      //   return taskDate >= startTimestamp && taskDate <= endTimestamp && task.status === "stopped";
      // });

      // // Map tasks to include additional information
      // const tasksByDate: { [date: string]: { [project: string]: number } } = {};

      // stoppedTasks.forEach((task: ITask) => {
      //   const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;

      //   if (!project) {
      //     throw new Error(`Project not found for task with ID: ${task._id}`);
      //   }

      //   const taskDate = new Date(parseInt(task.beginTime.toString()));

      //   // Check if the parsed date is valid
      //   if (isNaN(taskDate.getTime())) {
      //     throw new Error(`Invalid date format for task with ID: ${task._id}`);
      //   }

      //   const formattedDate = taskDate.toLocaleDateString();

      //   if (!tasksByDate[formattedDate]) {
      //     tasksByDate[formattedDate] = {};
      //   }

      //   if (task.endTime) {
      //     const duration = task.endTime - task.beginTime;
      //     const projectHours = tasksByDate[formattedDate][project.name] || 0;
      //     tasksByDate[formattedDate][project.name] = projectHours + duration;
      //   }
      // });

      // // Format the result array
      // const result: { date: string, projects: { name: string, totalHours: number }[] }[] = [];

      // for (const [date, projects] of Object.entries(tasksByDate)) {
      //   const projectData = Object.entries(projects).map(([name, totalHours]) => ({
      //     name,
      //     totalHours: totalHours / 3600, // Convert to hours
      //   }));

      //   result.push({ date, projects: projectData });
      // }

      // console.log('Result:', result);

      // res.status(200).json({ success: true, timeline:result  });
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};



// // Filter tasks within the given date range for the user
// const tasks = user.tasks.filter((task: ITask) => {
//   const taskDate = task.beginTime;
//   if (!startDate) {
//     return res.status(400).json({ error: 'Missing startDate' });
//   }

//   if (!endDate) {
//     return res.status(400).json({ error: 'Missing endDate' });
//   }

//   // Convert startDate and endDate to numbers
//   const parsedStartDate = parseInt(startDate.toString());
//   const parsedEndDate = parseInt(endDate.toString());

//   // Check if parsedStartDate and parsedEndDate are valid numbers
//   if (isNaN(parsedStartDate)) {
//     return res.status(400).json({ error: 'Invalid startDate' });
//   }

//   if (isNaN(parsedEndDate)) {
//     return res.status(400).json({ error: 'Invalid endDate' });
//   }

//   // Perform the comparison
//   return taskDate >= parsedStartDate && taskDate <= parsedEndDate;
// });

// // Map tasks to include additional information
// const tasksWithData = tasks.reduce((result: any[], task: ITask) => {
//   const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;

//   if (!project) {
//     throw new Error(`Project not found for task with ID: ${task._id}`);
//   }

//   const taskDate = new Date(parseInt(task.beginTime.toString()));

//   // Check if the parsed date is valid
//   if (isNaN(taskDate.getTime())) {
//     throw new Error(`Invalid date format for task with ID: ${task._id}`);
//   }

//   const formattedDate = taskDate.toLocaleDateString();

//   // Check if the date already exists in the result array
//   const existingDate = result.find((item: any) => item.date === formattedDate);

//   // If the date exists, increment the project's total hours
//   if (task.endTime)
//     if (existingDate) {
//       if (existingDate.hasOwnProperty(project.name)) {
//         existingDate[project.name] += task.endTime - task.beginTime;
//       } else {
//         existingDate[project.name] = task.endTime - task.beginTime;
//       }
//     } else {
//       // If the date doesn't exist, create a new object with the date and project's total hours
//       const newDateObject: any = {
//         date: formattedDate,
//         [project.name]: task.endTime - task.beginTime,
//       };
//       result.push(newDateObject);
//     }

//   return result;
// }, []);

// // Format the result to match the desired output structure
// const timeline = tasksWithData.map((item: { [key: string]: number }) => {
//   const formattedItem: any = {
//     date: item.date,
//   };

//   let totalHours = 0;
//   let totalProjects = 0;

//   for (const [project, hours] of Object.entries(item)) {
//     if (project !== 'date') {
//       totalHours += hours;
//       console.log(totalHours);
//       totalProjects++;
//     }
//   }

//   for (const [project, hours] of Object.entries(item)) {
//     if (project !== 'date') {
//       const percentage = totalHours === 0 ? 0 : (hours / totalHours) * 100;
//       formattedItem[project] = percentage.toFixed(1);
//     }
//   }

//   return formattedItem;
// });

export default barChartController;

// import { Request, Response } from 'express';
// import { User } from '../models/model.index';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { ITask } from '../types/types.index';
// import { IProject } from '../models/project-schema';
// require('dotenv').config();

// const barChartController = {
//   getBarChartData: async (req: Request, res: Response) => {
//     const { startDate, endDate } = req.query;

//     const token = req.body.token || req.query.token || req.headers['token'];

//     try {
//       // Check if the token is present
//       if (!token) {
//         return res.status(401).json({ error: 'Missing token' });
//       }

//       // Verify and decode the token to get the user's email
//       const decodedToken = jwt.verify(token, process.env.TOKEN_KEY || 'defaultSecretKey');

//       // Type guard to check if the decodedToken is not void
//       if (!decodedToken) {
//         return res.status(401).json({ error: 'Invalid token' });
//       }

//       // Type assertion to specify the type as { email: string }
//       const userEmail = (decodedToken as JwtPayload & { email: string }).email;

//       // Find the user based on the email
//       const user = await User.findOne({ email: userEmail });

//       if (!user) {
//         return res.status(404).json({ error: 'User not found.' });
//       }

//       // Filter tasks within the given date range for the user
//       const tasks = user.tasks.filter((task: ITask) => {
//         const taskDate = task.beginTime;

//         if (!startDate || !endDate) {
//           return res.status(400).json({ error: 'Missing start or end date' });
//         }

//         const startTimestamp = parseInt(startDate.toString());
//         const endTimestamp = parseInt(endDate.toString());

//         return taskDate >= startTimestamp && taskDate <= endTimestamp;
//       });

//       // Calculate total task duration for each project
//       const projectTotals: { [projectId: string]: number } = {};

//       tasks.forEach((task: ITask) => {
//         const { projectId, beginTime, endTime } = task;
//         if (endTime !== undefined) {
//           const duration = endTime - beginTime;


//           if (projectTotals[projectId]) {
//             projectTotals[projectId] += duration;
//           } else {
//             projectTotals[projectId] = duration;
//           }
//         }
//       });

//       // Map project totals to include additional project information
//       const projectsWithData = user.projects.map((project: IProject) => ({
//         id: project._id.toString(),
//         name: project.name,
//         totalDuration: projectTotals[project._id.toString()] || 0,
//       }));

//       res.status(200).json({ success: true, projects: projectsWithData });
//     } catch (error) {
//       console.log('error\n');
//       console.log(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
// };

// export default barChartController;
