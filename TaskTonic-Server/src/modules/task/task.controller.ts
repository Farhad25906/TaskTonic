import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TaskServices } from "./task.service";

const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await TaskServices.createTask(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Task created successfully",
      data: task,
    });
  }
);

const getAllTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, assignedTo, status, priority } = req.query;
    const tasks = await TaskServices.getAllTasks(
      projectId as string,
      assignedTo as string,
      status as string,
      priority as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  }
);

const getTaskById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const task = await TaskServices.getTaskById(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Task retrieved successfully",
      data: task,
    });
  }
);

const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const task = await TaskServices.updateTask(id, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Task updated successfully",
      data: task,
    });
  }
);

const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await TaskServices.deleteTask(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Task deleted successfully",
      data: result,
    });
  }
);

const assignTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { assignedTo } = req.body;
    const task = await TaskServices.assignTask(id, assignedTo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Task assigned successfully",
      data: task,
    });
  }
);

const reassignTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.body;
    const result = await TaskServices.reassignTasks(teamId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tasks reassigned successfully",
      data: result,
    });
  }
);

export const TaskControllers = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  reassignTasks
};