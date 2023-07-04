import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/user-schema';

const getUserFromTokenController = {
  getUserFromToken: async (req: Request, res: Response) => {
    try {
      const token = req.body.token || req.query.token || req.headers['token'];


      if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
      }

      // Verify the token
      const secretKey: Secret = process.env.TOKEN_KEY || 'defaultSecretKey';
      const decodedToken: any = jwt.verify(token, secretKey);

      // Find the user based on the email from the token
      const user = await User.findOne({ email: decodedToken.email });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Return the email and username
      res.status(200).json({ email: user.email, username: user.username });
    } catch (error) {
      console.error('Error occurred while retrieving user from token:', error);
      res.status(500).json({ error });
    }
  },
};

export default getUserFromTokenController;
