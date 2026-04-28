import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProjectRequestLogs.css";

interface RequestLog {
  id: number;
  method: string;
  endpoint: string;
  timestamp: string;
  statusCode: number;
  responseTime: string;
}

// Mock logs per project ID
const logsData: Record<number, RequestLog[]> = {
  1: [
    { id: 1, method: "POST", endpoint: "/api/notify/sms", timestamp: "2025-04-28 10:23:15", statusCode: 200, responseTime: "124ms" },
    { id: 2, method: "GET", endpoint: "/api/health", timestamp: "2025-04-28 09:15:22", statusCode: 200, responseTime: "45ms" },
    { id: 3, method: "POST", endpoint: "/api/notify/email", timestamp: "2025-04-27 18:30:01", statusCode: 201, responseTime: "210ms" },
    { id: 4, method: "GET", endpoint: "/api/status", timestamp: "2025-04-27 12:00:00", statusCode: 200, responseTime: "32ms" },
    { id: 5, method: "POST", endpoint: "/api/notify/whatsapp", timestamp: "2025-04-26 22:15:30", statusCode: 500, responseTime: "340ms" },
  ],
  2: [
    { id: 1, method: "GET", endpoint: "/api/products", timestamp: "2025-04-28 11:20:30", statusCode: 200, responseTime: "340ms" },
    { id: 2, method: "POST", endpoint: "/api/order", timestamp: "2025-04-28 10:15:10", statusCode: 200, responseTime: "89ms" },
  ],
  3: [
    { id: 1, method: "POST", endpoint: "/api/employee", timestamp: "2025-04-28 09:45:00", statusCode: 200, responseTime: "156ms" },
  ],
  4: [
    { id: 1, method: "PUT", endpoint: "/api/ticket/42", timestamp: "2025-04-28 12:10:22", statusCode: 200, responseTime: "78ms" },
    { id: 2, method: "GET", endpoint: "/api/tickets", timestamp: "2025-04-28 11:30:11", statusCode: 200, responseTime: "112ms" },
  ],
  5: [
    { id: 1, method: "GET", endpoint: "/api/sales/daily", timestamp: "2025-04-28 07:00:00", statusCode: 200, responseTime: "210ms" },
    { id: 2, method: "POST", endpoint: "/api/refresh", timestamp: "2025-04-28 06:30:00", statusCode: 200, responseTime: "67ms" },
  ],
};

const projectNames: Record<number, string> = {
  1: "Notification System",
  2: "E-Commerce App",
  3: "HR Management System",
  4: "Support Tracker",
  5: "Sales Dashboard",
  6: "Inventory Manager",
  7: "Customer Portal",
  8: "Analytics Pipeline",
  9: "API Gateway",
};

export default function ProjectRequestLogs() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const id = Number(projectId);
  const allLogs = logsData[id] || [];
  const projectName = projectNames[id] || "Project";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter logs by endpoint or method
  const filteredLogs = allLogs.filter(log =>
    log.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.statusCode.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Stats
  const totalLogs = allLogs.length;
  const successCount = allLogs.filter(log => log.statusCode < 400).length;
  const errorCount = allLogs.filter(log => log.statusCode >= 400).length;

  return (
    <div className="logs-page">
      <div className="logs-header">
        <button className="back-btn" onClick={() => navigate("/dashboard/project")}>
          ← Back to Projects
        </button>
        <h1>Request Logs: {projectName}</h1>
        <p className="subtitle">Service request history for this project</p>
      </div>

      {/* Stats Cards */}
      <div className="logs-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-number">{totalLogs}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-number">{successCount}</div>
            <div className="stat-label">Successful</div>
          </div>
        </div>
        <div className="stat-card error">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <div className="stat-number">{errorCount}</div>
            <div className="stat-label">Errors</div>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by endpoint, method, or status code..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      <div className="table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Timestamp</th>
              <th>Status Code</th>
              <th>Response Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-row">No logs found.</td>
              </tr>
            ) : (
              paginatedLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>
                    <span className={`method-badge ${log.method.toLowerCase()}`}>
                      {log.method}
                    </span>
                  </td>
                  <td className="endpoint-cell">{log.endpoint}</td>
                  <td>{log.timestamp}</td>
                  <td>
                    <span className={`status-code ${log.statusCode >= 400 ? "error" : "success"}`}>
                      {log.statusCode}
                    </span>
                  </td>
                  <td>{log.responseTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredLogs.length > 0 && (
        <div className="pagination-container">
          <div className="rows-selector">
            <span>Rows per page:</span>
            <select value={rowsPerPage} onChange={handleRowsChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>← Previous</button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}