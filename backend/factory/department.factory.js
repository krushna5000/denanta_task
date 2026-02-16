import db from "../db/db_connection.js";
import { department } from "../db/schema.js";
import { eq, ilike, or, count } from "drizzle-orm";


export const getDepartments = async (search, page = 1, limit = 6) => {
  const offset = (page - 1) * limit;
  
  let whereCondition = undefined;
  if (search) {
    whereCondition = or(
      ilike(department.depName, `%${search}%`),
      ilike(department.depCode, `%${search}%`)
    );
  }
  
  // Get total count for pagination
  const totalCountResult = await db.select({ count: count() }).from(department).where(whereCondition);
  const totalCount = totalCountResult[0]?.count || 0;
  
  // Get paginated data
  const data = await db.query.department.findMany({
    where: whereCondition,
    with: {
      plant: true,
    },
    limit: limit,
    offset: offset,
    orderBy: (department) => department.id
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


export const getDepartmentById = async (id) => {
  return db.query.department.findFirst({
    where: eq(department.id, id),
    with: {
      plant: true,
    },
  });
};


export const createDepartment = async (data) => {
  return db.insert(department).values(data).returning();
};


export const updateDepartment = async (id, data) => {
  return db
    .update(department)
    .set(data)
    .where(eq(department.id, id))
    .returning();
};


export const deleteDepartment = async (id) => {
  return db.delete(department).where(eq(department.id, id));
};

export const getDepartmentsByPlant = async (plantId) => {
  return db.query.department.findMany({
    where: eq(department.plantId, plantId),
    with: {
      plant: true,
    },
  });
};
