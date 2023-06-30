import express from 'express';
import taskController from '../controllers/task-controller';

const taskRouter = express.Router();

// Create a new project
taskRouter.post('/', taskController.createTask);

//get all task data
taskRouter.get('/', taskController.getAllDataTasks)

// Delete a task
taskRouter.delete('/tasks/:taskId', taskController.deleteTask);


export default taskRouter;
