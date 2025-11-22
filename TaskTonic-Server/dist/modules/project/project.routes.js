"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("./project.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = express_1.default.Router();
router.post("/", checkAuth_1.checkAuth, project_controller_1.ProjectControllers.createProject);
router.get("/", checkAuth_1.checkAuth, project_controller_1.ProjectControllers.getAllProjects);
router.get("/team/:teamId", checkAuth_1.checkAuth, project_controller_1.ProjectControllers.getProjectsByTeam);
router.get("/:id", checkAuth_1.checkAuth, project_controller_1.ProjectControllers.getProjectById);
router.patch("/:id", checkAuth_1.checkAuth, project_controller_1.ProjectControllers.updateProject);
router.delete("/:id", checkAuth_1.checkAuth, project_controller_1.ProjectControllers.deleteProject);
exports.ProjectRoutes = router;
