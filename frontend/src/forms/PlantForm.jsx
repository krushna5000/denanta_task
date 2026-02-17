import { useState } from "react";
import API from "../api/api";
import { useEffect } from "react";


export default function PlantForm({ onClose, onSaved, editData }) {
  const [form, setForm] = useState({
    plantName: editData?.plantName || "",
    plantCode: editData?.plantCode || "",
    plantLocation: editData?.plantLocation || "",
    description: editData?.description || "",
  });

  const [errors, setErrors] = useState({});

  const isEdit = !!editData;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const change = (k, v) => {
    setForm({ ...form, [k]: v });
    // Clear error for this field when user starts typing
    if (errors[k]) {
      setErrors({ ...errors, [k]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.plantName.trim()) {
      newErrors.plantName = "Plant Name is required";
    } else if (form.plantName.trim().length < 2) {
      newErrors.plantName = "Plant Name must be at least 2 characters";
    }

    if (!form.plantCode.trim()) {
      newErrors.plantCode = "Plant Code is required";
    } else if (form.plantCode.trim().length < 2) {
      newErrors.plantCode = "Plant Code must be at least 2 characters";
    } else if (!/^[A-Za-z0-9-_]+$/.test(form.plantCode.trim())) {
      newErrors.plantCode = "Plant Code can only contain letters, numbers, hyphens and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit) {
        await API.put(`/plants/${editData.id}`, form);
        showSuccessMessage("Plant updated successfully");
      } else {
        await API.post("/plants", form);
        showSuccessMessage("Plant created successfully");
      }
      
      onSaved();
      onClose();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.response?.status === 400) {
      const apiErrors = error.response.data;
      
      if (typeof apiErrors === 'string') {
        // Single error message
        showErrorMessage(apiErrors);
      } else if (apiErrors.message) {
        // Error with message field
        showErrorMessage(apiErrors.message);
      } else if (apiErrors.errors && Array.isArray(apiErrors.errors)) {
        // Multiple field errors
        const fieldErrors = {};
        apiErrors.errors.forEach(err => {
          if (err.field && err.message) {
            fieldErrors[err.field] = err.message;
          }
        });
        setErrors(fieldErrors);
        showErrorMessage("Please fix the validation errors below");
      }
    } else if (error.response?.status === 409) {
      showErrorMessage("A plant with this code already exists");
    } else {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      showErrorMessage("Error saving plant: " + msg);
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

  const showErrorMessage = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.className = 'error-message';
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
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
            className={`form-input ${errors.plantName ? 'error' : ''}`}
            placeholder="Enter Plant Name"
            value={form.plantName}
            onChange={e => change("plantName", e.target.value)}
          />
          {errors.plantName && <span className="error-text">{errors.plantName}</span>}
        </div>

        <div className="form-group">
          <label>Plant Code *</label>
          <input
            className={`form-input ${errors.plantCode ? 'error' : ''}`}
            placeholder="Enter Plant Code"
            value={form.plantCode}
            onChange={e => change("plantCode", e.target.value)}
          />
          {errors.plantCode && <span className="error-text">{errors.plantCode}</span>}
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
