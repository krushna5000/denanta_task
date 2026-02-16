import { useEffect, useState } from "react";
import API from "../api/api";
import DepartmentForm from "../forms/DepartmentForm";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const loadDepartments = async (search = "") => {
    const url = search ? `/departments?search=${encodeURIComponent(search)}` : "/departments";
    const res = await API.get(url);
    setDepartments(res.data.data || []);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadDepartments(value);
  };

  const handleEdit = (department) => {
    setEditData(department);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await API.delete(`/departments/${id}`);
        showDeleteMessage("Department deleted successfully");
        loadDepartments();
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data?.error || error.message;
        alert("Error deleting department: " + msg);
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
    loadDepartments();
  }, []);

  return (
    <div>

      <div className="page-header">
        <div>
          <h2>Department Management</h2>
        </div>

        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
           Create Department
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
            <th>Department Name</th>
            <th>Code</th>
            <th>Plant</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.length === 0 && (
            <tr>
              <td colSpan="6">No departments found.</td>
            </tr>
          )}

          {departments.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.depName}</td>
              <td>{d.depCode}</td>
              <td>{d.plant?.plantName}</td>
              <td>{d.depDescription}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(d)} title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button className="btn-delete" onClick={() => handleDelete(d.id)} title="Delete"><i class="fa-solid fa-delete-left"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <DepartmentForm
          onClose={handleCloseForm}
          onSaved={loadDepartments}
          editData={editData}
        />
      )}

    </div>
  );
}
