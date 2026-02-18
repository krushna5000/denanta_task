import { useEffect, useState } from "react";
import API from "../api/api";
import WorkCenterForm from "../forms/WorkCenterForm";

export default function WorkCentersPage() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [limit, setLimit] = useState(6);

  const load = async (search = "", page = 1, rowsPerPage = 6) => {
    const url = search ? `/work-centers?search=${encodeURIComponent(search)}&page=${page}&limit=${rowsPerPage}` : `/work-centers?page=${page}&limit=${rowsPerPage}`;
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

  const handleEdit = async (workCenter) => {
    try {
      // Fetch fresh data by ID when editing
      const res = await API.get(`/work-centers/${workCenter.id}`);
      setEditData(res.data.data);
      setShowForm(true);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert("Error loading work center data: " + msg);
    }
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
        <div></div>
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
           Create Work Center
        </button>
      </div>

      <input
        className="search-box"
        placeholder="Search Work Center..."
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
        <WorkCenterForm
          onClose={handleCloseForm}
          onSaved={load}
          editData={editData}
        />
      )}

    </div>
  );
}
