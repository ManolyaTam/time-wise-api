
import { Schema, Document, model } from 'mongoose';
export interface IProject extends Document {
  name: string;
  color: string;
  projectHours: number;
  description?: string;
  userEmail: string;
  projectStartTime?: string;
  projectEndTime?: string;
}
const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  color: { type: String, required: true },
  projectHours: { type: Number, required: true },
  projectStartTime: { type: String, required: false },
  projectEndTime: { type: String, required: false },
  description: { type: String },
  userEmail: { type: String },
});
const Project = model<IProject>('Project', projectSchema);
export default Project;