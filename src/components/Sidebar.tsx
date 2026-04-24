import { useState } from "react";
// Asset Imports
import logo from "../assets/logo.svg";
import dashboardIcon from "../assets/sidebarLogos/dashboard.png";
import adminIcon from "../assets/sidebarLogos/user-setting.png";
import projectIcon from "../assets/sidebarLogos/backlog.png";
import service from "../assets/sidebarLogos/service.png";
import logOut from "../assets/sidebarLogos/log-out.png";

export default function Sidebar({
  activePage,
  setActivePage,
}: {
  activePage: string;
  setActivePage: (page: string) => void;
}) {
  // State Management
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Toggle dropdown logic
  const toggle = (name: string) => setOpenMenu(openMenu === name ? null : name);

  // Final Logout Execution
  const handleConfirmLogout = () => {
    // 1. Hide the confirmation popup immediately
    setShowPopup(false);

    // 2. Start the loading spinner in the logout button
    setIsLoggingOut(true);

    // 3. Simulate the logout process (e.g., clearing local storage)
    setTimeout(() => {
      // 4. STOP the loader
      setIsLoggingOut(false);

      // 5. NAVIGATE to the login page
      setActivePage("login");

      localStorage.clear();
      // Optional: If using real auth, clear your tokens here
      // localStorage.removeItem("token");
    }, 2000); // 2 seconds delay
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* Branding */}
          <div className="logo-section">
            <img src={logo} className="main-logo" alt="Logo" />
          </div>

          {/* Self Dashboard */}
          <div
            className={`menu-item ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActivePage("dashboard");
              setOpenMenu(null);
            }}
          >
            <div className="sidebar-link">
              <div className="link-content">
                <img src={dashboardIcon} className="sideBar-logo" alt="" />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  Self Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Admin Group */}
          <div className="menu-group">
            <div
              className={`menu-item ${openMenu === "admin" ? "active" : ""}`}
              onClick={() => toggle("admin")}
            >
              <div className="sidebar-link">
                <div className="link-content">
                  <img src={adminIcon} className="sideBar-logo" alt="" />
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>
                    Admin
                  </span>
                </div>
                <span>{openMenu === "admin" ? "⏶" : "⏷"}</span>
              </div>
            </div>
            <div
              className={`dropdown-container ${openMenu === "admin" ? "open" : ""}`}
            >
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePage("adminDashboard");
                }}
              >
                Admin Dashboard
              </div>
            </div>

            <div
              className={`dropdown-container ${openMenu === "admin" ? "open" : ""}`}
            >
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePage("adminCreation");
                }}
              >
                Admin Creation
              </div>
            </div>
          </div>

          {/* Service Link */}
          <div
            className={`menu-item ${activePage === "service" ? "active" : ""}`}
            onClick={() => {
              setActivePage("service");
              setOpenMenu(null);
            }}
          >
            <div className="sidebar-link">
              <div className="link-content">
                <img src={service} className="sideBar-logo" alt="" />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  Service
                </span>
              </div>
            </div>
          </div>

          {/* Project Group */}
          <div className="menu-group">
            <div
              className={`menu-item ${openMenu === "project" ? "active" : ""}`}
              onClick={() => toggle("project")}
            >
              <div className="sidebar-link">
                <div className="link-content">
                  <img src={projectIcon} className="sideBar-logo" alt="" />
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>
                    Project
                  </span>
                </div>
                <span>{openMenu === "project" ? "⏶" : "⏷"}</span>
              </div>
            </div>
            <div
              className={`dropdown-container ${openMenu === "project" ? "open" : ""}`}
            >
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePage("projectDash");
                }}
              >
                Project Dashboard
              </div>
            </div>

            <div
              className={`dropdown-container ${openMenu === "project" ? "open" : ""}`}
            >
              <div
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePage("project-create");
                }}
              >
                Project creation
              </div>
            </div>
          </div>
        </div>

        {/* LOGOUT - Pushed to bottom */}
        <div
          className="menu-item logout-item"
          onClick={() => !isLoggingOut && setShowPopup(true)}
        >
          <div className="sidebar-link">
            <div className="link-content">
              {isLoggingOut ? (
                <div className="loader"></div>
              ) : (
                <img src={logOut} className="sideBar-logo" alt="" />
              )}
              <span style={{ fontSize: "14px", fontWeight: 500 }}>
                {isLoggingOut ? "Logging out..." : "Log Out"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* --- POPUP MODAL --- */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 style={{ color: "#111827" }}>Are you sure?</h3>
            <p style={{ color: "#6b7280", marginTop: "10px" }}>
              Do you really want to log out of the system?
            </p>
            <div className="popup-actions">
              <button className="btn-no" onClick={() => setShowPopup(false)}>
                No
              </button>
              <button className="btn-yes" onClick={handleConfirmLogout}>
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
