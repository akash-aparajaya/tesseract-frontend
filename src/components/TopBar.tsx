import { useState } from "react";
import { FaUserAlt, FaSearch, FaBell } from "react-icons/fa";
import "../styles/TopBar.css";

export default function TopBar() {
  const [search, setSearch] = useState("");
  const [bellActive, setBellActive] = useState(false);

  // Static user data – you can replace with real data from context/localStorage
  const userName = "Akash";
  const userRole = "SUPER ADMIN";

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
        {/* <div className="logo">TESSERACT</div> */}
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
        {/* Bell with improved animation */}
        <div className={`bell ${bellActive ? "animate" : ""}`} onClick={handleBell}>
          <FaBell />
          <span className="badge">3</span>
        </div>

        {/* Static Profile – no dropdown */}
        <div className="profile">
          <div className="avatar">
            <FaUserAlt />
          </div>
          <div className="info">
            <span className="name">{userName}</span>
            <span className="role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}