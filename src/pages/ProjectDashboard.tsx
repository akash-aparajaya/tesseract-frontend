import { useEffect, useState } from "react";
import { getProjects } from "../services/projectApi";
import { useToast } from "../hooks/useToast";


// 1. Define an Interface for your Project data
interface Project {
  _id: string;
  project_name: string;
  project_description: string;
  services: string[];
  isActive: boolean;
  createdAt: Date| string;
}

export default function ProjectDashboard({ setActivePage }: { setActivePage: (page: string) => void }) {
  // 2. State for live data and loading
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  // 3. Fetch data on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await getProjects();
        
        // Adjust this based on your API response structure (e.g., res.data.data)
        if (res?.data?.success) {
          setProjects(res.data.data);
        } else {
          showToast("Failed to fetch projects", "error");
        }
      } catch (error: any) {
        console.error("Dashboard Error:", error);
        showToast(error.response?.data?.message || "Server connection failed", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showToast]);

  return (
    <div className="dashboard-container">
      {/* 4. Render Toast UI */}
      {toast.show && (
        <div className={`toast-banner toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <header className="dashboard-header">
        <div className="header-text">
          <h1>Projects Control Center</h1>
          <p>
            {loading 
              ? "Loading projects..." 
              : `You have ${projects.length} active projects in your pipeline.`}
          </p>
        </div>
        <button className="create-new-btn" onClick={() => setActivePage("project_creation")}>
          <span className="plus-icon">+</span> Create Project
        </button>
      </header>

      {/* 5. Handle Loading and Empty States */}
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Fetching data...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No Projects Found</h3>
          <p>Click "Create Project" to get started.</p>
        </div>
      ) : (
        <div className="project-card-grid">
          {/* 6. Map through REAL projects instead of MOCK */}
          {projects.map((project) => (
            <div key={project._id} className="individual-card">
              <div className="card-top">
                <span className={`status-pill ${project.isActive ? "active" : "inactive"}`}>
                  {project.isActive ? "Live" : "Down"}
                </span>
                <span className="client-name">Aparajayah</span>
              </div>

              <h2 className="card-title">{project.project_name}</h2>
              <p className="card-description">{project.project_description}</p>

              <div className="tag-container">
                {project.services?.map((service) => (
                  <span key={service} className="service-tag">{service}</span>
                ))}
              </div>

              <div className="card-footer">
                <div className="date-info">
                  <small>Create Date</small>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="action-group">
                  <button className="action-icon edit-icon" title="Edit">✎</button>
                  <button className="action-icon delete-icon" title="Delete">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}