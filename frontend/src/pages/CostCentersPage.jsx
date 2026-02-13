import { useEffect, useState } from "react";
import API from "../api/api";
import CostCenterForm from "../forms/CostCenterForm";

export default function CostCentersPage() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await API.get("/cost-centers");
    setRows(res.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>

      <div className="page-header">
        <div>
          <h2>Cost Center Management</h2>
          <p>Manage all cost centers here...</p>
        </div>

        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Create Cost Center
        </button>
      </div>

      <input className="search-box" placeholder="Search cost center..." />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Plant</th>
            <th>Department</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan="6">No cost centers found.</td>
            </tr>
          )}

          {rows.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.costCenterName}</td>
              <td>{c.costCenterCode}</td>
              <td>{c.plant?.plantName}</td>
              <td>{c.department?.depName}</td>
              <td>{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <CostCenterForm
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}

    </div>
  );
}
