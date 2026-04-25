import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= TYPE ================= */
interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

/* ================= COMPONENT ================= */
export default function AdminCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "Admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.name) return "Name is required";
    if (!form.email) return "Email is required";
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError("");
    setLoading(true);

    // 🔥 MOCK API DELAY (2 sec)
    setTimeout(() => {
      console.log("NEW ADMIN:", form);

      setLoading(false);

      // redirect back to admin dashboard
      navigate("/dashboard/admin");
    }, 2000);
  };

  return (
    <div className="admin-form-container">

      {/* ===== HEADER ===== */}
      <div className="admin-form-header">
        <h1>Create Admin</h1>
        <p>Add a new admin user to the system</p>
      </div>

      {/* ===== FORM ===== */}
      <form className="admin-form" onSubmit={handleSubmit}>

        {/* ERROR */}
        {error && <div className="form-error">{error}</div>}

        {/* NAME */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* ROLE */}
        <div className="form-group">
          <label>Role</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/dashboard/admin")}
          >
            Cancel
          </button>

          <button type="submit" className="btn-submit">
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </div>

      </form>
    </div>
  );
}