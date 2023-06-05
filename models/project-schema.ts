import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true
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
    type: String
  },
});

const Project = mongoose.model("project", ProjectSchema);

export default Project;