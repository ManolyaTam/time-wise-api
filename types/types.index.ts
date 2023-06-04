export namespace userNS {
  export interface ITask {
    taskId: string;
    projectId: string;
    projectName: string;
    description: string;
    beginTime: string;
    endTime: string;
    totalTaskTime: number;
  }
  
  export interface IProject {
    _id: string;
    name: string;
    color: string;
    projectHours: number;
    description?: string;
  }

  export interface IUserInfo {
    email: string;
    password: string;
    username: string;
  }
}