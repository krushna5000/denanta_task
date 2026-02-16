import { useEffect, useState } from "react";
import API from "../api/api";

export default function CostCenterForm({ onClose, onSaved, editData }) {
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    plantId: "",
    depId: "",
    costCenterName: "",
    costCenterCode: "",
    description: "",
  });

  const isEdit = !!editData;

  //  LOAD PLANTS 
  useEffect(() => {
    document.body.style.overflow = "hidden";
    loadPlants();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ================= SET EDIT DATA =================
  useEffect(() => {
    if (editData) {
      setForm({
        plantId: editData.plantId?.toString() || "",
        depId: editData.depId?.toString() || "",
        costCenterName: editData.costCenterName || "",
        costCenterCode: editData.costCenterCode || "",
        description: editData.description || "",
      });
    }
  }, [editData]);

  // ================= LOAD ALL DEPARTMENTS =================
  useEffect(() => {
    loadAllDepartments();
  }, []);

  const loadPlants = async () => {
    try {
      const res = await API.get("/plants");
      setPlants(res.data.data || []);
    } catch (err) {
      console.error("Error loading plants:", err);
    }
  };

  const loadAllDepartments = async () => {
    try {
      const res = await API.get("/departments");
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error("Error loading departments:", err);
      setDepartments([]);
    }
  };

  const change = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async () => {
    if (!form.plantId) return alert("Select Plant");
    if (!form.depId) return alert("Select Department");
    if (!form.costCenterName.trim()) return alert("Name required");

    const payload = {
      ...form,
      plantId: Number(form.plantId),
      depId: Number(form.depId),
    };

    try {
      if (isEdit) {
        await API.put(`/cost-centers/${editData.id}`, payload);
        showSuccessMessage("Cost Center updated successfully");
      } else {
        await API.post("/cost-centers", payload);
        showSuccessMessage("Cost Center created successfully");
      }

      onSaved();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      alert("Error saving cost center: " + msg);
    }
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

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Cost Center" : "Create Cost Center"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Plant */}
        <div className="form-group">
          <label>Plant *</label>
          <select
            className="form-input"
            value={form.plantId}
            onChange={(e) => change("plantId", e.target.value)}
          >
            <option value="">Select Plant</option>
            {plants.map((p) => (
              <option key={p.id} value={p.id.toString()}>
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
            onChange={(e) => change("depId", e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id.toString()}>
                {d.depName} {d.plant ? `(${d.plant.plantName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Cost Center Name *</label>
          <input
            className="form-input"
            value={form.costCenterName}
            onChange={(e) => change("costCenterName", e.target.value)}
          />
        </div>

        {/* Code */}
        <div className="form-group">
          <label>Cost Center Code</label>
          <input
            className="form-input"
            value={form.costCenterCode}
            onChange={(e) => change("costCenterCode", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={submit}>
            {isEdit ? "Update Cost Center" : "Save Cost Center"}
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
