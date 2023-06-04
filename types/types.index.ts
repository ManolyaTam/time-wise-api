export namespace userNS {
  export interface IUserInfo {
    email: string;
    password: string;
    username: string;
  }
  export interface ITask{
    taskId:string;
    projectId:string;
    projectName:string;
    description:string;
    beginTime:string;
    endTime:string;
    totalTaskTime:number;
    }
}