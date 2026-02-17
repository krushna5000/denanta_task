import { useEffect, useState } from "react";
import API from "../api/api";

export default function CostCenterForm({ onClose, onSaved, editData }) {
  const [plants, setPlants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [plantsLoaded, setPlantsLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    plantId: "",
    depId: "",
    costCenterName: "",
    costCenterCode: "",
    description: "",
  });

  const isEdit = !!editData;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const loadPlants = async () => {
    if (plantsLoaded) return; // Don't reload if already loaded
    
    try {
      const res = await API.get("/plants");
      setPlants(res.data.data || []);
      setPlantsLoaded(true);
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

  const handlePlantDropdownClick = () => {
    loadPlants(); // Load plants only when dropdown is clicked
  };

  const handlePlantChange = (plantId) => {
    change("plantId", plantId);
    change("depId", ""); // Clear department when plant changes
    setDepartments([]); // Clear departments list
    
    if (plantId) {
      loadDepartments(plantId); // Load departments for selected plant
    }
  };

  const handleDepartmentDropdownClick = () => {
    // Load departments for the selected plant when department dropdown is clicked
    if (form.plantId) {
      loadDepartments(form.plantId);
    }
  };

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
      // Don't load plants/departments automatically - wait for user to change
    }
  }, [editData]);

  const change = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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

    if (!form.costCenterName.trim()) {
      newErrors.costCenterName = "Cost Center Name is required";
    } else if (form.costCenterName.trim().length < 2) {
      newErrors.costCenterName = "Cost Center Name must be at least 2 characters";
    }

    if (form.costCenterCode && form.costCenterCode.trim().length < 2) {
      newErrors.costCenterCode = "Cost Center Code must be at least 2 characters";
    } else if (form.costCenterCode && !/^[A-Za-z0-9-_]+$/.test(form.costCenterCode.trim())) {
      newErrors.costCenterCode = "Cost Center Code can only contain letters, numbers, hyphens and underscores";
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
        console.log('Multiple field errors:', apiErrors.errors); // Debug log
        const fieldErrors = {};
        apiErrors.errors.forEach(err => {
          if (err.field && err.message) {
            fieldErrors[err.field] = err.message;
          }
        });
        setErrors(fieldErrors);
        // Show specific error message for each field
        const errorMessages = Object.values(fieldErrors).join(', ');
        showErrorMessage("Please fix the validation errors: " + errorMessages);
      }
    } else if (error.response?.status === 409) {
      showErrorMessage("A cost center with this code already exists");
    } else {
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      showErrorMessage("Error saving cost center: " + msg);
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
          <h2>{isEdit ? "Edit Cost Center" : "Create Cost Center"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Plant */}
        <div className="form-group">
          <label>Plant *</label>
          <select
            className={`form-input ${errors.plantId ? 'error' : ''}`}
            value={form.plantId}
            onChange={(e) => handlePlantChange(e.target.value)}
            onClick={handlePlantDropdownClick}
            onFocus={handlePlantDropdownClick}
          >
            <option value="">Select Plant</option>
            {/* Show current plant option in edit mode */}
            {isEdit && editData?.plant && (
              <option value={editData.plant.id}>
                {editData.plant.plantName}
              </option>
            )}
            {/* Show loaded plants when available */}
            {plants.map((p) => (
              <option key={p.id} value={p.id.toString()}>
                {p.plantName}
              </option>
            ))}
          </select>
          {errors.plantId && <span className="error-text">{errors.plantId}</span>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label>Department *</label>
          <select
            className={`form-input ${errors.depId ? 'error' : ''}`}
            value={form.depId}
            onChange={(e) => change("depId", e.target.value)}
            onClick={handleDepartmentDropdownClick}
            onFocus={handleDepartmentDropdownClick}
            disabled={!form.plantId}
          >
            <option value="">Select Department</option>
            {/* Show current department option in edit mode */}
            {isEdit && editData?.department && (
              <option value={editData.department.id}>
                {editData.department.depName}
              </option>
            )}
            {/* Show loaded departments when available */}
            {departments.map((d) => (
              <option key={d.id} value={d.id.toString()}>
                {d.depName}
              </option>
            ))}
          </select>
          {errors.depId && <span className="error-text">{errors.depId}</span>}
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Cost Center Name *</label>
          <input
            className={`form-input ${errors.costCenterName ? 'error' : ''}`}
            value={form.costCenterName}
            onChange={(e) => change("costCenterName", e.target.value)}
            placeholder="Enter Cost Center Name"
          />
          {errors.costCenterName && <span className="error-text">{errors.costCenterName}</span>}
        </div>

        {/* Code */}
        <div className="form-group">
          <label>Cost Center Code</label>
          <input
            className={`form-input ${errors.costCenterCode ? 'error' : ''}`}
            value={form.costCenterCode}
            onChange={(e) => change("costCenterCode", e.target.value)}
            placeholder="Enter Cost Center Code"
          />
          {errors.costCenterCode && <span className="error-text">{errors.costCenterCode}</span>}
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
