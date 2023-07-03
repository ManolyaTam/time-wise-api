import express from 'express';
import taskController from '../controllers/task-controller';
import verifyTokenMiddleware from '../middleware/verifyTokenMiddleware';

const taskRouter = express.Router();

// Middleware for token verification
taskRouter.use(verifyTokenMiddleware);

// Create a new task
taskRouter.post('/', taskController.createTask);

// Get all task data
taskRouter.get('/', taskController.getAllDataTasks);

// Delete a task
taskRouter.delete('/:taskId', taskController.deleteTask);

// Update a task
taskRouter.put('/:taskId', taskController.updateTask);

export default taskRouter;
