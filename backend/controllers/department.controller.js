import * as departmentService from "../services/department.service.js";

export const createDepartment = async (req, res) => {
  try {
    const data = await departmentService.createDepartment(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.message === "Department code already exists") {
      return res.status(409).json({ 
        success: false, 
        message: "Department code already exists" 
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    
    const result = await departmentService.getAllDepartments(search, pageNum, limitNum);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDepartmentById = async (req, res) => {
  const data = await departmentService.getDepartmentById(
    Number(req.params.id)
  );

  if (!data) return res.status(404).json({ success: false });

  res.json({ success: true, data });
};

export const updateDepartment = async (req, res) => {
  try {
    const data = await departmentService.updateDepartment(
      Number(req.params.id),
      req.body
    );
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === "Department code already exists") {
      return res.status(409).json({ 
        success: false, 
        message: "Department code already exists" 
      });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  await departmentService.deleteDepartment(Number(req.params.id));
  res.json({ success: true });
};

export const getDepartmentsByPlant = async (req, res) => {
  try {
    const { plantId } = req.query;
    if (!plantId) {
      return res.status(400).json({ success: false, message: "Plant ID is required" });
    }
    
    const data = await departmentService.getDepartmentsByPlant(Number(plantId));
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
