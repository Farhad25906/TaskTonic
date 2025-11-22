import express from "express";
import { ProjectControllers } from "./project.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post("/", checkAuth, ProjectControllers.createProject);
router.get("/", checkAuth, ProjectControllers.getAllProjects);
router.get("/team/:teamId", checkAuth, ProjectControllers.getProjectsByTeam);
router.get("/:id", checkAuth, ProjectControllers.getProjectById);
router.patch("/:id", checkAuth, ProjectControllers.updateProject);
router.delete("/:id", checkAuth, ProjectControllers.deleteProject);

export const ProjectRoutes = router;