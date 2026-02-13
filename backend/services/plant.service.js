import * as plantFactory from "../factory/plant.factory.js";

export const createPlant = async (data) => {
  if (!data.plantName || data.plantName.trim() === "") {
    throw new Error("plantName is required");
  }

  const result = await plantFactory.createPlant(data);
  return result[0];
};

export const getAllPlants = async () => {
  return plantFactory.getPlants();
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
