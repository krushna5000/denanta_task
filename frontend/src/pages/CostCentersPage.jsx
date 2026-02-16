import { useEffect, useState } from "react";
import API from "../api/api";
import CostCenterForm from "../forms/CostCenterForm";

export default function CostCentersPage() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const load = async (search = "") => {
    const url = search ? `/cost-centers?search=${encodeURIComponent(search)}` : "/cost-centers";
    const res = await API.get(url);
    setRows(res.data.data || []);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    load(value);
  };

  const handleEdit = (costCenter) => {
    setEditData(costCenter);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cost center?")) {
      try {
        await API.delete(`/cost-centers/${id}`);
        showDeleteMessage("Cost Center deleted successfully");
        load();
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data?.error || error.message;
        alert("Error deleting cost center: " + msg);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  const showDeleteMessage = (message) => {
    const deleteDiv = document.createElement('div');
    deleteDiv.textContent = message;
    deleteDiv.className = 'delete-message';
    document.body.appendChild(deleteDiv);
    
    setTimeout(() => {
      deleteDiv.remove();
    }, 3000);
  };

  const showSuccessMessage = (message) => {
    const successDiv = document.createElement('div');
    successDiv.textContent = message;
    successDiv.className = 'success-message';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
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

      <input
        className="search-box"
        placeholder="Search by name or code..."
        value={searchTerm}
        onChange={handleSearch}
      />

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
