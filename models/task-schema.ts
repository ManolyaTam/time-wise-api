import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  projectName: {
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
    required: true
  },
  totalTaskTime: {
    type: Number,
    required: true
  }
});

 const Task = mongoose.model('Task', TaskSchema);

 export default Task;