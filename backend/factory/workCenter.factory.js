import db from "../db/db_connection.js";
import { workCenter } from "../db/schema.js";
import { eq } from "drizzle-orm";


export const getWorkCenters = async () => {
  return db.query.workCenter.findMany({
    with: {
      plant: true,
      department: true,
      costCenter: true,
    },
  });
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
