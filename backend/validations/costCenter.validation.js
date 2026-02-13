export const validateCostCenter = (req, res, next) => {
  const { plantId, depId, costCenterName } = req.body;

  if (!plantId) {
    return res.status(400).json({
      success: false,
      message: "plantId required",
    });
  }

  if (!depId) {
    return res.status(400).json({
      success: false,
      message: "depId required",
    });
  }

  if (!costCenterName || costCenterName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "costCenterName required",
    });
  }

  next();
};
