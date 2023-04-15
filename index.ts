import express, { Express, Request, Response } from 'express';
// import dotenv from 'dotenv';

// dotenv.config();

const app: Express = express();
// const port = process.env.PORT;
const port = 3001;

app.get('/hello', (req: Request, res: Response) => {
  console.log('hello');
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});