import { Request, Response } from 'express';
import User from '../models/user-schema';
import { IUserInfo } from '../types/types.index';
import bcrypt from 'bcrypt'

const userSignUpController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const { email, password, username } = req.body;
      // Check if the email or password is missing
      if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, password and username  are required.' });
      }
      const trimmedUsername = username.trim();
      if (!trimmedUsername) {
        return res.status(400).json({ error: 'Username is required' });
      }
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists. Please use another email address.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user instance
      const newUser: IUserInfo = {
        email,
        password: hashedPassword,
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
