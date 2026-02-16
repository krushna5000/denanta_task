import db from "../db/db_connection.js";
import { plant } from "../db/schema.js";
import { eq, ilike, or, count } from "drizzle-orm";


export const getPlants = async (search, page = 1, limit = 6) => {
  const offset = (page - 1) * limit;
  
  let whereCondition = undefined;
  if (search) {
    whereCondition = or(
      ilike(plant.plantName, `%${search}%`),
      ilike(plant.plantCode, `%${search}%`)
    );
  }
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(plant).where(whereCondition);
  const totalCount = totalCountResult[0]?.count || 0;
  
  // Get paginated data
  const data = await db.query.plant.findMany({
    where: whereCondition,
    limit: limit,
    offset: offset,
    orderBy: (plant) => plant.id
  });
  
  return {
    data,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
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
