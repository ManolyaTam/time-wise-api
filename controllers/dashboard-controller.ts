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

    const daysInRange: number[] = [];
    for (let tmpD = parseInt(startDate?.toString() || '0'); tmpD <= parseInt(endDate?.toString() || '0'); tmpD += (60 * 60 * 1000 * 24)) {
      console.log(new Date(tmpD).toLocaleString());
      daysInRange.push(tmpD)
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
      }// Filter tasks within the given date range for the user with status "stopped"
      const stoppedTasks = user.tasks.filter((task: ITask) => {
        const taskDate = task.beginTime;

        if (!startDate || !endDate) {
          return res.status(400).json({ error: 'Missing start or end date' });
        }
        if(startDate>=endDate){
          return res.status(400).json({ error: 'Invalid Date' });
        }

        const startTimestamp = parseInt(startDate.toString());
        const endTimestamp = parseInt(endDate.toString());

        return taskDate >= startTimestamp && taskDate <= endTimestamp && task.status === "stopped";
      });

      // Group tasks by date
      const tasksByDate: { [date: string]: { [project: string]: number } } = {};

      stoppedTasks.forEach((task: ITask) => {
        const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;
        console.log("projects", project)
        if (!project) {
          throw new Error(`Project not found for task with ID: ${task._id}`);
        }

        const taskDate = new Date(parseInt(task.beginTime.toString()));

        // Check if the parsed date is valid
        if (isNaN(taskDate.getTime())) {
          throw new Error(`Invalid date format for task with ID: ${task._id}`);

        }
      });

        // const obj = {
        //   1: 2, 3: 4
        // }
        // Object.keys(obj).forEach(key => console.log(obj.key))
        const timeline: { [date: string]: { [project: string]: number } }[] = [];
        for (const day of daysInRange) {
          console.log(day);
          const projectData: { [project: string]: number } = {};
          for (const task of stoppedTasks) {
            const taskDate = new Date(parseInt(task.beginTime.toString()));
            console.log(taskDate)
            const taskDay = new Date(taskDate.setHours(0, 0, 0, 0));
        
            if (
              taskDate.setHours(0, 0, 0, 0) === new Date(task.endTime).setHours(0, 0, 0, 0) &&
              taskDay.getTime() === new Date(day).setHours(0, 0, 0, 0)
            ) {
              const duration = task.endTime - task.beginTime;
              const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;
        
              if (project) {
                projectData[project.name] = (projectData[project.name] || 0) + duration;
              }






            // if (taskDate.setHours(0, 0, 0, 0) === new Date(task.endTime).setHours(0, 0, 0, 0)
            //   && (new Date(day).setHours(0, 0, 0, 0)) === taskDate.setHours(0, 0, 0, 0)) {
            //   let duration = task.endDate - task.beginTime;
            //   const project = user.projects.find((p: IProject) => p._id.toString() === task.projectId.toString()) || null;
            //   projectData[project.name] += duration;

            // }

          }}

          for (const [projectName, totalDuration] of Object.entries(projectData)) {
            projectData[projectName] = totalDuration / (60 * 60 * 1000); // Convert to hours
          }
      
          timeline.push({ [day]: projectData });
        }
        res.status(200).json({ success: true, timeline });
      

          //task starts and ends in this day
          //if( task.start>= day && task.end <= day + (60*60*24*1000)){
            // push timeline 
            // timeline.push({ [day]: projectData });

        // }


  } catch(error) {
    console.log('error\n');
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
},
};



export default barChartController;
