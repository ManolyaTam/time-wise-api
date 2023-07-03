// // // import { Request, Response } from 'express';
// // // import { Task, User, Project } from '../models/model.index';
// // // import { ITask, IUserInfo, IProject } from '../types/types.index';
// // // import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
// // // import { ObjectId } from 'mongodb';
// // // require('dotenv').config();

// // // interface ProjectDailyTotals {
// // //   date: string;
// // //   projects: {
// // //     [key: string]: number;
// // //   };
// // // }

// // // const taskDashboardController = {
// // //   getTaskDashboardData: async (req: Request, res: Response) => {
// // //       const token = req.body.token || req.query.token || req.headers['token'];

// // //       try {
// // //         // Check if the token is present
// // //         if (!token) {
// // //           return res.status(401).json({ error: 'Missing token' });
// // //         }

// // //         // Verify and decode the token to get the user's email
// // //         const decodedToken = jwt.verify(token, process.env.TOKEN_KEY || 'defaultSecretKey');

// // //         // Type guard to check if the decodedToken is not void
// // //         if (!decodedToken) {
// // //           return res.status(401).json({ error: 'Invalid token' });
// // //         }

// // //         // Type assertion to specify the type as { email: string }
// // //         const userEmail = (decodedToken as JwtPayload & { email: string }).email;

// // //         // Find the user based on the email
// // //         const user = await User.findOne({ email: userEmail });

// // //         if (!user) {
// // //           return res.status(404).json({ error: 'User not found.' });
// // //         }

// // //         console.log("........................");
// // //         const fromDate = String(req.query.fromDate);
// // //         const toDate = String(req.query.toDate);

// // //         // Validate fromDate and toDate input
// // //         if (!fromDate || !toDate) {
// // //           return res.status(400).json({ error: 'fromDate and toDate are required' });
// // //         }

// // //         // Convert fromDate and toDate to Date objects
// // //         const fromDateTime = new Date(fromDate);
// // //         const toDateTime = new Date(toDate);
// // //         console.log("fromDateTime", fromDateTime);
// // //         console.log("toDateTime", toDateTime);


// // //         // Convert Date objects to ISO strings
// // //         const fromDateString = fromDateTime.toISOString();
// // //         const toDateString = toDateTime.toISOString();
// // //         console.log("fromDateString", fromDateString);
// // //         console.log("fromDateString", fromDateString);

// // //         // Retrieve tasks from the database
// // //         const tasks: ITask[] = await Task.find({
// // //           date: {
// // //             $gte: fromDateString,
// // //             $lte: toDateString,
// // //           },
// // //           user: userId,
// // //         });

// // //         // Calculate project totals for each day
// // //         const projectTotals: ProjectDailyTotals[] = [];
// // //         const dateSet = new Set();

// // //         tasks.forEach((task: ITask) => {
// // //           const taskStartDate = new Date(task.beginTime);
// // //           const taskEndDate = new Date(task.endTime);
// // //           const taskDate = taskStartDate.toISOString().slice(0, 10);

// // //           if (!dateSet.has(taskDate)) {
// // //             dateSet.add(taskDate);
// // //             const projectTotal: ProjectDailyTotals = {
// // //               date: taskDate,
// // //               projects: {},
// // //             };
// // //             projectTotals.push(projectTotal);
// // //           }
// // //           const fromDateTime = new Date(fromDate); // Convert fromDate to Date object
// // //           const toDateTime = new Date(toDate); // Convert toDate to Date object

// // //           const projectTotal = projectTotals.find((total) => {
// // //             const taskStartDate = new Date(task.beginTime); // Assuming task.begin represents the task start date
// // //             const taskEndDate = new Date(task.endTime); // Assuming task.end represents the task end date
// // //             const taskDuration = taskEndDate.getTime() - taskStartDate.getTime();
// // //             const taskTotalHours = taskDuration / (1000 * 60 * 60); // Convert milliseconds to hours

// // //             return taskStartDate >= fromDateTime && taskEndDate <= toDateTime;
// // //           });

