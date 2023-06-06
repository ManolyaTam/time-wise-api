// import mongoose from "mongoose";

// const ProjectSchema = new mongoose.Schema({
//   _id: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   color: {
//     type: String,
//     required: true
//   },
//   projectHours: {
//     type: Number,
//     required: true
//   },
//   description: {
//     type: String
//   },
// });
// const Project = mongoose.model("project", ProjectSchema);
// export default Project;

import { Schema, Document, model } from 'mongoose';
export interface IProject extends Document {
  _id: string;
  name: string;
  color: string;
  projectHours: number;
  description?: string;
}
const projectSchema = new Schema<IProject>({
  // _id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  projectHours: { type: Number, required: true },
  description: { type: String }
});
const Project = model<IProject>('Project', projectSchema);
export default Project;