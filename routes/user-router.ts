import express from 'express';
import userController from '../controllers/userSign-up-controller';

const signUpRouter = express.Router();

// Create a new user
signUpRouter.post('/', userController.createUser);

export default signUpRouter;
