export interface ITask {
  projectId: string;
  description: string;
  beginTime: string;
  endTime: string;
  userEmail:string;
}

export interface IProject {
  name: string;
  color: string;
  projectHours: number;
  description?: string;
  userEmail:string;
}

export interface IUserInfo {
  email: string;
  password: string;
  username: string;
}