// // //           // if (projectTotal) {
// // //           //   const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId) || null;
// // //           //   if (project) {
// // //           //     const projectName = project.name;
// // //           //     if (projectTotal.projects.hasOwnProperty(projectName)) {
// // //           //       projectTotal.projects[projectName] +=  ;
// // //           //     } else {
// // //           //       projectTotal.projects[projectName] = taskTotalHours;
// // //           //     }
// // //           //   }
// // //           // }

// // //           //         // const fromDateTime = new Date(fromDate); // Convert fromDate to Date object
// // //           //         // const toDateTime = new Date(toDate); // Convert toDate to Date object

// // //           //         // const projectTotal = projectTotals.find((total) => {
// // //           //         //   const taskStartDate = new Date(task.beginTime); // Assuming task.begin represents the task start date
// // //           //         //   const taskEndDate = new Date(task.endTime); // Assuming task.end represents the task end date
// // //           //         //   const taskDuration = taskEndDate.getTime() - taskStartDate.getTime();
// // //           //         //   const taskTotalHours = taskDuration / (1000 * 60 * 60); // Convert milliseconds to hours

// // //           //         //   return taskStartDate >= fromDateTime && taskEndDate <= toDateTime;
// // //           //         // });

// // //           //         // if (projectTotal) {
// // //           //         //   const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId) || null;
// // //           //         //   if (project) {
// // //           //         //     const projectName = project.name;
// // //           //         //     if (projectTotal.projects.hasOwnProperty(projectName)) {
// // //           //         //       projectTotal.projects[projectName] += taskTotalHours;
// // //           //         //     } else {
// // //           //         //       projectTotal.projects[projectName] = taskTotalHours;
// // //           //         //     }
// // //           //         //   }


// // //           //         // const projectTotal = projectTotals.find((total) => {
// // //           //         //   const taskStartDate = new Date(task.beginTime); // Assuming task.begin represents the task start date
// // //           //         //   const taskEndDate = new Date(task.endTime); // Assuming task.end represents the task end date

// // //           //         //   return taskStartDate >= fromDateTime && taskEndDate <= toDateTime;
// // //           //         // });

// // //           //         // if (projectTotal) {
// // //           //         //   const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId) || null;
// // //           //         //   if (project) {
// // //           //         //     const projectName = project.name;
// // //           //         //     if (projectTotal.projects.hasOwnProperty(projectName)) {
// // //           //         //       projectTotal.projects[projectName] += task.totalHours;
// // //           //         //     } else {
// // //           //         //       projectTotal.projects[projectName] = task.totalHours;
// // //           //         //     }
// // //           //         //   }
// // //           //         // }


// // //           //         // const projectTotal = projectTotals.find((total) => total.date === taskDate);
// // //           //         // if (projectTotal) {
// // //           //         //   const project: IProject | null = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;
// // //           //         //   if (project) {
// // //           //         //     const projectName = project.name;
// // //           //         //     if (projectTotal.projects.hasOwnProperty(projectName)) {
// // //           //         //       projectTotal.projects[projectName] += task.totalHours;
// // //           //         //     } else {
// // //           //         //       projectTotal.projects[projectName] = task.totalHours;
// // //           //         //     }
// // //           //         //   }
// // //           //         // }
// // //         });

// // //         return res.json(projectTotals);
// // //       } catch (error) {
// // //         console.error(error);
// // //         return res.status(500).json({ error: 'Server error' });
// // //       }
// // //     },
// // //   };

// // //   export default taskDashboardController;
// // import { Request, Response } from 'express';
// // import { User } from '../models/model.index';
// // import { IProject, ITask } from '../types/types.index';
// // import jwt, { JwtPayload } from 'jsonwebtoken';
// // import { ObjectId } from 'mongodb';
// // require('dotenv').config();


// // const barChartController = {
// //   getBarChartData: async (req: Request, res: Response) => {
// //     const token = req.body.token || req.query.token || req.headers['token'];

// //     try {
// //       // Check if the token is present
// //       if (!token) {
// //         return res.status(401).json({ error: 'Missing token' });
// //       }

