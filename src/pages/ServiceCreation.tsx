import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ServiceCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Created Service:", form);

    navigate("/dashboard/service");
  };

  return (
    <div className="form-container">

      <h2>Create Service</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Service Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter service name"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard/service")}
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary">
            Create
          </button>
        </div>

      </form>
    </div>
  );
}