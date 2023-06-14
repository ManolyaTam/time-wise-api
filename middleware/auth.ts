import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

const config = process.env;

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.body.token || req.query.token || req.headers['token'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }


  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY as Secret);
    req.user = decoded;
    next(); // Call next to proceed to the next middleware
  } catch (err) {
    console.error('Error occurred during token verification:', err);
    return res.status(401).send('Invalid Token');
  }
};

export default verifyToken;