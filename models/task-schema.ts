import mongoose from "mongoose";

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
    required: true
  },
  userEmail: {
    type: String
  },
});

const Task = mongoose.model('Task', TaskSchema);

export default Task;