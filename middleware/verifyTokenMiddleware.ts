import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/user-schema';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers['token'];

  try {
    // Check if the token is present
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    // Verify and decode the token to get the user's email
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY || 'defaultSecretKey');

    // Type guard to check if the decodedToken is not void
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Type assertion to specify the type as { email: string }
    const userEmail = (decodedToken as JwtPayload & { email: string }).email;

    // Find the user based on the email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Attach the user object to the request for future use
    req.user = user;

    next();
  } catch (error) {
    console.log('error\n');
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default verifyTokenMiddleware;
