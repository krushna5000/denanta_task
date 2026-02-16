import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/dashboard.css";

export default function WorkCenterForm({ onClose, onSaved, editData }) {

  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [costCenters, setCostCenters] = useState([]);

  const [form, setForm] = useState({
    plantId: editData?.plantId?.toString() || "",
    depId: editData?.depId?.toString() || "",
    costCenterId: editData?.costCenterId?.toString() || "",
    workName: editData?.workName || "",
    workCode: editData?.workCode || "",
    workDescription: editData?.workDescription || "",
  });

  const isEdit = !!editData;

  const change = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // ================= LOAD INITIAL DATA =================

  useEffect(() => {
    document.body.style.overflow = "hidden";
    loadPlants();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // For Edit Mode Only
  useEffect(() => {
    if (editData) {
      if (editData.plantId) {
        loadDepartments(editData.plantId);
      }
      if (editData.depId) {
        loadCostCenters(editData.depId);
      }
    }
  }, [editData]);

  // ================= API CALLS =================

  const loadPlants = async () => {
    try {
      const res = await API.get("/plants");
      setPlants(res.data.data || []);
    } catch (err) {
      console.error("Error loading plants:", err);
      setPlants([]);
    }
  };

  const loadDepartments = async (plantId) => {
    try {
      const res = await API.get(`/departments/by-plant?plantId=${plantId}`);
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Error loading departments:", err);
      setDepartments([]);
    }
  };

  const loadCostCenters = async (depId) => {
    try {
      const res = await API.get(`/cost-centers/by-department?depId=${depId}`);
      setCostCenters(res.data.data || []);
    } catch (err) {
      console.error("Error loading cost centers:", err);
      setCostCenters([]);
    }
  };

  // ================= HANDLERS =================

  const onPlantChange = (value) => {
    change("plantId", value);
    change("depId", "");
    change("costCenterId", "");
    setDepartments([]);
    setCostCenters([]);

    if (value) {
      loadDepartments(value);
    }
  };

  const onDepChange = (value) => {
    change("depId", value);
    change("costCenterId", "");
    setCostCenters([]);

    if (value) {
      loadCostCenters(value);
    }
  };

  const submit = async () => {

    if (!form.plantId) return alert("Select Plant");
    if (!form.depId) return alert("Select Department");
    if (!form.costCenterId) return alert("Select Cost Center");
    if (!form.workName.trim()) return alert("Work name required");

    const payload = {
      ...form,
      plantId: Number(form.plantId),
      depId: Number(form.depId),
      costCenterId: Number(form.costCenterId),
    };

    try {
      if (isEdit) {
        await API.put(`/work-centers/${editData.id}`, payload);
      } else {
        await API.post("/work-centers", payload);
      }

      onSaved();
      onClose();

    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      alert("Error saving work center: " + errorMsg);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          <h2>{isEdit ? "Edit Work Center" : "Create Work Center"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* PLANT */}
        <div className="form-group">
          <label>Plant *</label>
          <select
            className="form-input"
            value={form.plantId}
            onChange={(e) => onPlantChange(e.target.value)}
          >
            <option value="">Select Plant</option>
            {plants.map(p => (
              <option key={p.id} value={p.id}>
                {p.plantName}
              </option>
            ))}
          </select>
        </div>

        {/* DEPARTMENT */}
        <div className="form-group">
          <label>Department *</label>
          <select
            className="form-input"
            value={form.depId}
            onChange={(e) => onDepChange(e.target.value)}
            disabled={!form.plantId}
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.depName}
              </option>
            ))}
          </select>
        </div>

        {/* COST CENTER */}
        <div className="form-group">
          <label>Cost Center *</label>
          <select
            className="form-input"
            value={form.costCenterId}
            onChange={(e) => change("costCenterId", e.target.value)}
            disabled={!form.depId}
          >
            <option value="">Select Cost Center</option>
            {costCenters.map(c => (
              <option key={c.id} value={c.id}>
                {c.costCenterName}
              </option>
            ))}
          </select>
        </div>

        {/* WORK CENTER NAME */}
        <div className="form-group">
          <label>Work Center Name *</label>
          <input
            className="form-input"
            placeholder="Enter Work Center Name"
            value={form.workName}
            onChange={(e) => change("workName", e.target.value)}
          />
        </div>

        {/* WORK CODE */}
        <div className="form-group">
          <label>Work Code</label>
          <input
            className="form-input"
            placeholder="Enter Work Code"
            value={form.workCode}
            onChange={(e) => change("workCode", e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            placeholder="Enter Description"
            value={form.workDescription}
            onChange={(e) => change("workDescription", e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button className="btn-primary" onClick={submit}>
            {isEdit ? "Update Work Center" : "Save Work Center"}
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
