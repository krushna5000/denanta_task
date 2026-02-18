import { useEffect, useState } from "react";
import API from "../api/api";
import CostCenterForm from "../forms/CostCenterForm";

export default function CostCentersPage() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [limit, setLimit] = useState(6);

  const load = async (search = "", page = 1, rowsPerPage = 6) => {
    const url = search ? `/cost-centers?search=${encodeURIComponent(search)}&page=${page}&limit=${rowsPerPage}` : `/cost-centers?page=${page}&limit=${rowsPerPage}`;
    const res = await API.get(url);
    setRows(res.data.data || []);
    setPagination(res.data.pagination);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    load(value, 1, limit);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    load(searchTerm, page, limit);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
    load(searchTerm, 1, newLimit);
  };

  const handleEdit = async (costCenter) => {
    try {
      // Fetch fresh data by ID when editing
      const res = await API.get(`/cost-centers/${costCenter.id}`);
      setEditData(res.data.data);
      setShowForm(true);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert("Error loading cost center data: " + msg);
    }
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
        <div></div>
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
           Create Cost Center
        </button>
      </div>

      <input
        className="search-box"
        placeholder="Search Cost Center..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr>
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
            <option value={5}>5</option>
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
        <CostCenterForm
          onClose={handleCloseForm}
          onSaved={load}
          editData={editData}
        />
      )}

    </div>
  );
}
