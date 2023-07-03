import mongoose from "mongoose";
import { Status } from "../types/types.index";

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  beginTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: false
  },
  totalTimeInSeconds: {
    type: String,
    required: false
  },
  status: {
    type: Status,
    required: true
  },
  userEmail: {
    type: String
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;