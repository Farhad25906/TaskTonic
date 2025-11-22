"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const task_model_1 = require("./task.model");
const project_model_1 = require("../project/project.model");
const team_model_1 = require("../team/team.model");
const createTask = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, projectId } = payload;
    // Verify project exists
    const project = yield project_model_1.Project.findOne({ _id: projectId });
    if (!project) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Project not found");
    }
    // Check if task with same title already exists in this project
    const existingTask = yield task_model_1.Task.findOne({
        title,
        projectId
    });
    if (existingTask) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Task with this title already exists in this project");
    }
    const task = yield task_model_1.Task.create(payload);
    return task;
});
const getAllTasks = (projectId, assignedTo, status, priority) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (projectId)
        filter.projectId = projectId;
    if (assignedTo)
        filter.assignedTo = assignedTo;
    if (status)
        filter.status = status;
    if (priority)
        filter.priority = priority;
    const tasks = yield task_model_1.Task.find(filter)
        .populate('projectId', 'title teamId')
        .sort({ createdAt: -1 });
    return tasks;
});
const getTaskById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.Task.findById(id).populate('projectId', 'title teamId');
    if (!task) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Task not found");
    }
    return task;
});
const updateTask = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.Task.findById(id);
    if (!task) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Task not found");
    }
    // If title is being updated, check for duplicates
    if (payload.title && payload.title !== task.title) {
        const existingTask = yield task_model_1.Task.findOne({
            title: payload.title,
            projectId: task.projectId,
            _id: { $ne: id }
        });
        if (existingTask) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Another task with this title already exists in this project");
        }
    }
    const updatedTask = yield task_model_1.Task.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('projectId', 'title teamId');
    return updatedTask;
});
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.Task.findById(id);
    if (!task) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Task not found");
    }
    yield task_model_1.Task.findByIdAndDelete(id);
    return {
        message: "Task deleted successfully",
        deletedTask: task.title
    };
});
const assignTask = (taskId, assignedTo) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield task_model_1.Task.findById(taskId);
    if (!task) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Task not found");
    }
    // Get project and team to validate member exists
    const project = yield project_model_1.Project.findById(task.projectId).populate('teamId');
    if (!project) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Project not found");
    }
    const team = yield team_model_1.Team.findById(project.teamId);
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    // Check if member exists in team
    const memberExists = team.members.some(member => member.name === assignedTo);
    if (!memberExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Team member not found");
    }
    task.assignedTo = assignedTo;
    yield task.save();
    return task;
});
const reassignTasks = (teamId) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findById(teamId);
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    // Get all projects for this team
    const projects = yield project_model_1.Project.find({ teamId });
    const projectIds = projects.map(p => p._id);
    // Get all tasks for these projects
    const tasks = yield task_model_1.Task.find({
        projectId: { $in: projectIds },
        status: { $ne: 'done' }
    });
    // Simple reassignment logic: assign tasks to members with available capacity
    const memberTasks = {};
    const memberCapacity = {};
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
            const availableMember = team.members.find(member => memberTasks[member.name] < memberCapacity[member.name]);
            if (availableMember && task.assignedTo !== availableMember.name) {
                const oldAssignee = task.assignedTo;
                task.assignedTo = availableMember.name;
                yield task.save();
                // Update counts
                if (oldAssignee)
                    memberTasks[oldAssignee]--;
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
});
exports.TaskServices = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignTask,
    reassignTasks
};
