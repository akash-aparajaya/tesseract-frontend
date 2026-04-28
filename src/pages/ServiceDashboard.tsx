import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "../styles/ServiceDashboard.css";

export default function ServiceDashboard() {
  // const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [errors, setErrors] = useState({ name: "" });

  const [services, setServices] = useState([
    { id: 1, name: "Web Development", description: "Full-stack web development services", status: "Active" },
    { id: 2, name: "App Development", description: "iOS & Android mobile apps", status: "Inactive" },
  ]);

  const handleStatusToggle = (id: number) => {
    setServices(services.map(service =>
      service.id === id
        ? { ...service, status: service.status === "Active" ? "Inactive" : "Active" }
        : service
    ));
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
    if (e.target.name === "name") setErrors({ ...errors, name: "" });
  };

  const handleCreateService = () => {
    if (!newService.name.trim()) {
      setErrors({ name: "Service name is required" });
      return;
    }
    const newId = services.length + 1;
    const newServiceObj = {
      id: newId,
      name: newService.name,
      description: newService.description || "No description provided",
      status: newService.status === "active" ? "Active" : "Inactive",
    };
    setServices([...services, newServiceObj]);
    setNewService({ name: "", description: "", status: "active" });
    setShowModal(false);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = services.filter(s => s.status === "Active").length;
  const inactiveCount = services.filter(s => s.status === "Inactive").length;

  return (
    <div className="service-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Service Dashboard</h1>
          <p className="subtitle">Manage and monitor all your services</p>
        </div>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          <span>+</span> Create Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{services.length}</div>
          <div className="stat-label">Total Services</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{inactiveCount}</div>
          <div className="stat-label">Inactive</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Services Table */}
      <div className="table-wrapper">
        <table className="services-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-row">
                  No services found. Click "Create Service" to add one.
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td className="service-name">{service.name}</td>
                  <td className="service-desc">{service.description}</td>
                  <td>
                    <span className={`status-badge ${service.status.toLowerCase()}`}>
                      {service.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="toggle-btn"
                      onClick={() => handleStatusToggle(service.id)}
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for creating service */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Service</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <p className="modal-sub">Add a new service to the system</p>
            <div className="form-group">
              <label>Service Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter service name"
                value={newService.name}
                onChange={handleModalChange}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Brief description of the service"
                value={newService.description}
                onChange={handleModalChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={newService.status} onChange={handleModalChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-create" onClick={handleCreateService}>Create Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}