import express from "express";
import { TeamControllers } from "./team.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post("/", checkAuth, TeamControllers.createTeam);
router.get("/", checkAuth, TeamControllers.getAllTeams);
router.get("/:id", checkAuth, TeamControllers.getTeamById);
router.patch("/:id", checkAuth, TeamControllers.updateTeam);
router.delete("/:id", checkAuth, TeamControllers.deleteTeam);
router.post("/:id/members", checkAuth, TeamControllers.addTeamMember);
router.patch("/:id/members/:memberId", checkAuth, TeamControllers.updateTeamMember);
router.delete("/:id/members/:memberId", checkAuth, TeamControllers.deleteTeamMember);

export const TeamRoutes = router;