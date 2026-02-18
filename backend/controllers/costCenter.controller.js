import * as costCenterService from "../services/costCenter.service.js";

export const createCostCenter = async (req, res) => {
  try {
    const data = await costCenterService.createCostCenter(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Cost center creation error:', err);
    
    // Handle duplicate code error from factory layer
    if (err.message === "Cost Center code already exists") {
      return res.status(409).json({ 
        success: false, 
        message: "Cost Center code already exists" 
      });
    }
    
    // Handle specific database errors
    if (err.code === '23505') {
      // Unique constraint violation
      if (err.detail?.includes('cost_center_code')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cost center code already exists.' 
        });
      }
      if (err.detail?.includes('cost_center_name')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cost center name already exists.' 
        });
      }
    }
    
    // Handle foreign key constraint violations
    if (err.code === '23503') {
      if (err.detail?.includes('plant_id')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid plant ID. Please select a valid plant.' 
        });
      }
      if (err.detail?.includes('dep_id')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid department ID. Please select a valid department.' 
        });
      }
    }
    
    // Handle validation errors from service layer
    if (err.message?.includes('required')) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    // Generic error
    res.status(400).json({ 
      success: false, 
      message: 'Failed to create cost center. Please check your data and try again.' 
    });
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
  try {
    const data = await costCenterService.updateCostCenter(
      Number(req.params.id),
      req.body
    );
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === "Cost Center code already exists") {
      return res.status(409).json({ 
        success: false, 
        message: "Cost Center code already exists" 
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteCostCenter = async (req, res) => {
  try {
    await costCenterService.deleteCostCenter(Number(req.params.id));
    res.json({ success: true });
  } catch (err) {
    console.error('Cost center deletion error:', err);
    
    // Handle foreign key constraint violation
    if (err.code === '23503') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete cost center: It is referenced by other records.' 
      });
    }
    
    // Handle other database errors
    res.status(400).json({ 
      success: false, 
      message: 'Failed to delete cost center. Please try again.' 
    });
  }
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
