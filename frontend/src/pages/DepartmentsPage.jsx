import { useEffect, useState } from "react";
import API from "../api/api";
import DepartmentForm from "../forms/DepartmentForm";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const loadDepartments = async () => {
    const res = await API.get("/departments");
    setDepartments(res.data.data || []);
  };

  const handleEdit = (department) => {
    setEditData(department);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await API.delete(`/departments/${id}`);
        loadDepartments();
      } catch (error) {
        alert("Error deleting department: " + error.message);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
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
