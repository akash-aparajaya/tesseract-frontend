import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState("dashboard");

  // If the user is on the login page, we might not want to show the sidebar at all
  if (activePage === "login") {
    return (
      <div className="login-container">
        <h1>Login Page</h1>
        <p>Please enter your credentials to continue.</p>
        <button onClick={() => setActivePage("dashboard")}>Log In (Test)</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <main className="page-wrapper">
        {activePage === "dashboard" && children}
        {activePage === "project-dash" && <h1>Project Dashboard</h1>}
        {/* ... other pages */}
      </main>
    </div>
  );
}