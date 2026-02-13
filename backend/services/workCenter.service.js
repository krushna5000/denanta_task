import * as workCenterFactory from "../factory/workCenter.factory.js";

export const createWorkCenter = async (data) => {
  if (!data.plantId) throw new Error("plantId required");
  if (!data.depId) throw new Error("depId required");
  if (!data.costCenterId) throw new Error("costCenterId required");

  if (!data.workName || data.workName.trim() === "") {
    throw new Error("workName required");
  }

  const result = await workCenterFactory.createWorkCenter(data);
  return result[0];
};

export const getAllWorkCenters = async () => {
  return workCenterFactory.getWorkCenters();
};

export const getWorkCenterById = async (id) => {
  if (!id) throw new Error("WorkCenter ID required");
  return workCenterFactory.getWorkCenterById(id);
};

export const updateWorkCenter = async (id, data) => {
  const updated = await workCenterFactory.updateWorkCenter(id, data);
  return updated[0] || null;
};

export const deleteWorkCenter = async (id) => {
  return workCenterFactory.deleteWorkCenter(id);
};