// //       // Verify and decode the token to get the user's email
// //       const decodedToken = jwt.verify(token, process.env.TOKEN_KEY || 'defaultSecretKey');

// //       // Type guard to check if the decodedToken is not void
// //       if (!decodedToken) {
// //         return res.status(401).json({ error: 'Invalid token' });
// //       }

// //       // Type assertion to specify the type as { email: string }
// //       const userEmail = (decodedToken as JwtPayload & { email: string }).email;

// //       // Find the user based on the email
// //       const user = await User.findOne({ email: userEmail });

// //       if (!user) {
// //         return res.status(404).json({ error: 'User not found.' });
// //       }

// //       // Fetch all tasks for the user
// //       const tasks = user.tasks;

// //       // Group tasks by date and calculate total hours for each date
// //       const groupedTasks = tasks.reduce((acc: { [date: string]: number }, task: ITask) => {
// //         const date = task.beginTime.substr(0, 10); // Extract date from beginTime
// //         const taskHours = (new Date(task.endTime).getTime() - new Date(task.beginTime).getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours

// //         acc[date] = (acc[date] || 0) + taskHours;
// //         return acc;
// //       }, {});

// //       // Convert the groupedTasks object into an array of objects
// //       const barChartData = Object.entries(groupedTasks).map(([date, totalHours]) => ({
// //         date,
// //         totalHours,
// //       }));

// //       res.status(200).json({ success: true, data: barChartData });
// //     } catch (error) {
// //       console.log('error\n');
// //       console.log(error);
// //       res.status(500).json({ error: 'Internal Server Error' });
// //     }
// //   },
// // };
// // export default barChartController;

// import { Request, Response } from 'express';
// import Task from '../models/task-schema';
// import { ITask } from '../types/types.index';
// import { User } from '../models/model.index';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// require('dotenv').config();


// interface ProjectDailyTotals {
//   date: number;
//   projects: {
//     [key: string]: number;
//   };
// }

// const barChartController = {
//   getBarChartData: async (req: Request, res: Response) => {
//     const { startDate, endDate } = req.params;

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
//       const user = await User.findOne({ email: userEmail }).populate('Tasks');


//       if (!user) {
//         return res.status(404).json({ error: 'User not found.' });
//       }

//       // // Fetch all tasks for the user within the given timestamps
//       // const tasks = await Task.find({
//       //   userId: user._id,
//       //   beginTime: { $gte: startDate, $lte: endDate },
//       // });
//       // Fetch all tasks for the user within the given timestamps
//       const tasks = await Task.find({
//         // projectId: { $in: user.projects }, // Fetch tasks with projectId matching any project in the user's projects array
//         beginTime: { $gte: startDate, $lte: endDate },
//       });

//         console.log(".....tasks",tasks);

//       // Group tasks by date and project name, and calculate total hours for each project on each date
//       const groupedTasks: ProjectDailyTotals[] = [];

//       tasks.forEach((task: ITask) => {
//         const date = (task.beginTime); // Convert timestamp to date string
//         const projectName = task.projectId.toString(); // Convert projectId to string
//         const taskHours = (task.endTime - task.beginTime) / (1000 * 60 * 60); // Convert milliseconds to hours

//         let projectTotals = groupedTasks.find(item => item.date === date);

//         if (!projectTotals) {
//           projectTotals = {
//             date,
//             projects: {},
//           };
//           groupedTasks.push(projectTotals);
//         }

//         if (!projectTotals.projects[projectName]) {
//           projectTotals.projects[projectName] = 0;
//         }

//         projectTotals.projects[projectName] += taskHours;
//       });

//       // Convert the groupedTasks object into an array of objects
//       const barChartData = groupedTasks.map(({ date, projects }) => ({
//         date,
//         ...projects,
//       }));


//       res.status(200).json({ success: true, data: barChartData });
//     } catch (error) {
//       console.log('error\n');
//       console.log(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
// };

