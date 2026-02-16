import db from "../db/db_connection.js";
import { workCenter } from "../db/schema.js";
import { eq, ilike, or, count } from "drizzle-orm";


export const getWorkCenters = async (search, page = 1, limit = 6) => {
  const offset = (page - 1) * limit;
  
  let whereCondition = undefined;
  if (search) {
    whereCondition = or(
      ilike(workCenter.workName, `%${search}%`),
      ilike(workCenter.workCode, `%${search}%`)
    );
  }
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(workCenter).where(whereCondition);
  const totalCount = totalCountResult[0]?.count || 0;
  
  // Get paginated data
  const data = await db.query.workCenter.findMany({
    where: whereCondition,
    with: {
      plant: true,
      department: true,
      costCenter: true,
    },
    limit: limit,
    offset: offset,
    orderBy: (workCenter) => workCenter.id
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


export const getWorkCenterById = async (id) => {
  return db.query.workCenter.findFirst({
    where: eq(workCenter.id, id),
    with: {
      plant: true,
      department: true,
      costCenter: true,
    },
  });
};
export const createWorkCenter = async (data) => {
  return db.insert(workCenter).values(data).returning();
};


export const updateWorkCenter = async (id, data) => {
  return db
    .update(workCenter)
    .set(data)
    .where(eq(workCenter.id, id))
    .returning();
};


export const deleteWorkCenter = async (id) => {
  return db.delete(workCenter).where(eq(workCenter.id, id));
};
