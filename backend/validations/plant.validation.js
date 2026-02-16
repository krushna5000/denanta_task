export const validatePlant = (req, res, next) => {
  const { plantName, plantCode } = req.body;
  const errors = [];

  if (!plantName || plantName.trim() === "") {
    errors.push({ field: 'plantName', message: 'Plant Name is required' });
  } else if (plantName.trim().length < 2) {
    errors.push({ field: 'plantName', message: 'Plant Name must be at least 2 characters' });
  }

  if (!plantCode || plantCode.trim() === "") {
    errors.push({ field: 'plantCode', message: 'Plant Code is required' });
  } else if (plantCode.trim().length < 2) {
    errors.push({ field: 'plantCode', message: 'Plant Code must be at least 2 characters' });
  } else if (!/^[A-Za-z0-9-_]+$/.test(plantCode.trim())) {
    errors.push({ field: 'plantCode', message: 'Plant Code can only contain letters, numbers, hyphens and underscores' });
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

