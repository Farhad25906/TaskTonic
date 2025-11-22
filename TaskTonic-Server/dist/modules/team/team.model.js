"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = require("mongoose");
const teamMemberSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Team member name is required"],
        trim: true,
    },
    role: {
        type: String,
        required: [true, "Role is required"],
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [0, "Capacity cannot be less than 0"],
        max: [5, "Capacity cannot exceed 5"],
    }
});
const teamSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Team name is required"],
        trim: true,
    },
    description: {
        type: String,
        maxlength: [200, "Description cannot exceed 200 characters"]
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator reference is required"]
    },
    members: [teamMemberSchema]
}, {
    timestamps: true,
});
exports.Team = (0, mongoose_1.model)("Team", teamSchema);
