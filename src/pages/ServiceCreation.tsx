import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ServiceCreate.css";

export default function ServiceCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [errors, setErrors] = useState({ name: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "name") setErrors({ ...errors, name: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: "Service name is required" });
      return;
    }
    console.log("Created Service:", form);
    navigate("/dashboard/service");
  };

  return (
    <div className="create-service-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Create Service</h1>
          <p className="subtitle">Add a new service to the system</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Web Development"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the service"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard/service")}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              Create Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}