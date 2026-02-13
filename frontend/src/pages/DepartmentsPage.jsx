import { useEffect, useState } from "react";
import API from "../api/api";
import DepartmentForm from "../forms/DepartmentForm";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const loadDepartments = async () => {
    const res = await API.get("/departments");
    setDepartments(res.data.data || []);
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <div>

      <div className="page-header">
        <div>
          <h2>Department Management</h2>
          <p>Manage all departments here...</p>
        </div>

        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Create Department
        </button>
      </div>

      <input
        className="search-box"
        placeholder="Search department..."
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Code</th>
            <th>Plant</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {departments.length === 0 && (
            <tr>
              <td colSpan="5">No departments found.</td>
            </tr>
          )}

          {departments.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.depName}</td>
              <td>{d.depCode}</td>
              <td>{d.plant?.plantName}</td>
              <td>{d.depDescription}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <DepartmentForm
          onClose={() => setShowForm(false)}
          onSaved={loadDepartments}
        />
      )}

    </div>
  );
}
