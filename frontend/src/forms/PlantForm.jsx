import { useState } from "react";
import API from "../api/api";
import { useEffect } from "react";


export default function PlantForm({ onClose, onSaved, editData }) {
  useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

  const [form, setForm] = useState({
    plantName: editData?.plantName || "",
    plantCode: editData?.plantCode || "",
    plantLocation: editData?.plantLocation || "",
    description: editData?.description || "",
  });

  const isEdit = !!editData;

  const change = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.plantName.trim()) {
      alert("Plant Name required");
      return;
    }

    if (isEdit) {
      await API.put(`/plants/${editData.id}`, form);
    } else {
      await API.post("/plants", form);
    }
    
    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          <h2>{isEdit ? "Edit Plant" : "Create Plant"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* FORM */}

        <div className="form-group">
          <label>Plant Name *</label>
          <input
            className="form-input"
            placeholder="Enter Plant Name"
            value={form.plantName}
            onChange={e => change("plantName", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Plant Code</label>
          <input
            className="form-input"
            placeholder="Enter Plant Code"
            value={form.plantCode}
            onChange={e => change("plantCode", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Plant Location</label>
          <input
            className="form-input"
            placeholder="Enter Plant Location"
            value={form.plantLocation}
            onChange={e => change("plantLocation", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            placeholder="Enter Description"
            value={form.description}
            onChange={e => change("description", e.target.value)}
          />
        </div>

        {/* ACTIONS */}

        <div className="form-actions">
          <button className="btn-primary" onClick={submit}>
            {isEdit ? "Update Plant" : "Save Plant"}
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
