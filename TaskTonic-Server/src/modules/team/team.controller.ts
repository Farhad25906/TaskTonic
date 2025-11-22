
import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TeamServices } from "./team.service";

const createTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const team = await TeamServices.createTeam({
      ...req.body,
      createdBy: req.user.userId,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Team created successfully",
      data: team,
    });
  }
);

const getAllTeams = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const teams = await TeamServices.getAllTeams(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Teams retrieved successfully",
      data: teams,
    });
  }
);

const getTeamById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const team = await TeamServices.getTeamById(id, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Team retrieved successfully",
      data: team,
    });
  }
);

const updateTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const team = await TeamServices.updateTeam(id, userId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Team updated successfully",
      data: team,
    });
  }
);

const deleteTeam = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const result = await TeamServices.deleteTeam(id, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Team deleted successfully",
      data: result,
    });
  }
);

const addTeamMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const team = await TeamServices.addTeamMember(id, userId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Team member added successfully",
      data: team,
    });
  }
);

const updateTeamMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, memberId } = req.params;
    const userId = req.user.userId;
    const team = await TeamServices.updateTeamMember(id, userId, memberId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Team member updated successfully",
      data: team,
    });
  }
);

const deleteTeamMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, memberId } = req.params;
    const userId = req.user.userId;
    const result = await TeamServices.deleteTeamMember(id, userId, memberId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Team member deleted successfully",
      data: result,
    });
  }
);

export const TeamControllers = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
};