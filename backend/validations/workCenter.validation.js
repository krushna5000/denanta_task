export const validateWorkCenter = (req, res, next) => {
  const { plantId, depId, costCenterId, workName } = req.body;

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

  if (!costCenterId) {
    return res.status(400).json({
      success: false,
      message: "costCenterId required",
    });
  }

  if (!workName || workName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "workName required",
    });
  }

  next();
};
