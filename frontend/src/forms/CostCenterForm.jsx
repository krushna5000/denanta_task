import { useEffect, useState } from "react";
import API from "../api/api";

export default function CostCenterForm({ onClose, onSaved }) {
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    plantId: "",
    depId: "",
    costCenterName: "",
    costCenterCode: "",
    description: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    loadPlants();
    return () => (document.body.style.overflow = "auto");
  }, []);

  const loadPlants = async () => {
    const res = await API.get("/plants");
    setPlants(res.data.data || []);
  };

  const loadDepartments = async (plantId) => {
    const res = await API.get("/departments");
    const all = res.data.data || [];
    setDepartments(all.filter(d => d.plantId === Number(plantId)));
  };

  const change = (k, v) => setForm({ ...form, [k]: v });

  const onPlantChange = (v) => {
    change("plantId", v);
    change("depId", "");
    loadDepartments(v);
  };

  const submit = async () => {
    if (!form.plantId) return alert("Select Plant");
    if (!form.depId) return alert("Select Department");
    if (!form.costCenterName.trim()) return alert("Name required");

    await API.post("/cost-centers", {
      ...form,
      plantId: Number(form.plantId),
      depId: Number(form.depId),
    });

    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <div className="modal-header">
          <h2>Create Cost Center</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Plant */}

        <div className="form-group">
          <label>Plant *</label>
          <select
            className="form-input"
            value={form.plantId}
            onChange={e => onPlantChange(e.target.value)}
          >
            <option value="">Select Plant</option>
            {plants.map(p => (
              <option key={p.id} value={p.id}>
                {p.plantName}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}

        <div className="form-group">
          <label>Department *</label>
          <select
            className="form-input"
            value={form.depId}
            onChange={e => change("depId", e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.depName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cost Center Name *</label>
          <input
            className="form-input"
            placeholder="Enter Name"
            value={form.costCenterName}
            onChange={e => change("costCenterName", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Cost Center Code</label>
          <input
            className="form-input"
            placeholder="Enter Code"
            value={form.costCenterCode}
            onChange={e => change("costCenterCode", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={e => change("description", e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={submit}>
            Save Cost Center
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
