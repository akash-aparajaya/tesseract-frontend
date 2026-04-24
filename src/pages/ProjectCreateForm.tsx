import React, { useState } from "react";
import { createProject } from "../services/projectApi";
import { useToast } from "../hooks/useToast";

const AVAILABLE_SERVICES = ["SMS", "EMAIL"];

export default function ProjectCreateForm({ setActivePage }: { setActivePage: (page: string) => void }) {
  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    isActive: true,
    services: [] as string[],
  });

  const { toast, showToast } = useToast();

  const handleServiceChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

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
        setTimeout(() => setActivePage("dashboard"), 1500); 
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Error creating project";
      showToast(msg, "error");
      // App does not navigate, so user stays to fix errors
    }
  };

  return (
    <div className="form-container">
      {toast.show && (
        <div className={`toast-banner toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name</label>
          <input 
            type="text" 
            placeholder="Enter project name"
            onChange={(e) => setFormData({...formData, project_name: e.target.value})}
            required 
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            placeholder="Project details..." 
            rows={4}
            onChange={(e) => setFormData({...formData, project_description: e.target.value})}
          />
        </div>

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
                  id={service}
                  checked={formData.services.includes(service)}
                  onChange={() => {}} // Controlled by parent div click
                />
                <label htmlFor={service}>{service}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => setActivePage("dashboard")}>
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