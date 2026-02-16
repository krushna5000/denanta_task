import { useEffect, useState } from "react";
import API from "../api/api";

export default function DepartmentForm({ onClose, onSaved, editData }) {
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    plantId: editData?.plantId?.toString() || "",
    depName: editData?.depName || "",
    depCode: editData?.depCode || "",
    depDescription: editData?.depDescription || "",
  });

  const isEdit = !!editData;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    loadPlants();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (editData?.plantId) {
      loadDepartments(editData.plantId);
    }
  }, [editData]);

  const loadPlants = async () => {
    const res = await API.get("/plants");
    setPlants(res.data.data || []);
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

  const change = (k, v) => {
    setForm({ ...form, [k]: v });
    // Clear error for this field when user starts typing
    if (errors[k]) {
      setErrors({ ...errors, [k]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.plantId) {
      newErrors.plantId = "Plant selection is required";
    }

    if (!form.depName.trim()) {
      newErrors.depName = "Department Name is required";
    } else if (form.depName.trim().length < 2) {
      newErrors.depName = "Department Name must be at least 2 characters";
    }

    if (form.depCode && form.depCode.trim().length < 2) {
      newErrors.depCode = "Department Code must be at least 2 characters";
    } else if (form.depCode && !/^[A-Za-z0-9-_]+$/.test(form.depCode.trim())) {
      newErrors.depCode = "Department Code can only contain letters, numbers, hyphens and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...form,
      plantId: Number(form.plantId),
    };

    try {
      if (isEdit) {
        await API.put(`/departments/${editData.id}`, payload);
        showSuccessMessage("Department updated successfully");
      } else {
        await API.post("/departments", payload);
        showSuccessMessage("Department created successfully");
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
      showErrorMessage("A department with this code already exists");
    } else {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      showErrorMessage("Error saving department: " + msg);
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

        <div className="modal-header">
          <h2>{isEdit ? "Edit Department" : "Create Department"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Plant Dropdown */}

        <div className="form-group">
          <label>Plant *</label>
          <select
            className={`form-input ${errors.plantId ? 'error' : ''}`}
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
          {errors.plantId && <span className="error-text">{errors.plantId}</span>}
        </div>

        <div className="form-group">
          <label>Department Name *</label>
          <input
            className={`form-input ${errors.depName ? 'error' : ''}`}
            placeholder="Enter Department Name"
            value={form.depName}
            onChange={e => change("depName", e.target.value)}
          />
          {errors.depName && <span className="error-text">{errors.depName}</span>}
        </div>

        <div className="form-group">
          <label>Department Code</label>
          <input
            className={`form-input ${errors.depCode ? 'error' : ''}`}
            placeholder="Enter Department Code"
            value={form.depCode}
            onChange={e => change("depCode", e.target.value)}
          />
          {errors.depCode && <span className="error-text">{errors.depCode}</span>}
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
            {isEdit ? "Update Department" : "Save Department"}
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
