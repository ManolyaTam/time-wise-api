import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user-schema';
require('dotenv').config();

const userSignInController = {

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
