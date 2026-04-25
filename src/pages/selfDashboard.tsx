import { useEffect, useState } from "react";

export default function SelfDashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Admins",
      value: 5,
      img: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      label: "Services",
      value: 12,
      img: "https://cdn-icons-png.flaticon.com/512/2091/2091665.png",
    },
    {
      label: "Projects",
      value: 8,
      img: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    },
  ];

  const dayType =
    time.getDay() === 0 || time.getDay() === 6 ? "Weekend" : "Weekday";

  // 🌤 Time of day theme
  const getTimeOfDay = () => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 20) return "evening";
    return "night";
  };

  const timeOfDay = getTimeOfDay();

  // 🌟 Motivational Quotes
  const quotes = [
    "Success is built one step at a time.",
    "Stay focused and never give up.",
    "Small progress is still progress.",
    "Discipline creates freedom.",
    "Dream big, start small, act now.",
    "Your only limit is your mindset.",
    "Consistency beats talent every time."
  ];

  const randomQuote = quotes[time.getDate() % quotes.length];

  return (
    <div className="dashboard-container">
      {/* 🌄 TIME WALLPAPER */}

      <div className={`time-wallpaper ${timeOfDay}`}>
        <div className="time-overlay">
          <h1>{time.toLocaleTimeString()}</h1>

          <p>
            {time.toDateString()} • {dayType}
          </p>

          {/* 🌟 MOTIVATIONAL QUOTE */}
         
        </div>
        <div className="company-glass-align">
          <div className="company-glass-patch">
            <img
              src="https://media.licdn.com/dms/image/v2/D4E0BAQExLT48-2ynDA/company-logo_200_200/company-logo_200_200/0/1722948116940/aparajayah_technologies_logo?e=2147483647&v=beta&t=2q3-qf8MoKXQltSmgqhnG01YNiSFXhpVQlVSfRTvH7w"
              alt="admin"
              className="company-logo"
            />
            <h3> Aparajayah Technologies Pvt Ltd</h3>
          </div>
         <h3 className="quote-text">“{randomQuote}”</h3>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="stats-grid">
        {stats.map((item, i) => (
          <div className="stat-card" key={i}>
            <img src={item.img} alt={item.label} />
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      {/* 🧩 MAIN GRID */}
      <div className="dashboard-grid">
        {/* PROFILE */}
        <div className="card profile-card hover-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="admin"
            className="profile-img"
          />

          <h3>Admin User</h3>
          <p>System Administrator</p>

          <div className="profile-info">
            <span>Role: Super Admin</span>
            <span>Status: Active</span>
          </div>
        </div>

        {/* SYSTEM STATUS */}
        <div className="card hover-card">
          <h3>System Health</h3>

          <div className="status-row">
            <div className="status-dot green"></div>
            <p>All services running normally</p>
          </div>

          <div className="status-row">
            <div className="status-dot blue"></div>
            <p>Database connection stable</p>
          </div>

          <div className="status-row">
            <div className="status-dot orange"></div>
            <p>API performance within limits</p>
          </div>

          <div className="status-row">
            <div className="status-dot green"></div>
            <p>No critical issues detected</p>
          </div>
        </div>
      </div>
    </div>
  );
}