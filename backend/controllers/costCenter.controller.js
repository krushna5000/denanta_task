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
  try {
    const { search, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 4;
    
    const result = await costCenterService.getAllCostCenters(search, pageNum, limitNum);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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

export const getCostCentersByPlant = async (req, res) => {
  try {
    const { plantId } = req.query;
    if (!plantId) {
      return res.status(400).json({ success: false, message: "Plant ID is required" });
    }
    
    const data = await costCenterService.getCostCentersByPlant(Number(plantId));
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getCostCentersByDepartment = async (req, res) => {
  try {
    const { depId } = req.query;
    if (!depId) {
      return res.status(400).json({ success: false, message: "Department ID is required" });
    }
    
    const data = await costCenterService.getCostCentersByDepartment(Number(depId));
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
