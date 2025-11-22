import App from "@/App";
import DashboardLayout from "@/layouts/Dashboardlayout";
import AllTeams from "@/pages/AllTeams";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
// import DashboardLayout from "@/layouts/DashboardLayout";
// import DashboardPage from "@/pages/dashboard/DashboardPage";
import ProjectsPage from "@/pages/AllProjects";
// import TeamsPage from "@/pages/dashboard/TeamsPage";
// import TasksPage from "@/pages/dashboard/TasksPage";
// import CalendarPage from "@/pages/dashboard/CalendarPage";
// import SettingsPage from "@/pages/dashboard/SettingsPage";

import { createBrowserRouter } from "react-router";
import Task from "@/pages/Task";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: HomePage,
        index: true,
      },
    ],
  },
  {
    Component: Login,
    path: "/login",
  },
  {
    Component: Register,
    path: "/register",
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      // {
      //   index: true,
      //   Component: DashboardPage,
      // },
      {
        path: "projects",
        Component: ProjectsPage,
      },
      {
        path: "teams",
        Component: AllTeams,
      },
      {
        path: "tasks",
        Component: Task,
      },
      // {
      //   path: "calendar",
      //   Component: CalendarPage,
      // },
      // {
      //   path: "settings",
      //   Component: SettingsPage,
      // },
    ],
  },
]);