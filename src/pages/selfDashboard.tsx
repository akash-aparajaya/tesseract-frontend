import React, { useState, useEffect, useMemo } from 'react';
import '../styles/dashboard.css';

const TesseractDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bellRing, setBellRing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const dayType = date.getDay() === 0 || date.getDay() === 6 ? 'Weekend' : 'Weekday';
    return `${dayName}, ${month} ${day}, ${year} · ${dayType}`;
  };

  const stats = [
    { label: 'Admins', value: 5, icon: '👥', color: '#4f8ef7', bg: '#e8f0ff', trend: '+1 this month' },
    { label: 'Services', value: 12, icon: '⚙️', color: '#00c896', bg: '#e0faf3', trend: '+3 active' },
    { label: 'Projects', value: 8, icon: '📁', color: '#f5a623', bg: '#fff4e0', trend: '+2 in progress' },
  ];

  const distribution = [
    { name: 'Services', value: 12, color: '#00c896', percent: 48 },
    { name: 'Projects', value: 8, color: '#f5a623', percent: 32 },
    { name: 'Admins', value: 5, color: '#4f8ef7', percent: 20 },
  ];

  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const donutSegments = useMemo(() => {
    let offset = 0;
    return distribution.map((item) => {
      const dashArray = (item.percent / 100) * circumference;
      const dashOffset = -offset;
      offset += dashArray;
      return { ...item, dashArray, dashOffset };
    });
  }, [distribution]);

  const handleBellClick = () => {
    setBellRing(true);
    setTimeout(() => setBellRing(false), 600);
  };

  return (
    <div className="dashboard">
      {/* Header */}
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
            <span className={`bell-icon ${bellRing ? 'ring' : ''}`}>🔔</span>
            <span className="notif-dot"></span>
          </div>
          <div className="user-avatar">AU</div>
        </div>
      </header>

      {/* Hero Section */}
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

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className="stat-trend" style={{ color: stat.color }}>↑ {stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout: Profile (left) + Donut (right) */}
      <div className="two-columns">
        {/* LEFT COLUMN – Admin Profile */}
        <div className="left-col">
          <div className="card profile-card">
            <div className="card-header">
              <h3>Admin Profile</h3>
              <button className="card-btn">Edit</button>
            </div>
            <div className="profile-content">
              <div className="profile-avatar">👤</div>
              <h4 className="profile-name">Admin User</h4>
              <p className="profile-role">System Administrator</p>
              <div className="profile-details">
                <div className="detail-row">
                  <span>Role</span>
                  <span className="badge super-admin">Super Admin</span>
                </div>
                <div className="detail-row">
                  <span>Status</span>
                  <span className="badge active">● Active</span>
                </div>
                <div className="detail-row">
                  <span>Last Login</span>
                  <span>Today, {formatTime(currentTime)}</span>
                </div>
                <div className="detail-row">
                  <span>Email</span>
                  <span>admin@aparajayah.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN – System Overview (Donut Chart) */}
        <div className="right-col">
          <div className="card distribution-card">
            <div className="card-header">
              <h3>System Overview</h3>
              <button className="card-btn">Details</button>
            </div>
            <div className="donut-container">
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
                  />
                ))}
                <text x="70" y="64" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1a1a2e">80%</text>
                <text x="70" y="80" textAnchor="middle" fontSize="10" fill="#7a8499">Uptime</text>
              </svg>
              <div className="donut-legend">
                {distribution.map((item, idx) => (
                  <div key={idx} className="legend-item">
                    <span className="legend-dot" style={{ background: item.color }}></span>
                    <span>{item.name}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TesseractDashboard;