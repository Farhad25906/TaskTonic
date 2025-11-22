"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRoutes = void 0;
const express_1 = __importDefault(require("express"));
const team_controller_1 = require("./team.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = express_1.default.Router();
router.post("/", checkAuth_1.checkAuth, team_controller_1.TeamControllers.createTeam);
router.get("/", checkAuth_1.checkAuth, team_controller_1.TeamControllers.getAllTeams);
router.get("/:id", checkAuth_1.checkAuth, team_controller_1.TeamControllers.getTeamById);
router.patch("/:id", checkAuth_1.checkAuth, team_controller_1.TeamControllers.updateTeam);
router.delete("/:id", checkAuth_1.checkAuth, team_controller_1.TeamControllers.deleteTeam);
router.post("/:id/members", checkAuth_1.checkAuth, team_controller_1.TeamControllers.addTeamMember);
router.patch("/:id/members/:memberId", checkAuth_1.checkAuth, team_controller_1.TeamControllers.updateTeamMember);
router.delete("/:id/members/:memberId", checkAuth_1.checkAuth, team_controller_1.TeamControllers.deleteTeamMember);
exports.TeamRoutes = router;
