import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/useToast";

export default function ProjectBasicEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast, ToastContainer } = useToast();
    const project = location.state?.project;

    const [formData, setFormData] = useState({
        project_name: "",
        project_description: "",
        services: [] as string[],
    });

    useEffect(() => {
        if (!project) {
            showToast("Project data not found. Redirecting...", "error");
            setTimeout(() => navigate("/dashboard/project"), 1500);
            return;
        }
        setFormData({
            project_name: project.name,
            project_description: project.description || "",
            services: project.services.map((s: string) => s.toUpperCase()),
        });
    }, [project, navigate, showToast]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.services.length === 0) {
            showToast("Please select at least one service", "error");
            return;
        }
        const payload = {
            project_name: formData.project_name,
            project_description: formData.project_description,
            services: formData.services,
        };
        try {
            // Replace with your API call
            console.log("Updating project:", payload);
            showToast("Project updated successfully!", "success");
            setTimeout(() => navigate("/dashboard/project"), 1500);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "Error updating project", "error");
        }
    };

    if (!project) return <div className="loading">Loading...</div>;

    return (
        <div className="form-container">
            <ToastContainer />
            <h2>Edit Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Project Name *</label>
                    <input
                        type="text"
                        value={formData.project_name}
                        onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        rows={3}
                        value={formData.project_description}
                        onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate("/dashboard/project")}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}