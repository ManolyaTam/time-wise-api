import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user-schema';
import { IUserInfo } from '../types/types.index';
require('dotenv').config();

const userSignInController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Check if the email or password is missing
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
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
      };

      // Save the new user to the database
      await User.create(newUser);

      // Generate a JWT token for the new user
      const token = generateToken(newUser);

      res.status(201).json({ success: true, token });
    } catch (error) {
      console.error('Error occurred during sign up:', error);
      res.status(500).json({ error });
    }
  },

  signIn: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Check if the user exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Validate the password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Generate a JWT token for the authenticated user
      const token = generateToken({ email });

      res.status(200).json({ success: true, token });
    } catch (error) {
      console.error('Error occurred during sign in:', error);
      res.status(500).json({ error });
    }
  },

};

// Generate a JWT token
function generateToken(payload: { email: string }) {
  const secretKey: Secret = process.env.TOKEN_KEY || 'defaultSecretKey';

  // Set the expiration time for the token
  const expiresIn = '2h';

  // Sign the token with the payload and secret key
  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
}

export default userSignInController;
