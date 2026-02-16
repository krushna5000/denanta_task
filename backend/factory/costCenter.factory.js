import db from "../db/db_connection.js";
import { costCenter } from "../db/schema.js";
import { eq, ilike, or, count } from "drizzle-orm";


export const getCostCenters = async (search, page = 1, limit = 6) => {
  const offset = (page - 1) * limit;
  
  let whereCondition = undefined;
  if (search) {
    whereCondition = or(
      ilike(costCenter.costCenterName, `%${search}%`),
      ilike(costCenter.costCenterCode, `%${search}%`)
    );
  }
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(costCenter).where(whereCondition);
  const totalCount = totalCountResult[0]?.count || 0;
  
  // Get paginated data
  const data = await db.query.costCenter.findMany({
    where: whereCondition,
    with: {
      plant: true,
      department: true,
    },
    limit: limit,
    offset: offset,
    orderBy: (costCenter) => costCenter.id
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
