import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectServices } from "./project.service";

const createProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const project = await ProjectServices.createProject({
      ...req.body,
      createdBy: userId
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Project created successfully",
      data: project,
    });
  }
);

const getAllProjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const projects = await ProjectServices.getAllProjects(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Projects retrieved successfully",
      data: projects,
    });
  }
);

const getProjectById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const project = await ProjectServices.getProjectById(id, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Project retrieved successfully",
      data: project,
    });
  }
);

const updateProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const project = await ProjectServices.updateProject(id, req.body, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Project updated successfully",
      data: project,
    });
  }
);

const deleteProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user?.userId;
    const result = await ProjectServices.deleteProject(id, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Project deleted successfully",
      data: result,
    });
  }
);

const getProjectsByTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    const userId = req.user?.userId;
    const projects = await ProjectServices.getProjectsByTeam(teamId, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Team projects retrieved successfully",
      data: projects,
    });
  }
);

export const ProjectControllers = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByTeam
};