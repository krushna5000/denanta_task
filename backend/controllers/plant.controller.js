import * as plantService from "../services/plant.service.js";

export const createPlant = async (req, res) => {
  try {
    const data = await plantService.createPlant(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Plant creation error:', err);
    
    // Handle specific database errors
    if (err.code === '23505') {
      // Unique constraint violation
      if (err.detail?.includes('plant_code')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Plant code already exists.' 
        });
      }
      if (err.detail?.includes('plant_name')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Plant name already exists.' 
        });
      }
    }
    
    // Handle validation errors
    if (err.message?.includes('is required')) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    // Generic error
    res.status(400).json({ 
      success: false, 
      message: 'Plant Allready exist' 
    });
  }
};

export const getAllPlants = async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 4;
    
    const result = await plantService.getAllPlants(search, pageNum, limitNum);
    res.json({ success: true, ...result });
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
