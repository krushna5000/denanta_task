import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/dashboard.css";

export default function WorkCenterForm({ onClose, onSaved, editData }) {

  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [errors, setErrors] = useState({});

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
    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.plantId) {
      newErrors.plantId = "Plant selection is required";
    }

    if (!form.depId) {
      newErrors.depId = "Department selection is required";
    }

    if (!form.costCenterId) {
      newErrors.costCenterId = "Cost Center selection is required";
    }

    if (!form.workName.trim()) {
      newErrors.workName = "Work Center Name is required";
    } else if (form.workName.trim().length < 2) {
      newErrors.workName = "Work Center Name must be at least 2 characters";
    }

    if (form.workCode && form.workCode.trim().length < 2) {
      newErrors.workCode = "Work Code must be at least 2 characters";
    } else if (form.workCode && !/^[A-Za-z0-9-_]+$/.test(form.workCode.trim())) {
      newErrors.workCode = "Work Code can only contain letters, numbers, hyphens and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  LOAD INITIAL DATA 

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

  //  API CALLS 

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

  //  HANDLERS 

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
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...form,
      plantId: Number(form.plantId),
      depId: Number(form.depId),
      costCenterId: Number(form.costCenterId),
    };

    try {
      if (isEdit) {
        await API.put(`/work-centers/${editData.id}`, payload);
        showSuccessMessage("Work Center updated successfully");
      } else {
        await API.post("/work-centers", payload);
        showSuccessMessage("Work Center created successfully");
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
      showErrorMessage("A work center with this code already exists");
    } else {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      showErrorMessage("Error saving work center: " + msg);
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
          <h2>{isEdit ? "Edit Work Center" : "Create Work Center"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* PLANT */}
        <div className="form-group">
          <label>Plant *</label>
          <select
            className={`form-input ${errors.plantId ? 'error' : ''}`}
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
          {errors.plantId && <span className="error-text">{errors.plantId}</span>}
        </div>

        {/* DEPARTMENT */}
        <div className="form-group">
          <label>Department *</label>
          <select
            className={`form-input ${errors.depId ? 'error' : ''}`}
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
          {errors.depId && <span className="error-text">{errors.depId}</span>}
        </div>

        {/* COST CENTER */}
        <div className="form-group">
          <label>Cost Center *</label>
          <select
            className={`form-input ${errors.costCenterId ? 'error' : ''}`}
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
          {errors.costCenterId && <span className="error-text">{errors.costCenterId}</span>}
        </div>

        {/* WORK CENTER NAME */}
        <div className="form-group">
          <label>Work Center Name *</label>
          <input
            className={`form-input ${errors.workName ? 'error' : ''}`}
            placeholder="Enter Work Center Name"
            value={form.workName}
            onChange={(e) => change("workName", e.target.value)}
          />
          {errors.workName && <span className="error-text">{errors.workName}</span>}
        </div>

        {/* WORK CODE */}
        <div className="form-group">
          <label>Work Code</label>
          <input
            className={`form-input ${errors.workCode ? 'error' : ''}`}
            placeholder="Enter Work Code"
            value={form.workCode}
            onChange={(e) => change("workCode", e.target.value)}
          />
          {errors.workCode && <span className="error-text">{errors.workCode}</span>}
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
