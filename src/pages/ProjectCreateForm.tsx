import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/projectApi";
import { useToast } from "../hooks/useToast";


export default function ProjectCreateForm() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();

  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    // ✅ Payload matches what your backend expects (same as the old modal)
    const payload = {
      project_name: formData.project_name,
      project_description: formData.project_description,
      isActive: true,

    };

    try {
      const res = await createProject(payload);
      if (res?.data?.success) {
        showToast("Project created successfully!", "success");
        setTimeout(() => navigate("/dashboard/project"), 1500);
      }
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : "Error creating project", "error");
    }
  };


  return (

    <div className="form-container">
      <ToastContainer />
      <h2>Create New Project</h2>

      <form onSubmit={handleSubmit}>
        {/* Project Name */}
        <div className="form-group">
          <label>Project Name *</label>
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