import { useEffect, useState } from "react";
import API from "../api/api";

export default function WorkCenterForm({ onClose, onSaved }) {
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  const [form, setForm] = useState({
    plantId: "",
    depId: "",
    costCenterId: "",
    workName: "",
    workCode: "",
    workDescription: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    loadPlants();
    return () => (document.body.style.overflow = "auto");
  }, []);

  const change = (k, v) => setForm({ ...form, [k]: v });

  // -------- load data --------

  const loadPlants = async () => {
    const res = await API.get("/plants");
    setPlants(res.data.data || []);
  };

  const loadDepartments = async (plantId) => {
    const res = await API.get("/departments");
    const all = res.data.data || [];
    setDepartments(all.filter(d => d.plantId === Number(plantId)));
  };

  const loadCostCenters = async (depId) => {
    const res = await API.get("/cost-centers");
    const all = res.data.data || [];
    setCostCenters(all.filter(c => c.depId === Number(depId)));
  };

  // -------- handlers --------

  const onPlantChange = (v) => {
    change("plantId", v);
    change("depId", "");
    change("costCenterId", "");
    setCostCenters([]);
    loadDepartments(v);
  };

  const onDepChange = (v) => {
    change("depId", v);
    change("costCenterId", "");
    loadCostCenters(v);
  };

  const submit = async () => {
    if (!form.plantId) return alert("Select Plant");
    if (!form.depId) return alert("Select Department");
    if (!form.costCenterId) return alert("Select Cost Center");
    if (!form.workName.trim()) return alert("Work name required");

    await API.post("/work-centers", {
      ...form,
      plantId: Number(form.plantId),
      depId: Number(form.depId),
      costCenterId: Number(form.costCenterId),
    });

    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <div className="modal-header">
          <h2>Create Work Center</h2>
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
              <option key={p.id} value={p.id}>{p.plantName}</option>
            ))}
          </select>
        </div>

        {/* Department */}

        <div className="form-group">
          <label>Department *</label>
          <select
            className="form-input"
            value={form.depId}
            onChange={e => onDepChange(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.depName}</option>
            ))}
          </select>
        </div>

        {/* Cost Center */}

        <div className="form-group">
          <label>Cost Center *</label>
          <select
            className="form-input"
            value={form.costCenterId}
            onChange={e => change("costCenterId", e.target.value)}
          >
            <option value="">Select Cost Center</option>
            {costCenters.map(c => (
              <option key={c.id} value={c.id}>
                {c.costCenterName}
              </option>
            ))}
          </select>
        </div>

        {/* Fields */}

        <div className="form-group">
          <label>Work Center Name *</label>
          <input
            className="form-input"
            value={form.workName}
            onChange={e => change("workName", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Work Code</label>
          <input
            className="form-input"
            value={form.workCode}
            onChange={e => change("workCode", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            value={form.workDescription}
            onChange={e => change("workDescription", e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={submit}>
            Save Work Center
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
                                                                                               