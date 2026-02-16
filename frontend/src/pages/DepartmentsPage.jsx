import { useEffect, useState } from "react";
import API from "../api/api";
import DepartmentForm from "../forms/DepartmentForm";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [limit, setLimit] = useState(6);

  const loadDepartments = async (search = "", page = 1, rowsPerPage = 6) => {
    const url = search ? `/departments?search=${encodeURIComponent(search)}&page=${page}&limit=${rowsPerPage}` : `/departments?page=${page}&limit=${rowsPerPage}`;
    const res = await API.get(url);
    setDepartments(res.data.data || []);
    setPagination(res.data.pagination);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    loadDepartments(value, 1, limit);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadDepartments(searchTerm, page, limit);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
    loadDepartments(searchTerm, 1, newLimit);
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
        <div></div>
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
           Create Department
        </button>
      </div>

      <input
        className="search-box"
        placeholder="Search Department..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr>
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

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="pagination-info">
          <span>Rows per page:</span>
          <select 
            className="pagination-select" 
            value={limit} 
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {currentPage} of {pagination.totalPages} ({pagination.total} total)
            </span>
            
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

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
