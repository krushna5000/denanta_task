import { useEffect, useState } from "react";
import API from "../api/api";
import WorkCenterForm from "../forms/WorkCenterForm";

export default function WorkCentersPage() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await API.get("/work-centers");
    setRows(res.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>

      <div className="page-header">
        <div>
          <h2>Work Center Management</h2>
          <p>Manage all work centers here...</p>
        </div>

        <button className="btn-add" onClick={() => setShowForm(true)}>
          + Create Work Center
        </button>
      </div>

      <input className="search-box" placeholder="Search work center..." />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Plant</th>
            <th>Department</th>
            <th>Cost Center</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan="7">No work centers found.</td>
            </tr>
          )}

          {rows.map(w => (
            <tr key={w.id}>
              <td>{w.id}</td>
              <td>{w.workName}</td>
              <td>{w.workCode}</td>
              <td>{w.plant?.plantName}</td>
              <td>{w.department?.depName}</td>
              <td>{w.costCenter?.costCenterName}</td>
              <td>{w.workDescription}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <WorkCenterForm
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}

    </div>
  );
}
