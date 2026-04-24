import { useState } from "react";
import Sidebar from "./Sidebar";
import Login from "../pages/login"; // Your login file
import ProjectCreateForm from "../pages/ProjectCreateForm";
import ProjectDashboard from "@/pages/ProjectDashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Use "login" as initial state if no token exists
  const [activePage, setActivePage] = useState(
    localStorage.getItem("accessToken") ? "dashboard" : "login",
  );

  // If the user is on the login page, show ONLY the Login component
  if (activePage === "login") {
    return <Login setActivePage={setActivePage} />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main
        style={{
          flex: 1,
          padding: "40px",
          marginLeft: "260px",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        {/* Render children (Dashboard) only if activePage is not login */}
        {activePage === "dashboard" && children}
        {activePage === "settings" && <h1>Admin DashBoard</h1>}
        {activePage === "adminDashboard" && <h1>Admin Creation </h1>}
        {activePage === "adminCreation" && <h1>Service </h1>}
        {activePage === "projectDash" && 
        <ProjectDashboard setActivePage={setActivePage} />}

        {activePage === "project-create" && (
          <ProjectCreateForm setActivePage={setActivePage} />
        )}{" "}
      </main>
    </div>
  );
}
