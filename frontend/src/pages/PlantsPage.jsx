import { useEffect, useState } from "react";
import API from "../api/api";
import PlantForm from "../forms/PlantForm";

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [showForm, setShowForm] = useState(false);

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
          <p>Manage all plants here...</p>
        </div>

        <button
          className="btn-add"
          onClick={() => setShowForm(true)}
        >
          + Create Plant
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
          </tr>
        </thead>

        <tbody>
          {plants.length === 0 && (
            <tr>
              <td colSpan="5">No plant found.</td>
            </tr>
          )}

          {plants.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.plantName}</td>
              <td>{p.plantCode}</td>
              <td>{p.plantLocation}</td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <PlantForm
          onClose={() => setShowForm(false)}
          onSaved={loadPlants}
        />
      )}

    </div>
  );
}
