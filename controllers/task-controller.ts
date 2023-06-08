import { Request, Response } from 'express';
import { Task } from '../models/model.index';
import { ITask } from '../types/types.index';

const taskController = {
  createTask: async (req: Request, res: Response) => {
    const taskData: ITask = {
      projectId: req.body.projectId,
      beginTime: req.body.beginTime,
      endTime: req.body.endTime,
      description: req.body.description,
      userEmail: req.body.userEmail
    };

    const newTask = new Task(taskData);

    await newTask
      .save()
      .then(() => res.status(201).json({ success: true }))
      .catch((error) => {
        console.log('error\n');
        console.log(error);
        res.status(500).json({ error });
      });
  },
};

export default taskController;
