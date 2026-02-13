import * as departmentService from "../services/department.service.js";

export const createDepartment = async (req, res) => {
  try {
    const data = await departmentService.createDepartment(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllDepartments = async (req, res) => {
  const data = await departmentService.getAllDepartments();
  res.json({ success: true, data });
};

export const getDepartmentById = async (req, res) => {
  const data = await departmentService.getDepartmentById(
    Number(req.params.id)
  );

  if (!data) return res.status(404).json({ success: false });

  res.json({ success: true, data });
};

export const updateDepartment = async (req, res) => {
  const data = await departmentService.updateDepartment(
    Number(req.params.id),
    req.body
  );

  res.json({ success: true, data });
};

export const deleteDepartment = async (req, res) => {
  await departmentService.deleteDepartment(Number(req.params.id));
  res.json({ success: true });
};
