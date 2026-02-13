import db from "../db/db_connection.js";
import { plant } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const getPlants = async () => {
  return db.query.plant.findMany();
};


export const getPlantById = async (id) => {
  return db.query.plant.findFirst();
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
