import { ObjectId } from "mongodb";
export enum Status {
  RUNNING = "running",
  STOPPED = "stopped",
}
export interface ITask {
  _id: ObjectId;
  projectId: string;
  description: string;
  beginTime: string;
  endTime?: string;
  userEmail: string;
  totalTimeInSeconds?: string;
  status: Status;
}

export interface IProject {
  _id: ObjectId;
  name: string;
  color: string;
  projectHours?: number;
  description?: string;
  userEmail: string;
  projectStartTime?: number;
  projectEndTime?: number;
}

export interface IUserInfo {
  email: string;
  password: string;
  username?: string;
}
