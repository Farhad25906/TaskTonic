"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true,
    },
    description: {
        type: String,
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Project",
        required: [true, "Project reference is required"],
    },
    assignedTo: {
        type: String, // Store team member name instead of ObjectId for simplicity
    },
    priority: {
        type: String,
        default: "medium",
    },
    status: {
        type: String,
        default: "pending",
    }
}, {
    timestamps: true,
});
exports.Task = (0, mongoose_1.model)("Task", taskSchema);
