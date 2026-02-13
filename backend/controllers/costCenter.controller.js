import * as costCenterService from "../services/costCenter.service.js";

export const createCostCenter = async (req, res) => {
  try {
    const data = await costCenterService.createCostCenter(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllCostCenters = async (req, res) => {
  const data = await costCenterService.getAllCostCenters();
  res.json({ success: true, data });
};

export const getCostCenterById = async (req, res) => {
  const data = await costCenterService.getCostCenterById(
    Number(req.params.id)
  );

  if (!data) return res.status(404).json({ success: false });

  res.json({ success: true, data });
};

export const updateCostCenter = async (req, res) => {
  const data = await costCenterService.updateCostCenter(
    Number(req.params.id),
    req.body
  );

  res.json({ success: true, data });
};

export const deleteCostCenter = async (req, res) => {
  await costCenterService.deleteCostCenter(Number(req.params.id));
  res.json({ success: true });
};
