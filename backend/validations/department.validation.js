export const validateDepartment = (req, res, next) => {
  const { plantId, depName } = req.body;

  if (!plantId) {
    return res.status(400).json({
      success: false,
      message: "plantId required",
    });
  }

  if (!depName || depName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "depName required",
    });
  }
  next();
};
