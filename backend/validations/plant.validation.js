export const validatePlant = (req, res, next) => {
  if (!req.body.plantName || req.body.plantName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "plantName required",
    });
  }
  next();
};
