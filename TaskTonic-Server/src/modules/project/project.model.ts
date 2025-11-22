import { model, Schema } from "mongoose";

const projectSchema = new Schema({
  title: { 
    type: String, 
    required: [true, "Project title is required"],
    trim: true,
  },
  description: { 
    type: String,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, "Team reference is required"]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Creator reference is required"]
  },
  status: {
    type: String,
    default: "planning"
  }
}, {
  timestamps: true,
});

export const Project = model("Project", projectSchema);