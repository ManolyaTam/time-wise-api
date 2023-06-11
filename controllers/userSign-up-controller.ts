import { Request, Response } from 'express';
import User from '../models/user-schema';
import { IUserInfo } from '../types/types.index';

const userSignUpController = {
  createUser: async (req: Request, res: Response) => {
    try {

      const { email, password, username } = req.body;
      if(!username){
        return res.status(400).json({ error: 'usename is requierd' });
      }
      

      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists. Please use another email address.' });
      }

      // Create a new user instance
      const newUser: IUserInfo = {
        email,
        password,
        username
      };

      // Save the new user to the database
      await User.create(newUser);

      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Error occurred during sign up:', error);
      res.status(500).json({ error });
    }
  }
};

export default userSignUpController;
