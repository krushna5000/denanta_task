export const validateDepartment = (req, res, next) => {
  const { plantId, depName, depCode } = req.body;
  const errors = [];

  // Validate plantId
  if (!plantId) {
    errors.push({ field: 'plantId', message: 'Plant selection is required' });
  } else if (isNaN(plantId) || parseInt(plantId) <= 0) {
    errors.push({ field: 'plantId', message: 'Invalid plant selection' });
  }

  // Validate depName
  if (!depName || depName.trim() === "") {
    errors.push({ field: 'depName', message: 'Department Name is required' });
  } else if (depName.trim().length < 2) {
    errors.push({ field: 'depName', message: 'Department Name must be at least 2 characters' });
  }

  // Validate depCode (optional field)
  if (depCode) {
    if (depCode.trim().length < 2) {
      errors.push({ field: 'depCode', message: 'Department Code must be at least 2 characters' });
    } else if (!/^[A-Za-z0-9-_]+$/.test(depCode.trim())) {
      errors.push({ field: 'depCode', message: 'Department Code can only contain letters, numbers, hyphens and underscores' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};
