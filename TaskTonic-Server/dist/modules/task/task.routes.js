"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("./task.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = express_1.default.Router();
router.post("/", checkAuth_1.checkAuth, task_controller_1.TaskControllers.createTask);
router.get("/", checkAuth_1.checkAuth, task_controller_1.TaskControllers.getAllTasks);
router.get("/:id", checkAuth_1.checkAuth, task_controller_1.TaskControllers.getTaskById);
router.patch("/:id", checkAuth_1.checkAuth, task_controller_1.TaskControllers.updateTask);
router.delete("/:id", checkAuth_1.checkAuth, task_controller_1.TaskControllers.deleteTask);
router.patch("/:id/assign", checkAuth_1.checkAuth, task_controller_1.TaskControllers.assignTask);
router.post("/reassign", checkAuth_1.checkAuth, task_controller_1.TaskControllers.reassignTasks);
exports.TaskRoutes = router;
