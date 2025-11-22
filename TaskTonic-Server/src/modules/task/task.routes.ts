
import express from "express";
import { TaskControllers } from "./task.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post("/", checkAuth, TaskControllers.createTask);
router.get("/", checkAuth, TaskControllers.getAllTasks);
router.get("/:id", checkAuth, TaskControllers.getTaskById);
router.patch("/:id", checkAuth, TaskControllers.updateTask);
router.delete("/:id", checkAuth, TaskControllers.deleteTask);
router.patch("/:id/assign", checkAuth, TaskControllers.assignTask);
router.post("/reassign", checkAuth, TaskControllers.reassignTasks);

export const TaskRoutes = router;