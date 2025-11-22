import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Task } from "./task.model";
import { Project } from "../project/project.model";
import { Team } from "../team/team.model";

const createTask = async (payload: any) => {
  const { title, projectId } = payload;

  // Verify project exists
  const project = await Project.findOne({ _id: projectId });
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  // Check if task with same title already exists in this project
  const existingTask = await Task.findOne({ 
    title, 
    projectId 
  });

  if (existingTask) {
    throw new AppError(httpStatus.BAD_REQUEST, "Task with this title already exists in this project");
  }

  const task = await Task.create(payload);
  return task;
};

const getAllTasks = async (
  projectId?: string, 
  assignedTo?: string, 
  status?: string, 
  priority?: string
) => {
  const filter: any = {};
  
  if (projectId) filter.projectId = projectId;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter)
    .populate('projectId', 'title teamId')
    .sort({ createdAt: -1 });

  return tasks;
};

const getTaskById = async (id: string) => {
  const task = await Task.findById(id).populate('projectId', 'title teamId');

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  return task;
};

const updateTask = async (id: string, payload: any) => {
  const task = await Task.findById(id);

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  // If title is being updated, check for duplicates
  if (payload.title && payload.title !== task.title) {
    const existingTask = await Task.findOne({ 
      title: payload.title, 
      projectId: task.projectId,
      _id: { $ne: id }
    });

    if (existingTask) {
      throw new AppError(httpStatus.BAD_REQUEST, "Another task with this title already exists in this project");
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  ).populate('projectId', 'title teamId');

  return updatedTask;
};

const deleteTask = async (id: string) => {
  const task = await Task.findById(id);

  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  await Task.findByIdAndDelete(id);
  
  return { 
    message: "Task deleted successfully",
    deletedTask: task.title
  };
};

const assignTask = async (taskId: string, assignedTo: string) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(httpStatus.NOT_FOUND, "Task not found");
  }

  // Get project and team to validate member exists
  const project = await Project.findById(task.projectId).populate('teamId');
  if (!project) {
    throw new AppError(httpStatus.NOT_FOUND, "Project not found");
  }

  const team = await Team.findById(project.teamId);
  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  // Check if member exists in team
  const memberExists = team.members.some(member => member.name === assignedTo);
  if (!memberExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "Team member not found");
  }

  task.assignedTo = assignedTo;
  await task.save();

  return task;
};

const reassignTasks = async (teamId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  // Get all projects for this team
  const projects = await Project.find({ teamId });
  const projectIds = projects.map(p => p._id);

  // Get all tasks for these projects
  const tasks = await Task.find({ 
    projectId: { $in: projectIds },
    status: { $ne: 'done' }
  });

  // Simple reassignment logic: assign tasks to members with available capacity
  const memberTasks: { [key: string]: number } = {};
  const memberCapacity: { [key: string]: number } = {};

  // Initialize counts
  team.members.forEach(member => {
    memberTasks[member.name] = 0;
    memberCapacity[member.name] = member.capacity;
  });

  // Count current tasks
  tasks.forEach(task => {
    if (task.assignedTo && memberTasks[task.assignedTo] !== undefined) {
      memberTasks[task.assignedTo]++;
    }
  });

  // Reassign overloaded tasks
  const changes = [];
  for (const task of tasks) {
    if (!task.assignedTo || memberTasks[task.assignedTo] > memberCapacity[task.assignedTo]) {
      // Find member with available capacity
      const availableMember = team.members.find(member => 
        memberTasks[member.name] < memberCapacity[member.name]
      );

      if (availableMember && task.assignedTo !== availableMember.name) {
        const oldAssignee = task.assignedTo;
        task.assignedTo = availableMember.name;
        await task.save();

        // Update counts
        if (oldAssignee) memberTasks[oldAssignee]--;
        memberTasks[availableMember.name]++;

        changes.push({
          taskId: task._id,
          taskTitle: task.title,
          fromMember: oldAssignee,
          toMember: availableMember.name
        });
      }
    }
  }

  return {
    message: `Reassigned ${changes.length} tasks`,
    changes
  };
};

export const TaskServices = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  reassignTasks
};