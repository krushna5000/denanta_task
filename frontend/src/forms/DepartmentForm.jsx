import { useEffect, useState } from "react";
import API from "../api/api";

export default function DepartmentForm({ onClose, onSaved }) {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
    plantId: "",
    depName: "",
    depCode: "",
    depDescription: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    loadPlants();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const loadPlants = async () => {
    const res = await API.get("/plants");
    setPlants(res.data.data || []);
  };

  const change = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.plantId) return alert("Select Plant");
    if (!form.depName.trim()) return alert("Department Name required");

    await API.post("/departments", {
      ...form,
      plantId: Number(form.plantId),
    });

    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <div className="modal-header">
          <h2>Create Department</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Plant Dropdown */}

        <div className="form-group">
          <label>Plant *</label>
          <select
            className="form-input"
            value={form.plantId}
            onChange={e => change("plantId", e.target.value)}
          >
            <option value="">Select Plant</option>
            {plants.map(p => (
              <option key={p.id} value={p.id}>
                {p.plantName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Department Name *</label>
          <input
            className="form-input"
            placeholder="Enter Department Name"
            value={form.depName}
            onChange={e => change("depName", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Department Code</label>
          <input
            className="form-input"
            placeholder="Enter Department Code"
            value={form.depCode}
            onChange={e => change("depCode", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            placeholder="Enter Description"
            value={form.depDescription}
            onChange={e => change("depDescription", e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={submit}>
            Save Department
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
