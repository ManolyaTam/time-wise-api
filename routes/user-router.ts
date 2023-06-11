import express from 'express';
import userSignInController from '../controllers/sign-in-controller';
import userSignUpController from '../controllers/userSign-up-controller';

const signUpRouter = express.Router();
const signInRouter = express.Router();

// Create a new user
signUpRouter.post('/', userSignUpController.createUser );
signInRouter.post('/',userSignInController.createUser);


export{ 
  signInRouter,
  signUpRouter
};