// export default barChartController;
import { Request, Response } from 'express';
import { User, Task } from '../models/model.index';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ITask } from '../types/types.index';
import { IProject } from '../models/project-schema';
require('dotenv').config();
interface ProjectDailyTotals {
  date: string;
  projects: string[];
}
const barChartController = {
  getBarChartData : async (req: Request, res: Response) => {
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
         console.log(";;;;;;;;;;",taskDate);
        console.log("WWWWWWWWW",startDate);
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
        return taskDate >= parsedStartDate && taskDate <= parsedEndDate;
        
        
        // return taskDate >= parseInt(startDate.toString()) && taskDate <= parseInt(endDate.toString());

      });
      // console.log("./////////",user.tasks);
      console.log("./////////",tasks);

      

      // // Group tasks by date and project names
      // const groupedTasks: ProjectDailyTotals[] = [];

      // tasks.forEach((task: ITask) => {
      //   const taskDate = new Date(task.beginTime).toLocaleDateString();
      //   const projectName = task.projectId.toString();

      //   let projectTotals = groupedTasks.find((item) => item.date === taskDate);

      //   if (!projectTotals) {
      //     projectTotals = {
      //       date: taskDate,
      //       projects: [],
      //     };
      //     groupedTasks.push(projectTotals);
      //   }

      //   if (!projectTotals.projects.includes(projectName)) {
      //     projectTotals.projects.push(projectName);
      //   }
      // });
      // Map tasks to include additional information
      // const tasksWithData = tasks.map((task: ITask) => {
      //   const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;

      //   if (!project) {
      //     throw new Error(`Project not found for task with ID: ${task._id}`);
      //   }

      //   return {
      //     _id: task._id,
      //     description: task.description,
      //     beginTime: task.beginTime,
      //     endTime: task.endTime,
      //     projectName: project.name,
      //     projectColor: project.color,
      //   };
      // });

      // Map tasks to include additional information
const tasksWithData = tasks.map((task: ITask) => {
  const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;

  if (!project) {
    throw new Error(`Project not found for task with ID: ${task._id}`);
  }

  // Get the date of the task
  const taskDate = new Date(task.beginTime);
  const formattedDate = taskDate.toLocaleDateString(); // Format the date as "Jan 30, 2022"

  return {
    _id: task._id,
    description: task.description,
    beginTime: task.beginTime,
    endTime: task.endTime,
    date: formattedDate, // Include the formatted date in the response
    projectName: project.name,
    projectColor: project.color,
  };
});


      res.status(200).json({ success: true, tasks:tasksWithData});
    } catch (error) {
      console.log('error\n');
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default barChartController;


// import { Request, Response } from 'express';
// import { User, Task } from '../models/model.index';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { ITask } from '../types/types.index';
// import { IProject } from '../models/project-schema';
// require('dotenv').config();

// interface ProjectDailyTotals {
//   date: string;
//   projects: string[];
// }

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
//         const taskDate = new Date(task.beginTime).toLocaleDateString();

//         if (!startDate) {
//           return res.status(400).json({ error: 'Missing startDate' });
//         }

//         if (!endDate) {
//           return res.status(400).json({ error: 'Missing endDate' });
//         }

//         const parsedStartDate = new Date(parseInt(startDate.toString())).toLocaleDateString();
//         const parsedEndDate = new Date(parseInt(endDate.toString())).toLocaleDateString();

//         return taskDate >= parsedStartDate && taskDate <= parsedEndDate;
//       });

//       // Group tasks by date and project names
//       const groupedTasks: ProjectDailyTotals[] = [];

//       tasks.forEach((task: ITask) => {
//         const taskDate = new Date(task.beginTime).toLocaleDateString();
//         const projectName = task.projectId.toString();

//         let projectTotals = groupedTasks.find((item) => item.date === taskDate);

//         if (!projectTotals) {
//           projectTotals = {
//             date: taskDate,
//             projects: [],
//           };
//           groupedTasks.push(projectTotals);
//         }

//         if (!projectTotals.projects.includes(projectName)) {
//           projectTotals.projects.push(projectName);
//         }
//       });

//       res.status(200).json({ success: true, data: groupedTasks });
//     } catch (error) {
//       console.log('error\n');
//       console.log(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
// };

// export default barChartController;
