import { ObjectId } from "mongodb";
export enum Status {
  RUNNING = "running",
  STOPPED = "stopped",
}
export interface ITask {
  _id: ObjectId;
  projectId: string;
  description: string;

  beginTime: number;
  endTime: number;

  userEmail: string;
  totalTimeInSeconds?: string;
  status: Status;
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
