import { useEffect, useState } from "react";
import API from "../api/api";
import PlantForm from "../forms/PlantForm";

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await API.delete(`/plants/${id}`);
        showDeleteMessage("Plant deleted successfully");
        loadPlants();
      } catch (error) {
        const msg = error.response?.data?.message || error.response?.data?.error || error.message;
        alert("Error deleting plant: " + msg);
      }
    }
  };

  const handleEdit = async (plant) => {
    try {
      // Fetch fresh data by ID when editing
      const res = await API.get(`/plants/${plant.id}`);
      setEditData(res.data.data);
      setShowForm(true);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert("Error loading plant data: " + msg);
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

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [limit, setLimit] = useState(6);
  const [tablePage, setTablePage] = useState(1); // For table navigation

  const loadPlants = async (search = "", page = 1, rowsPerPage = 6) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", rowsPerPage);
    
    const url = `/plants?${params.toString()}`;
    const res = await API.get(url);
    setPlants(res.data.data || []);
    setPagination(res.data.pagination || null);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    setTablePage(1); // Reset table page when searching
    loadPlants(value, 1, limit);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadPlants(searchTerm, page, limit);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
    setTablePage(1); // Reset table page when changing limit
    loadPlants(searchTerm, 1, newLimit);
  };

  // Table navigation functions
  const handleTableNext = () => {
    const newTablePage = tablePage + 1;
    const startIndex = (newTablePage - 1) * limit;
    const endIndex = startIndex + limit;
    
    if (endIndex < plants.length) {
      setTablePage(newTablePage);
    }
  };

  const handleTablePrevious = () => {
    if (tablePage > 1) {
      const newTablePage = tablePage - 1;
      setTablePage(newTablePage);
    }
  };

  // Get current table data
  const getCurrentTableData = () => {
    const startIndex = (tablePage - 1) * limit;
    const endIndex = startIndex + limit;
    return plants.slice(startIndex, endIndex);
  };

  useEffect(() => {
    loadPlants();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div></div>
        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
           Add Plant
        </button>
      </div>

      <input
        className="search-box"
        placeholder="Search Plant..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <table>
        <thead>
          <tr>
            <th>Plant Name</th>
            <th>Plant Code</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {plants.length === 0 && (
            <tr>
              <td colSpan="5">No plant found.</td>
            </tr>
          )}

          {getCurrentTableData().map(p => (
            <tr key={p.id}>
              <td>{p.plantName}</td>
              <td>{p.plantCode}</td>
              <td>{p.plantLocation}</td>
              <td>{p.description}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(p)} title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button className="btn-delete" onClick={() => handleDelete(p.id)} title="Delete"><i class="fa-solid fa-calendar-xmark"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Navigation */}
      {plants.length > limit && (
        <div className="table-navigation">
          <button 
            className="table-nav-btn" 
            onClick={handleTablePrevious}
            disabled={tablePage === 1}
          >
            ← Previous
          </button>
          
          <span className="table-nav-info">
            Showing {((tablePage - 1) * limit) + 1}-{Math.min(tablePage * limit, plants.length)} of {plants.length}
          </span>
          
          <button 
            className="table-nav-btn" 
            onClick={handleTableNext}
            disabled={tablePage * limit >= plants.length}
          >
            Next →
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="pagination-info">
          <span>Rows per page:</span>
          <select 
            className="pagination-select" 
            value={limit} 
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
          >
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
        <PlantForm
          onClose={handleCloseForm}
          onSaved={loadPlants}
          editData={editData}
        />
      )}

    </div>
  );
}
