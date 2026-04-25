import { useState } from "react";

export default function ProjectView() {
  const [projects] = useState([
    {
      id: 1,
      name: "E-commerce App",
      client: "John Doe",
      status: "Active",
      startDate: "2026-04-01",
      endDate: "2026-06-01",
    },
    {
      id: 2,
      name: "CRM System",
      client: "Sarah",
      status: "Pending",
      startDate: "2026-03-15",
      endDate: "2026-05-10",
    },
    {
      id: 3,
      name: "Mobile App",
      client: "Mike",
      status: "Completed",
      startDate: "2025-12-01",
      endDate: "2026-02-20",
    },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Project View</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.client}</td>
                <td>
                  <span
                    className={
                      project.status === "Active"
                        ? "status-active"
                        : project.status === "Completed"
                        ? "status-inactive"
                        : "status-pending"
                    }
                  >
                    {project.status}
                  </span>
                </td>
                <td>{project.startDate}</td>
                <td>{project.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}