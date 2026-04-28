import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../components/Layout";
import Login from "../pages/login";
import Dashboard from "../pages/selfDashboard";

import ProjectDashboard from "../pages/ProjectDashboard";
import ProjectCreateForm from "../pages/ProjectCreateForm";
import ProjectView from "../pages/ProjectView";

import AdminDashboard from "../pages/AdminDashboard";
import AdminCreate from "../pages/AdminCreate";

import ServiceDashboard from "../pages/ServiceDashboard";
import ServiceCreate from "../pages/ServiceCreation";


const router = createBrowserRouter([
  // ================= LOGIN =================
  {
    path: "/",
    element: <Login />,
  },

  // ================= DASHBOARD LAYOUT =================
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      // ================= ADMIN =================
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin-create",
        element: <AdminCreate />,
      },

      // ================= SERVICE =================
      {
        path: "service",
        element: <ServiceDashboard />,
      },
      {
        path: "service-create",
        element: <ServiceCreate />,
      },

      // ================= PROJECT =================
      {
        path: "project",
        element: <ProjectDashboard />,
      },
      {
        path: "project-create",
        element: <ProjectCreateForm />,
      },
      {
        path: "project/:projectId/logs",          // ✅ new route
        element: <ProjectView />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}