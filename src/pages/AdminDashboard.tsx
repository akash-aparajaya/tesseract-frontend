import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= MOCK DATA ================= */
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: "1",
    name: "Akash",
    email: "akash@gmail.com",
    role: "Super Admin",
    status: "active",
    createdAt: "2026-04-20",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@gmail.com",
    role: "Manager",
    status: "active",
    createdAt: "2026-04-21",
  },
  {
    id: "3",
    name: "Priya",
    email: "priya@gmail.com",
    role: "Support",
    status: "inactive",
    createdAt: "2026-04-22",
  },
];

/* ================= COMPONENT ================= */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== 1 SEC LOADER ===== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="admin-container">
      {/* ===== HEADER ===== */}
      <div className="admin-header">
        <div>
          <h1>Admin Control Panel</h1>
          <p>Manage users, roles and system access</p>
        </div>

        <button
          className="admin-create-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/dashboard/admin-create");
          }}
        >
          + Add User
        </button>
      </div>

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="admin-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-card skeleton-card"></div>
          ))}
        </div>
      )}

      {/* ===== DATA ===== */}
      {!loading && (
        <div className="admin-grid">
          {users.map((user) => (
            <div key={user.id} className="admin-card">
              <div className="admin-card-top">
                <span className={`status ${user.status}`}>{user.status}</span>
                <span className="role">{user.role}</span>
              </div>

              <h3>{user.name}</h3>
              <p className="email">{user.email}</p>

              <div className="admin-footer">
                <span>
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </span>

                <div className="actions">
                  <button className="edit">✎</button>
                  <button className="delete">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}