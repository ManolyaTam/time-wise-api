import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import projectRouter from './routes/project-routes';
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/projects', projectRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('Your Server is working fine!');
});
app.listen(port, () => {
  console.log(`:zap:️[server]: Server is running at http://127.0.0.1:${port}`);
  dbConnect();
});


//CONNECT WITH MONGOOS
const dbConnect = () => {
  console.log('connecting to db...');
  mongoose
    .connect('mongodb://127.0.0.1:27017/time-wise')
    .then(() => {
      console.log(':hugging_face: [server]: Connected to MongoDB');
    })
    .catch((err) => {
      console.log(`:face_with_raised_eyebrow: [server]: Failed to connect to MongoDB ${err}`);
    });
};

