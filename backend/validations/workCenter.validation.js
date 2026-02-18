export const validateWorkCenter = (req, res, next) => {
  const { plantId, depId, costCenterId, workName, workCode } = req.body;
  const errors = [];

  // Validate plantId
  if (!plantId) {
    errors.push({ field: 'plantId', message: 'Plant selection is required' });
  } else if (isNaN(plantId) || parseInt(plantId) <= 0) {
    errors.push({ field: 'plantId', message: 'Invalid plant selection' });
  }

  // Validate depId
  if (!depId) {
    errors.push({ field: 'depId', message: 'Department selection is required' });
  } else if (isNaN(depId) || parseInt(depId) <= 0) {
    errors.push({ field: 'depId', message: 'Invalid department selection' });
  }

  // Validate costCenterId
  if (!costCenterId) {
    errors.push({ field: 'costCenterId', message: 'Cost Center selection is required' });
  } else if (isNaN(costCenterId) || parseInt(costCenterId) <= 0) {
    errors.push({ field: 'costCenterId', message: 'Invalid cost center selection' });
  }

  // Validate workName
  if (!workName || workName.trim() === "") {
    errors.push({ field: 'workName', message: 'Work Center Name is required' });
  } else if (workName.trim().length < 2) {
    errors.push({ field: 'workName', message: 'Work Center Name must be at least 2 characters' });
  }

  // Validate workCode (mandatory field)
  if (!workCode || workCode.trim() === "") {
    errors.push({ field: 'workCode', message: 'Work Center Code is required' });
  } else if (workCode.trim().length < 2) {
    errors.push({ field: 'workCode', message: 'Work Center Code must be at least 2 characters' });
  } else if (!/^[A-Za-z0-9-_]+$/.test(workCode.trim())) {
    errors.push({ field: 'workCode', message: 'Work Center Code can only contain letters, numbers, hyphens and underscores' });
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
