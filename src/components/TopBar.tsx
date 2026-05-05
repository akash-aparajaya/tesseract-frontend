import { useState } from "react";
import { FaUserAlt, FaSearch, FaBell } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "../styles/TopBar.css";

interface DecodedToken {
  name?: string;
  email?: string;
  role?: string;
}

// Helper to get user data from token synchronously
const formatRole = (role?: string) => {
  if (!role) return "";

  return role
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return { name: "User", role: "" };

  try {
    const decoded: DecodedToken = jwtDecode(token);

    return {
      name: decoded.name || decoded.email?.split("@")[0] || "User",
      role: formatRole(decoded.role), // ✅ formatted here
    };

  } catch (e) {
    console.error("Error decoding token:", e);
    return { name: "User", role: "" };
  }
};

export default function TopBar() {
  const [search, setSearch] = useState("");
  const [bellActive, setBellActive] = useState(false);
  const { name: userName, role: userRole } = getUserFromToken();

  const handleBell = () => {
    setBellActive(true);
    setTimeout(() => setBellActive(false), 600);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", search);
  };

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <form className="search-form" onSubmit={handleSearch}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="top-bar-right">
        {/* Bell with gentle shake + badge pulse */}
        <div className={`bell ${bellActive ? "animate" : ""}`} onClick={handleBell}>
          <FaBell />
          <span className="badge">3</span>
        </div>

        {/* Static profile – shows avatar + name/role */}
        <div className="profile">
          <div className="avatar">
            <FaUserAlt />
          </div>
          <div className="info">
            <span className="name">{userName}</span>
            <span className="role">{userRole || "Member"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}