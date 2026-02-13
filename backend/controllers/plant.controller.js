import * as plantService from "../services/plant.service.js";

export const createPlant = async (req, res) => {
  try {
    const data = await plantService.createPlant(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllPlants = async (req, res) => {
  try {
    const data = await plantService.getAllPlants();
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

export const getPlantById = async (req, res) => {
  try {
    const data = await plantService.getPlantById(Number(req.params.id));
    if (!data) return res.status(404).json({ success: false });
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false });
  }
};

export const updatePlant = async (req, res) => {
  const data = await plantService.updatePlant(
    Number(req.params.id),
    req.body
  );
  res.json({ success: true, data });
};

export const deletePlant = async (req, res) => {
  await plantService.deletePlant(Number(req.params.id));
  res.json({ success: true });
};
