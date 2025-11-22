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
exports.ProjectServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const project_model_1 = require("./project.model");
const task_model_1 = require("../task/task.model");
const createProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, teamId, createdBy } = payload;
    // Check if project with same title already exists in this team
    const existingProject = yield project_model_1.Project.findOne({
        title,
        teamId,
        createdBy
    });
    if (existingProject) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Project with this title already exists in this team");
    }
    const project = yield project_model_1.Project.create(payload);
    return project;
});
const getAllProjects = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_model_1.Project.find({ createdBy: userId })
        .populate("teamId", "name")
        .sort({ createdAt: -1 });
    return projects;
});
const getProjectById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findOne({ _id: id, createdBy: userId })
        .populate("teamId", "name");
    if (!project) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Project not found");
    }
    return project;
});
const updateProject = (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findOne({ _id: id, createdBy: userId });
    if (!project) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Project not found");
    }
    // If title is being updated, check for duplicates
    if (payload.title && payload.title !== project.title) {
        const existingProject = yield project_model_1.Project.findOne({
            title: payload.title,
            teamId: project.teamId,
            createdBy: userId,
            _id: { $ne: id },
        });
        if (existingProject) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Another project with this title already exists in this team");
        }
    }
    const updatedProject = yield project_model_1.Project.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("teamId", "name");
    return updatedProject;
});
const deleteProject = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.Project.findOne({ _id: id, createdBy: userId });
    if (!project) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Project not found");
    }
    // Check if project has tasks
    const taskCount = yield task_model_1.Task.countDocuments({ projectId: id });
    if (taskCount > 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot delete project with ${taskCount} tasks. Delete tasks first.`);
    }
    yield project_model_1.Project.findByIdAndDelete(id);
    return {
        message: "Project deleted successfully",
        deletedProject: project.title,
    };
});
const getProjectsByTeam = (teamId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_model_1.Project.find({ teamId, createdBy: userId })
        .populate("teamId", "name")
        .sort({ createdAt: -1 });
    return projects;
});
exports.ProjectServices = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectsByTeam,
};
