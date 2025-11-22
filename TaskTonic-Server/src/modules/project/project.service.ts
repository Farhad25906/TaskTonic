import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Project } from "./project.model";
import { Task } from "../task/task.model";

const createProject = async (payload: any) => {
  const { title, teamId, createdBy } = payload;

  // Check if project with same title already exists in this team
  const existingProject = await Project.findOne({
    title,
    teamId,
    createdBy
  });

  if (existingProject) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Project with this title already exists in this team"
    );
  }

  const project = await Project.create(payload);
  return project;
};

const getAllProjects = async (userId: string) => {
  const projects = await Project.find({ createdBy: userId })
    .populate("teamId", "name")
    .sort({ createdAt: -1 });

  return projects;
};

const getProjectById = async (id: string, userId: string) => {
  const project = await Project.findOne({ _id: id, createdBy: userId })
    .populate("teamId", "name");

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  return project;
};

const updateProject = async (id: string, payload: any, userId: string) => {
  const project = await Project.findOne({ _id: id, createdBy: userId });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  // If title is being updated, check for duplicates
  if (payload.title && payload.title !== project.title) {
    const existingProject = await Project.findOne({
      title: payload.title,
      teamId: project.teamId,
      createdBy: userId,
      _id: { $ne: id },
    });

    if (existingProject) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Another project with this title already exists in this team"
      );
    }
  }

  const updatedProject = await Project.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("teamId", "name");

  return updatedProject;
};

const deleteProject = async (id: string, userId: string) => {
  const project = await Project.findOne({ _id: id, createdBy: userId });

  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  // Check if project has tasks
  const taskCount = await Task.countDocuments({ projectId: id });

  if (taskCount > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot delete project with ${taskCount} tasks. Delete tasks first.`
    );
  }

  await Project.findByIdAndDelete(id);

  return {
    message: "Project deleted successfully",
    deletedProject: project.title,
  };
};

const getProjectsByTeam = async (teamId: string, userId: string) => {
  const projects = await Project.find({ teamId, createdBy: userId })
    .populate("teamId", "name")
    .sort({ createdAt: -1 });

  return projects;
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByTeam,
};