import express from 'express';
import userSignInController from '../controllers/sign-in-controller';
import userSignUpController from '../controllers/userSign-up-controller';
import getUserFromTokenController from '../controllers/user-info-controller';
const signUpRouter = express.Router();
const signInRouter = express.Router();
const userInfoRouter = express.Router();

// Create a new user
signUpRouter.post('/', userSignUpController.createUser);
signInRouter.post('/', userSignInController.signIn);

// Route for retrieving user information from a token
userInfoRouter.get('/', getUserFromTokenController.getUserFromToken);

export {
  signInRouter,
  signUpRouter,
  userInfoRouter
};

