import { useNavigate } from "react-router-dom";

export default function ServiceDashboard() {
  const navigate = useNavigate();

  const services = [
    { id: 1, name: "Web Development", status: "Active" },
    { id: 2, name: "App Development", status: "Inactive" },
  ];

  return (
    <div className="page-container">

      <div className="page-header">
        <h2>Service Dashboard</h2>

        <button
          className="btn-primary"
          onClick={() => navigate("/dashboard/service-create")}
        >
          + Create Service
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>
                  <span
                    className={
                      s.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}