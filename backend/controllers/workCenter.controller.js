import * as workCenterService from "../services/workCenter.service.js";

export const createWorkCenter = async (req, res) => {
  try {
    const data = await workCenterService.createWorkCenter(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.error('Work center creation error:', err);
    
    // Handle specific database errors
    if (err.code === '23505') {
      // Unique constraint violation
      if (err.detail?.includes('work_center_code')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Work center code already exists.' 
        });
      }
      if (err.detail?.includes('work_center_name')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Work center name already exists.' 
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
      message: 'Word center code Allready exist.' 
    });
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
  try {
    await workCenterService.deleteWorkCenter(Number(req.params.id));
    res.json({ success: true });
  } catch (err) {
    console.error('Work center deletion error:', err);
    
    // Handle foreign key constraint violation
    if (err.code === '23503') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete work center: It is referenced by other records.' 
      });
    }
    
    // Handle other database errors
    res.status(400).json({ 
      success: false, 
      message: 'Failed to delete work center. Please try again.' 
    });
  }
};
