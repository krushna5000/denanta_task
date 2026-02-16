import db from "../db/db_connection.js";
import { plant } from "../db/schema.js";
import { eq, ilike, or } from "drizzle-orm";


export const getPlants = async (search) => {
  if (!search) {
    return db.query.plant.findMany();
  }
  
  return db.query.plant.findMany({
    where: or(
      ilike(plant.plantName, `%${search}%`),
      ilike(plant.plantCode, `%${search}%`)
    )
  });
};


export const getPlantById = async (id) => {
  return db.query.plant.findFirst({
    where: eq(plant.id, id)
  });
};


export const createPlant = async (data) => {
  return db.insert(plant).values(data).returning();
};


export const updatePlant = async (id, data) => {
  return db
    .update(plant)
    .set(data)
    .where(eq(plant.id, id))
    .returning();
};


export const deletePlant = async (id) => {
  return db.delete(plant).where(eq(plant.id, id));
};
