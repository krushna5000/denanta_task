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

  const handleEdit = (plant) => {
    setEditData(plant);
    setShowForm(true);
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

  const loadPlants = async (search = "") => {
    const url = search ? `/plants?search=${encodeURIComponent(search)}` : "/plants";
    const res = await API.get(url);
    setPlants(res.data.data || []);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadPlants(value);
  };

  useEffect(() => {
    loadPlants();
  }, []);

  return (
    <div>

      <div className="page-header">
        <div>
          <h2>Plant Management</h2>
        </div>

        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
           Add Plant
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
              <td colSpan="6">No plant found.</td>
            </tr>
          )}

          {plants.map(p => (
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
