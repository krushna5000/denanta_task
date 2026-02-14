import { useEffect, useState } from "react";
import API from "../api/api";
import CostCenterForm from "../forms/CostCenterForm";

export default function CostCentersPage() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const load = async () => {
    const res = await API.get("/cost-centers");
    setRows(res.data.data || []);
  };

  const handleEdit = (costCenter) => {
    setEditData(costCenter);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cost center?")) {
      try {
        await API.delete(`/cost-centers/${id}`);
        load();
      } catch (error) {
        alert("Error deleting cost center: " + error.message);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>

      <div className="page-header">
        <div>
          <h2>Cost Center Management</h2>
        </div>

        <button className="btn-add" onClick={() => setShowForm(true)}>
           Create Cost Center
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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan="7">No cost centers found.</td>
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
              <td>
                <button className="btn-edit" onClick={() => handleEdit(c)} title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button className="btn-delete" onClick={() => handleDelete(c.id)} title="Delete"><i class="fa-solid fa-delete-left"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <CostCenterForm
          onClose={handleCloseForm}
          onSaved={load}
          editData={editData}
        />
      )}

    </div>
  );
}
