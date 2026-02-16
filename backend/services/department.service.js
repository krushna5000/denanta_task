import * as departmentFactory from "../factory/department.factory.js";

export const createDepartment = async (data) => {
  if (!data.plantId) throw new Error("plantId is required");
  if (!data.depName || data.depName.trim() === "") {
    throw new Error("depName is required");
  }

  const result = await departmentFactory.createDepartment(data);
  return result[0];
};

export const getAllDepartments = async (search, page, limit) => {
  return departmentFactory.getDepartments(search, page, limit);
};

export const getDepartmentById = async (id) => {
  if (!id) throw new Error("Department ID required");
  return departmentFactory.getDepartmentById(id);
};

export const updateDepartment = async (id, data) => {
  const updated = await departmentFactory.updateDepartment(id, data);
  return updated[0] || null;
};

export const deleteDepartment = async (id) => {
  return departmentFactory.deleteDepartment(id);
};

export const getDepartmentsByPlant = async (plantId) => {
  if (!plantId) throw new Error("Plant ID is required");
  return departmentFactory.getDepartmentsByPlant(plantId);
};
