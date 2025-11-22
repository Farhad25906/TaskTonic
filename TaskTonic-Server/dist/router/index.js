"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const team_routes_1 = require("../modules/team/team.routes");
const project_routes_1 = require("../modules/project/project.routes");
const task_routes_1 = require("../modules/task/task.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/team",
        route: team_routes_1.TeamRoutes
    },
    {
        path: "/project",
        route: project_routes_1.ProjectRoutes
    },
    {
        path: "/task",
        route: task_routes_1.TaskRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
