import { useEffect, useState } from "react";
import API from "../api/api";
import PlantForm from "../forms/PlantForm";

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (plant) => {
    setEditData(plant);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await API.delete(`/plants/${id}`);
        loadPlants();
      } catch (error) {
        alert("Error deleting plant: " + error.message);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  const loadPlants = async () => {
    const res = await API.get("/plants");
    setPlants(res.data.data || []);
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
        placeholder="Search by name, code, location..."
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
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
              <td>{p.id}</td>
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
