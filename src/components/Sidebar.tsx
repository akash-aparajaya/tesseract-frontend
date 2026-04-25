import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Assets
import logo from "../assets/logo.svg";
import dashboardIcon from "../assets/sidebarLogos/dashboard.png";
import adminIcon from "../assets/sidebarLogos/user-setting.png";
import projectIcon from "../assets/sidebarLogos/backlog.png";
import service from "../assets/sidebarLogos/service.png";
import logOut from "../assets/sidebarLogos/log-out.png";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const toggle = (name: string) => setOpenMenu(openMenu === name ? null : name);

  const handleConfirmLogout = () => {
    setShowPopup(false);
    setIsLoggingOut(true);

    setTimeout(() => {
      setIsLoggingOut(false);
      localStorage.clear();
      navigate("/");
    }, 2000);
  };

  const token = localStorage.getItem("token");

let role: string | unknown = null;

if (token) {
  try {
    const decoded: string = jwtDecode(token);
    role = decoded;
  } catch (err: unknown) {
    console.log("Invalid token", err);
  }
}

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo-section">
            <img src={logo} className="main-logo" alt="Logo" />
          </div>

          {/* Self Dashboard */}
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <div className="sidebar-link">
              <div className="link-content">
                <img src={dashboardIcon} className="sideBar-logo" alt="" />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  Self Dashboard
                </span>
              </div>
            </div>
          </NavLink>

          {/* Admin */}

          {role === "SUPER_ADMIN" && (
            <NavLink
              to="/dashboard/admin"
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <div className="sidebar-link">
                <div className="link-content">
                  <img src={adminIcon} className="sideBar-logo" alt="" />
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>
                    Admin
                  </span>
                </div>
              </div>
            </NavLink>
          )}

          {/* <div className="menu-group">
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

            <div className={`dropdown-container ${openMenu === "admin" ? "open" : ""}`}>
              <NavLink to="/dashboard/admin" className="dropdown-item">
                Admin Dashboard
              </NavLink>
              <NavLink to="/dashboard/admin-create" className="dropdown-item">
                Admin Creation
              </NavLink>
            </div>
          </div> */}

          {/* Service */}
          <NavLink
            to="/dashboard/service"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <div className="sidebar-link">
              <div className="link-content">
                <img src={service} className="sideBar-logo" alt="" />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  Service
                </span>
              </div>
            </div>
          </NavLink>

          {/* Project */}
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
              <NavLink
                to="/dashboard/project"
                className={({ isActive }) =>
                  `dropdown-item ${isActive ? "active-child" : ""}`
                }
              >
                Project Dashboard
              </NavLink>
              {/* <NavLink to="/dashboard/project-create" className="dropdown-item">
                Project creation
              </NavLink> */}
            </div>
          </div>
        </div>

        {/* Logout */}
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

      {/* Popup */}
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
