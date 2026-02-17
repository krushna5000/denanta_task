import * as plantFactory from "../factory/plant.factory.js";

export const createPlant = async (data) => {
  // Validate required fields
  if (!data.plantName || data.plantName.trim() === "") {
    throw new Error("Plant name is required");
  }
  
  if (!data.plantCode || data.plantCode.trim() === "") {
    throw new Error("Plant code is required");
  }
  
  // Validate plant code format (optional: alphanumeric, spaces, hyphens)
  if (data.plantCode && !/^[a-zA-Z0-9\s-]*$/.test(data.plantCode)) {
    throw new Error("Plant code can only contain letters, numbers, spaces, and hyphens");
  }

  const result = await plantFactory.createPlant(data);
  return result[0];
};

export const getAllPlants = async (search, page, limit) => {
  return plantFactory.getPlants(search, page, limit);
};

export const getPlantById = async (id) => {
  if (!id) throw new Error("Plant ID required");
  return plantFactory.getPlantById(id);
};

export const updatePlant = async (id, data) => {
  const updated = await plantFactory.updatePlant(id, data);
  return updated[0] || null;
};

export const deletePlant = async (id) => {
  return plantFactory.deletePlant(id);
};
