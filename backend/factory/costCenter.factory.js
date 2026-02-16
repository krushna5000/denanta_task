import db from "../db/db_connection.js";
import { costCenter } from "../db/schema.js";
import { eq, ilike, or } from "drizzle-orm";


export const getCostCenters = async (search) => {
  if (!search) {
    return db.query.costCenter.findMany({
      with: {
        plant: true,
        department: true,
      },
    });
  }
  
  return db.query.costCenter.findMany({
    where: or(
      ilike(costCenter.costCenterName, `%${search}%`),
      ilike(costCenter.costCenterCode, `%${search}%`)
    ),
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

export const getCostCentersByPlant = async (plantId) => {
  return db.query.costCenter.findMany({
    where: eq(costCenter.plantId, plantId),
    with: {
      plant: true,
      department: true,
    },
  });
};

export const getCostCentersByDepartment = async (depId) => {
  return db.query.costCenter.findMany({
    where: eq(costCenter.depId, depId),
    with: {
      plant: true,
      department: true,
    },
  });
};
