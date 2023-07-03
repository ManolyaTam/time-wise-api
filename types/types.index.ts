import { ObjectId } from 'mongodb';
export interface ITask {
  _id: ObjectId;
  projectId: string;
  description: string;
  beginTime: number;
  endTime: number;
  userEmail: string;
}

export interface IProject {
  _id: ObjectId;
  name: string;
  color: string;
  projectHours: number;
  description?: string;
  userEmail: string;
}

export interface IUserInfo {
  email: string;
  password: string;
  username?: string;
}