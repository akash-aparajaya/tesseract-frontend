import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/projectApi";
import { useToast } from "../hooks/useToast";

const AVAILABLE_SERVICES = ["SMS", "EMAIL"];

export default function ProjectCreateForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    isActive: true,
    services: [] as string[],
  });

  const { toast, showToast } = useToast();

  /* =========================================================
     HANDLE SERVICE SELECT
     ========================================================= */
  const handleServiceChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  /* =========================================================
     SUBMIT FORM
     ========================================================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.services.length === 0) {
      showToast("Please select at least one service", "error");
      return;
    }

    try {
      const res = await createProject(formData);

      if (res?.data?.success) {
        showToast("Project created successfully!", "success");

        // ✅ FIXED NAVIGATION
        setTimeout(() => {
          navigate("/dashboard/project");
        }, 1500);
      }
    } catch (error: unknown) {
      // ✅ FIXED TYPE (no 'any')
      if (error instanceof Error) {
        showToast(error.message, "error");
      } else {
        showToast("Error creating project", "error");
      }
    }
  };

  /* =========================================================
     UI
     ========================================================= */
  return (
    <div className="form-container">
      {toast.show && (
        <div className={`toast-banner toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <h2>Create New Project</h2>

      <form onSubmit={handleSubmit}>
        {/* Project Name */}
        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            placeholder="Enter project name"
            value={formData.project_name}
            onChange={(e) =>
              setFormData({ ...formData, project_name: e.target.value })
            }
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Project details..."
            rows={4}
            value={formData.project_description}
            onChange={(e) =>
              setFormData({
                ...formData,
                project_description: e.target.value,
              })
            }
          />
        </div>

        {/* Services */}
        <div className="form-group">
          <label>Services *</label>

          <div className="services-grid">
            {AVAILABLE_SERVICES.map((service) => (
              <div
                key={service}
                className="checkbox-item"
                onClick={() => handleServiceChange(service)}
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  readOnly
                />
                <label>{service}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/dashboard/project")}
          >
            Cancel
          </button>

          <button type="submit" className="btn-submit">
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}