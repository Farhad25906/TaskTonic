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
exports.TeamServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const team_model_1 = require("./team.model");
const createTeam = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, createdBy } = payload;
    const existingTeam = yield team_model_1.Team.findOne({
        name,
        createdBy,
    });
    if (existingTeam) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have a team with this name");
    }
    const team = yield team_model_1.Team.create(payload);
    return team;
});
const getAllTeams = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const teams = yield team_model_1.Team.find({ createdBy: userId })
        .sort({ createdAt: -1 });
    return teams;
});
const getTeamById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findOne({ _id: id, createdBy: userId });
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    return team;
});
const updateTeam = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findOne({ _id: id, createdBy: userId });
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    // If name is being updated, check for duplicates
    if (payload.name && payload.name !== team.name) {
        const existingTeam = yield team_model_1.Team.findOne({
            name: payload.name,
            createdBy: userId,
            _id: { $ne: id },
        });
        if (existingTeam) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have another team with this name");
        }
    }
    const updatedTeam = yield team_model_1.Team.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedTeam;
});
const deleteTeam = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findOne({ _id: id, createdBy: userId });
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    yield team_model_1.Team.findByIdAndDelete(id);
    return {
        message: "Team deleted successfully",
        deletedTeam: team.name,
    };
});
const addTeamMember = (teamId, userId, memberData) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findOne({ _id: teamId, createdBy: userId });
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    // Check if member name already exists in this team
    const existingMember = team.members.find((member) => member.name.toLowerCase() === memberData.name.toLowerCase());
    if (existingMember) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Team member with this name already exists in this team");
    }
    team.members.push(memberData);
    yield team.save();
    return team;
});
const updateTeamMember = (teamId, userId, memberId, memberData) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findOne({ _id: teamId, createdBy: userId });
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    const member = team.members.id(memberId);
    if (!member) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team member not found");
    }
    // Check for duplicate name (excluding current member)
    if (memberData.name && memberData.name !== member.name) {
        const existingMember = team.members.find((m) => m._id.toString() !== memberId && m.name.toLowerCase() === memberData.name.toLowerCase());
        if (existingMember) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Another team member with this name already exists in this team");
        }
    }
    member.set(memberData);
    yield team.save();
    return team;
});
const deleteTeamMember = (teamId, userId, memberId) => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.Team.findOne({ _id: teamId, createdBy: userId });
    if (!team) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team not found");
    }
    const member = team.members.id(memberId);
    if (!member) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Team member not found");
    }
    team.members.pull(memberId);
    yield team.save();
    return {
        message: "Team member deleted successfully",
        deletedMember: member.name,
    };
});
exports.TeamServices = {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
};
