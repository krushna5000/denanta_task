import * as costCenterFactory from "../factory/costCenter.factory.js";

export const createCostCenter = async (data) => {
  if (!data.plantId) throw new Error("plantId required");
  if (!data.depId) throw new Error("depId required");

  if (!data.costCenterName || data.costCenterName.trim() === "") {
    throw new Error("costCenterName required");
  }

  const result = await costCenterFactory.createCostCenter(data);
  return result[0];
};

export const getAllCostCenters = async (search) => {
  return costCenterFactory.getCostCenters(search);
};

export const getCostCenterById = async (id) => {
  if (!id) throw new Error("CostCenter ID required");
  return costCenterFactory.getCostCenterById(id);
};

export const updateCostCenter = async (id, data) => {
  const updated = await costCenterFactory.updateCostCenter(id, data);
  return updated[0] || null;
};

export const deleteCostCenter = async (id) => {
  return costCenterFactory.deleteCostCenter(id);
};

export const getCostCentersByPlant = async (plantId) => {
  if (!plantId) throw new Error("Plant ID is required");
  return costCenterFactory.getCostCentersByPlant(plantId);
};

export const getCostCentersByDepartment = async (depId) => {
  if (!depId) throw new Error("Department ID is required");
  return costCenterFactory.getCostCentersByDepartment(depId);
};
