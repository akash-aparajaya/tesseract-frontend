import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../services/projectApi";
import { useToast } from "../hooks/useToast";
import Skeleton from "../components/common/Skeleton";

/* =========================================================
   1. PROJECT TYPE
   ========================================================= */
interface Project {
  _id: string;
  project_name: string;
  project_description: string;
  services: string[];
  isActive: boolean;
  createdAt: Date | string;
}

/* =========================================================
   2. COMPONENT
   ========================================================= */
export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast, showToast } = useToast();
  const navigate = useNavigate();

  /* =========================================================
     3. FETCH PROJECTS
     ========================================================= */
  useEffect(() => {
    const fetchProjects = async () => {
      const startTime = Date.now();

      try {
        setLoading(true);

        const res = await getProjects();

        if (res?.data?.success) {
          setProjects(res.data.data);
        } else {
          showToast("Failed to fetch projects", "error");
        }
      } catch (error: unknown) {
        console.error("Dashboard Error:", error);

        if (error instanceof Error) {
          showToast(error.message, "error");
        } else {
          showToast("Server connection failed", "error");
        }
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = 1000 - elapsed;

        setTimeout(
          () => {
            setLoading(false);
          },
          remaining > 0 ? remaining : 0,
        );
      }
    };

    fetchProjects();
  }, [showToast]);

  /* =========================================================
     4. UI
     ========================================================= */
  return (
    <div className="dashboard-container">
      {/* ================= Toast ================= */}
      {toast.show && (
        <div className={`toast-banner toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* ================= Header ================= */}
      <header className="dashboard-header">
        <div className="header-text">
          <h1>Projects Control Center</h1>

          {loading ? (
            <Skeleton width={220} height={16} />
          ) : (
            <p>You have {projects.length} active projects in your pipeline.</p>
          )}
        </div>

        <button
          className="create-new-btn"
          onClick={() => navigate("/dashboard/project-create")}
        >
          + Create Project
        </button>
      </header>

      {/* ================= Loading ================= */}
      {loading && (
        <div className="project-card-grid">
          {" "}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="individual-card">
              {" "}
              {/* Top */}{" "}
              <div className="card-top">
                {" "}
                <Skeleton width={60} height={20} />{" "}
                <Skeleton width={80} height={14} />{" "}
              </div>{" "}
              {/* Title */}{" "}
              <Skeleton width="70%" height={20} style={{ marginTop: 10 }} />{" "}
              {/* Description */}{" "}
              <Skeleton width="100%" height={14} style={{ marginTop: 10 }} />{" "}
              <Skeleton width="90%" height={14} style={{ marginTop: 6 }} />{" "}
              {/* Tags */}{" "}
              <div className="tag-container" style={{ marginTop: 10 }}>
                {" "}
                <Skeleton width={60} height={20} />{" "}
                <Skeleton width={50} height={20} />{" "}
              </div>{" "}
              {/* Footer */}{" "}
              <div className="card-footer">
                {" "}
                <Skeleton width={80} height={14} />{" "}
                <Skeleton width={40} height={20} />{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}

      {/* ================= Empty ================= */}
      {!loading && projects.length === 0 && (
        <div className="empty-state">
          <h3>No Projects Found</h3>
          <p>Click "Create Project" to get started.</p>
        </div>
      )}

      {/* ================= REAL DATA ================= */}
      {!loading && projects.length > 0 && (
        <div className="project-card-grid">
          {projects.map((project) => (
            <div
              key={project._id}
              className="individual-card"
              onClick={() => navigate(`/dashboard/project-view/${project._id}`)}
              style={{ cursor: "pointer" }}
            >
              {/* Top */}
              <div className="card-top">
                <span
                  className={`status-pill ${
                    project.isActive ? "active" : "inactive"
                  }`}
                >
                  {project.isActive ? "Live" : "Down"}
                </span>
              </div>

              {/* Title */}
              <h2 className="card-title">{project.project_name}</h2>

              {/* Description */}
              <p className="card-description">{project.project_description}</p>

              {/* Services */}
              <div className="tag-container">
                {project.services?.map((service) => (
                  <span key={service} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="card-footer">
                <div className="date-info">
                  <small>Create Date</small>
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="action-group">
                  <button className="action-icon edit-icon">✎</button>
                  <button className="action-icon delete-icon">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
