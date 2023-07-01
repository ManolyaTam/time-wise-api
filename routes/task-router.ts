import express from 'express';
import taskController from '../controllers/task-controller';

const taskRouter = express.Router();

// Create a new task
taskRouter.post('/', taskController.createTask);

//get all task data
taskRouter.get('/', taskController.getAllDataTasks)

// Delete a task
taskRouter.delete('/:taskId', taskController.deleteTask);
//update task
taskRouter.put('/:taskId', taskController.updateTask);


export default taskRouter;
