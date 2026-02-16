import * as workCenterService from "../services/workCenter.service.js";

export const createWorkCenter = async (req, res) => {
  try {
    const data = await workCenterService.createWorkCenter(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllWorkCenters = async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    
    const result = await workCenterService.getAllWorkCenters(search, pageNum, limitNum);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWorkCenterById = async (req, res) => {
  const data = await workCenterService.getWorkCenterById(
    Number(req.params.id)
  );

  if (!data) return res.status(404).json({ success: false });

  res.json({ success: true, data });
};

export const updateWorkCenter = async (req, res) => {
  const data = await workCenterService.updateWorkCenter(
    Number(req.params.id),
    req.body
  );

  res.json({ success: true, data });
};

export const deleteWorkCenter = async (req, res) => {
  await workCenterService.deleteWorkCenter(Number(req.params.id));
  res.json({ success: true });
};
