import { useEffect, useState } from "react";
import API from "../api/api";
import WorkCenterForm from "../forms/WorkCenterForm";

export default function WorkCentersPage() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const load = async (search = "") => {
    const url = search ? `/work-centers?search=${encodeURIComponent(search)}` : "/work-centers";
    const res = await API.get(url);
    setRows(res.data.data || []);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    load(value);
  };

  const handleEdit = (workCenter) => {
    setEditData(workCenter);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this work center?")) {
      try {
        await API.delete(`/work-centers/${id}`);
        showDeleteMessage("Work Center deleted successfully");
        load();
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data?.error || error.message;
        alert("Error deleting work center: " + msg);
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
          <h2>Work Center Management</h2>
        </div>

        <button className="btn-add" onClick={() => setShowForm(true)}>
           Create Work Center
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
            <th>Cost Center</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan="8">No work centers found.</td>
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
              <td>
                <button className="btn-edit" onClick={() => handleEdit(w)} title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button className="btn-delete" onClick={() => handleDelete(w.id)} title="Delete"><i class="fa-solid fa-delete-left"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <WorkCenterForm
          onClose={handleCloseForm}
          onSaved={load}
          editData={editData}
        />
      )}

    </div>
  );
}
