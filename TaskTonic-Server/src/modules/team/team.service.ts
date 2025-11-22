import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Team } from "./team.model";

const createTeam = async (payload: any) => {
  const { name, createdBy } = payload;

  const existingTeam = await Team.findOne({
    name,
    createdBy,
  });

  if (existingTeam) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a team with this name"
    );
  }

  const team = await Team.create(payload);
  return team;
};

const getAllTeams = async (userId: string) => {
  const teams = await Team.find({ createdBy: userId })
    .sort({ createdAt: -1 });

  return teams;
};

const getTeamById = async (id: string, userId: string) => {
  const team = await Team.findOne({ _id: id, createdBy: userId });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  return team;
};

const updateTeam = async (id: string, userId: string, payload: any) => {
  const team = await Team.findOne({ _id: id, createdBy: userId });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  // If name is being updated, check for duplicates
  if (payload.name && payload.name !== team.name) {
    const existingTeam = await Team.findOne({
      name: payload.name,
      createdBy: userId,
      _id: { $ne: id },
    });

    if (existingTeam) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You already have another team with this name"
      );
    }
  }

  const updatedTeam = await Team.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedTeam;
};

const deleteTeam = async (id: string, userId: string) => {
  const team = await Team.findOne({ _id: id, createdBy: userId });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  await Team.findByIdAndDelete(id);

  return {
    message: "Team deleted successfully",
    deletedTeam: team.name,
  };
};

const addTeamMember = async (teamId: string, userId: string, memberData: any) => {
  const team = await Team.findOne({ _id: teamId, createdBy: userId });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  // Check if member name already exists in this team
  const existingMember = team.members.find(
    (member) => member.name.toLowerCase() === memberData.name.toLowerCase()
  );

  if (existingMember) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Team member with this name already exists in this team"
    );
  }

  team.members.push(memberData);
  await team.save();
  
  return team;
};

const updateTeamMember = async (teamId: string, userId: string, memberId: string, memberData: any) => {
  const team = await Team.findOne({ _id: teamId, createdBy: userId });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  const member = team.members.id(memberId);
  if (!member) {
    throw new AppError(httpStatus.NOT_FOUND, "Team member not found");
  }

  // Check for duplicate name (excluding current member)
  if (memberData.name && memberData.name !== member.name) {
    const existingMember = team.members.find(
      (m) => m._id.toString() !== memberId && m.name.toLowerCase() === memberData.name.toLowerCase()
    );

    if (existingMember) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Another team member with this name already exists in this team"
      );
    }
  }

  member.set(memberData);
  await team.save();
  
  return team;
};

const deleteTeamMember = async (teamId: string, userId: string, memberId: string) => {
  const team = await Team.findOne({ _id: teamId, createdBy: userId });

  if (!team) {
    throw new AppError(httpStatus.NOT_FOUND, "Team not found");
  }

  const member = team.members.id(memberId);
  if (!member) {
    throw new AppError(httpStatus.NOT_FOUND, "Team member not found");
  }

  team.members.pull(memberId);
  await team.save();

  return {
    message: "Team member deleted successfully",
    deletedMember: member.name,
  };
};

export const TeamServices = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
};