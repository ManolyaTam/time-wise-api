import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  projectHours: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
});

const Project = mongoose.model("project", ProjectSchema);

export default Project;