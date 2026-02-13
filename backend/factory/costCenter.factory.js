import db from "../db/db_connection.js";
import { costCenter } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const getCostCenters = async () => {
  return db.query.costCenter.findMany({
    with: {
      plant: true,
      department: true,
      
    },
  });
};


export const getCostCenterById = async (id) => {
  return db.query.costCenter.findFirst({
    where: eq(costCenter.id, id),
    with: {
      plant: true,
      department: true,
    },
  });
};


export const createCostCenter = async (data) => {
  return db.insert(costCenter).values(data).returning();
};


export const updateCostCenter = async (id, data) => {
  return db
    .update(costCenter)
    .set(data)
    .where(eq(costCenter.id, id))
    .returning();
};


export const deleteCostCenter = async (id) => {
  return db.delete(costCenter).where(eq(costCenter.id, id));
};
