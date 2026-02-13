import db from "../db/db_connection.js";
import { department } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const getDepartments = async () => {
  return db.query.department.findMany({
    with: {
      plant: true,
    },
  });
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
