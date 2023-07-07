import { IUser } from "../models/user-schema";
import { ITask, IProject } from "../types/types.index";

export const calculate = (
  beginTime: string,
  taskID: string,
  user: IUser,
  endTime: string
) => {
  const taskInfo: ITask | undefined = user.tasks.find(
    (task: ITask) => task._id.toString() === taskID
  );

  if (!taskInfo) {
    return false;
  }

  const project: IProject | undefined = user.projects.find(
    (project: IProject) => project._id.toString() === taskInfo.projectId
  );

  if (!project) {
    return false;
  }

  const startTime = project.projectStartTime;
  if (startTime === undefined || Number(beginTime) < startTime) {
    project.projectStartTime = Number(beginTime);
  }

  const timeEnd = project.projectEndTime;
  if (timeEnd === undefined || Number(endTime) > timeEnd) {
    project.projectEndTime = Number(endTime);
  }

  if (project.projectEndTime && project.projectStartTime) {
    project.projectHours = project.projectEndTime - project.projectStartTime;
    console.log("total project hours: ", project.projectHours);
    return true;
  }

  return false;
};
