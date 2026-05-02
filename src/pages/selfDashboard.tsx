import React, { useState, useEffect, useMemo } from "react";
import "../styles/dashboard.css";
import { useToast } from "../hooks/useToast";
import { getUserApi } from "../services/authApi";
import Loader from "@/components/common/Loader";

const TesseractDashboard: React.FC = () => {
  // 📢 Toast notifications hook
  const { showToast, ToastContainer } = useToast();

  // ⏰ Time state for live clock
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bellRing, setBellRing] = useState(false); // animation trigger for notification bell

  // 📊 Data states
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    id: 1,
    name: "Loading...",
    role: "System Administrator",
    email: "loading@aparajayah.com",
    lastLogin: "",
    status: "Active",
  });

  // Stat cards (Admins, Services, Projects)
  const [stats, setStats] = useState([
    { label: "Admins", value: 0, icon: "👥", color: "#4f8ef7", bg: "#e8f0ff" },
    { label: "Services", value: 0, icon: "⚙️", color: "#00c896", bg: "#e0faf3" },
    { label: "Projects", value: 0, icon: "📁", color: "#f5a623", bg: "#fff4e0" },
  ]);

  // Distribution for donut chart (Services, Projects, Admins)
  const [distribution, setDistribution] = useState([
    { name: "Services", value: 0, color: "#00c896", percent: 0 },
    { name: "Projects", value: 0, color: "#f5a623", percent: 0 },
    { name: "Admins", value: 0, color: "#4f8ef7", percent: 0 },
  ]);

  const uptime = 80; // static uptime – replace with real API if needed

  // 🔄 Fetch all dashboard data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await getUserApi();
        console.log(profileData.data);

        // Set user profile
        setProfile({
          id: profileData.data.users.id,
          name: profileData.data.users.user_name,
          role: profileData.data.users.role === "admin" ? "ADMIN" : "SUPER ADMIN",
          email: profileData.data.users.email,
          lastLogin: profileData?.data?.lastLogin || "",
          status: profileData.data.users.is_deleted === false ? "Active" : "Inactive",
        });

        // Set stats counts
        setStats([
          { label: "Admins", value: profileData.data.statsData.totalAdmins, icon: "👥", color: "#4f8ef7", bg: "#e8f0ff" },
          { label: "Services", value: profileData.data.statsData.totalServices, icon: "⚙️", color: "#00c896", bg: "#e0faf3" },
          { label: "Projects", value: profileData.data.statsData.totalActiveProjects, icon: "📁", color: "#f5a623", bg: "#fff4e0" },
        ]);

        // Calculate distribution for donut chart (percentages)
        const total = profileData.data.statsData.totalServices +
                      profileData.data.statsData.totalActiveProjects +
                      profileData.data.statsData.totalAdmins;
        setDistribution([
          { name: "Services", value: profileData.data.statsData.totalServices, color: "#00c896", percent: (profileData.data.statsData.totalServices / total) * 100 },
          { name: "Projects", value: profileData.data.statsData.totalActiveProjects, color: "#f5a623", percent: (profileData.data.statsData.totalActiveProjects / total) * 100 },
          { name: "Admins", value: profileData.data.statsData.totalAdmins, color: "#4f8ef7", percent: (profileData.data.statsData.totalAdmins / total) * 100 },
        ]);
      } catch (error) {
        console.error("Dashboard API error:", error);
        showToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ⏱️ Live clock – updates every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🕒 Format current time as HH:MM:SS AM/PM
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
  };

  // 📅 Format current date: Day, Month DD, YYYY · Weekday/Weekend
  const formatDate = (date: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const dayType = date.getDay() === 0 || date.getDay() === 6 ? "Weekend" : "Weekday";
    return `${dayName}, ${month} ${day}, ${year} · ${dayType}`;
  };

  // 🥧 Donut chart calculations – generates stroke dasharray and offset for each segment
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const donutSegments = useMemo(() => {
    return distribution.map((item, idx) => {
      const dashArray = (item.percent / 100) * circumference;
      const dashOffset = -distribution
        .slice(0, idx)
        .reduce((sum, prev) => sum + (prev.percent / 100) * circumference, 0);
      return { ...item, dashArray, dashOffset };
    });
  }, [distribution, circumference]);

  // 🔔 Notification bell click handler with shake animation
  const handleBellClick = () => {
    setBellRing(true);
    setTimeout(() => setBellRing(false), 600);
  };

  // ⏳ Loading screen while data is being fetched
  if (loading) {
     return <Loader />;
  }

  return (
    <>
      <ToastContainer />
      <div className="dashboard">
        {/* -------------------- HEADER -------------------- */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">🔷</div>
              <span className="logo-text">TESSERACT</span>
            </div>
            <div className="breadcrumb">
              <span>Dashboard</span>
              <span className="sep">/</span>
              <span className="current">Self Dashboard</span>
            </div>
          </div>
          <div className="header-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search..." />
            </div>
            <div className="icon-btn notif-btn" onClick={handleBellClick}>
              <span className={`bell-icon ${bellRing ? "ring" : ""}`}>🔔</span>
              <span className="notif-dot"></span>
            </div>
            <div className="user-avatar">{profile.name.slice(0, 2)}</div>
          </div>
        </header>

        {/* -------------------- HERO SECTION (Time & Company) -------------------- */}
        <div className="hero">
          <div className="hero-content">
            <div className="hero-time">{formatTime(currentTime)}</div>
            <div className="hero-date">{formatDate(currentTime)}</div>
          </div>
          <div className="hero-company">
            <div className="company-logo">AT</div>
            <div>
              <div className="company-name">Aparajayah Technologies Pvt Ltd</div>
              <div className="company-quote">"Consistency beats talent every time."</div>
            </div>
          </div>
        </div>

        {/* -------------------- STATS CARDS -------------------- */}
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div className="stat-card" key={idx}>
              <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* -------------------- TWO COLUMN LAYOUT (Profile + Donut) -------------------- */}
        <div className="two-columns">
          {/* LEFT COLUMN – Aadhar style profile card */}
          <div className="left-col">
            <div className="card aadhar-card animated-aadhar">
              <div className="aadhar-header">
                <div className="aadhar-logo">
                  <span>🔷</span>
                  <span>USER PROFILE</span>
                </div>
                <div className="aadhar-title">IDENTITY</div>
              </div>
              <div className="aadhar-body">
                <div className="aadhar-avatar animated-avatar">
                  <div className="avatar-photo">👤</div>
                  <div className="avatar-label">Photo</div>
                </div>
                <div className="aadhar-details">
                  <div className="detail-group animated-detail" style={{ animationDelay: '0.05s' }}>
                    <label>Name</label>
                    <p>{profile.name}</p>
                  </div>
                  <div className="detail-group animated-detail" style={{ animationDelay: '0.1s' }}>
                    <label>Role / Type</label>
                    <p>{profile.role}</p>
                  </div>
                  <div className="detail-group animated-detail" style={{ animationDelay: '0.15s' }}>
                    <label>Status</label>
                    <p className={profile.status === "Active" ? "status-active" : "status-inactive"}>
                      {profile.status === "Active" ? "● Active" : profile.status}
                    </p>
                  </div>
                  <div className="detail-group animated-detail" style={{ animationDelay: '0.2s' }}>
                    <label>Last Login</label>
                    <p>{profile.lastLogin || formatTime(currentTime)}</p>
                  </div>
                  <div className="detail-group animated-detail" style={{ animationDelay: '0.25s' }}>
                    <label>Email Address</label>
                    <p>{profile.email}</p>
                  </div>
                </div>
              </div>
              <div className="aadhar-footer">
                <div className="aadhar-id" style={{ fontWeight: "bold", fontSize: "12px",color:"darkblue" }}>Admin ID: ADI-{profile.id}</div>
                <div className="aadhar-signature">Authorised Signature</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Aadhar style System Overview (Donut) */}
          <div className="right-col">
            <div className="card aadhar-card pie-card animated-aadhar">
              <div className="aadhar-header">
                <div className="aadhar-logo">
                  <span>📊</span>
                  <span>SYSTEM HEALTH</span>
                </div>
                <div className="aadhar-title">RESOURCE METRICS</div>
              </div>
              <div className="pie-card-body">
                <div className="donut-container">
                  {/* Donut chart SVG */}
                  <svg width="160" height="160" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="54" fill="none" stroke="#eef1f8" strokeWidth="20" />
                    {donutSegments.map((seg, idx) => (
                      <circle
                        key={idx}
                        cx="70"
                        cy="70"
                        r="54"
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="20"
                        strokeDasharray={`${seg.dashArray} ${circumference}`}
                        strokeDashoffset={seg.dashOffset}
                        transform="rotate(-90 70 70)"
                        className="animated-donut-segment"
                        style={{ animationDelay: `${idx * 0.15}s` }}
                      />
                    ))}
                    <text x="70" y="64" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1a1a2e">
                      {uptime}%
                    </text>
                    <text x="70" y="80" textAnchor="middle" fontSize="10" fill="#7a8499">
                      Uptime
                    </text>
                  </svg>
                  {/* Legend */}
                  <div className="donut-legend animated-legend">
                    {distribution.map((item, idx) => (
                      <div key={idx} className="legend-item" style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                        <span className="legend-dot" style={{ background: item.color }}></span>
                        <span>{item.name}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="aadhar-footer">
                <div className="aadhar-id">Last updated: {formatTime(currentTime)}</div>
                <div className="aadhar-signature">Live Metrics</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TesseractDashboard;