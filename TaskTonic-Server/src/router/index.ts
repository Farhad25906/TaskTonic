import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { TeamRoutes } from "../modules/team/team.routes"
import { ProjectRoutes } from "../modules/project/project.routes"
import { TaskRoutes } from "../modules/task/task.routes"


export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/team",
        route: TeamRoutes
    },
    {
        path: "/project",
        route: ProjectRoutes
    },
    {
        path: "/task",
        route: TaskRoutes
    },
    
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
