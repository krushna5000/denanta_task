
import { pgTable, serial, varchar, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Plant table
export const plant = pgTable('plant', {
  id: serial('id').primaryKey(),
  plantName: varchar('plant_name').notNull(),
  plantLocation: varchar('plant_location'),
  plantCode: varchar('plant_code').unique(),
  description: text('description'),
});

// Department table
export const department = pgTable('department', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').references(() => plant.id, { onDelete: 'cascade' }),
  depName: varchar('dep_name', { length: 255 }).notNull(),
  depCode: varchar('dep_code', { length: 255 }).unique(),
  depDescription: text('dep_description'),
});

// CostCenter table
export const costCenter = pgTable('cost_center', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').references(() => plant.id, { onDelete: 'cascade' }),
  depId: integer('dep_id').references(() => department.id, { onDelete: 'cascade' }),
  costCenterName: varchar('cost_center_name', { length: 255 }).notNull(),
  costCenterCode: varchar('cost_center_code', { length: 255 }).unique(),
  description: text('description'),
});

// WorkCenter table
export const workCenter = pgTable('work_center', {
  id: serial('id').primaryKey(),
  plantId: integer('plant_id').references(() => plant.id),
  depId: integer('dep_id').references(() => department.id),
  costCenterId: integer('cost_center_id').references(() => costCenter.id),
  workName: varchar('work_name', { length: 255 }).notNull(),
  workCode: varchar('work_code', { length: 255 }).unique(),
  workDescription: text('work_description'),
});

// Relations
export const plantRelations = relations(plant, ({ many }) => ({
  departments: many(department),
  costCenters: many(costCenter),
  workCenters: many(workCenter),
}));

export const departmentRelations = relations(department, ({ one, many }) => ({
  plant: one(plant, {
    fields: [department.plantId],
    references: [plant.id],
  }),
  costCenters: many(costCenter),
  workCenters: many(workCenter),
}));

export const costCenterRelations = relations(costCenter, ({ one, many }) => ({
  plant: one(plant, {
    fields: [costCenter.plantId],
    references: [plant.id],
  }),
  department: one(department, {
    fields: [costCenter.depId],
    references: [department.id],
  }),
  workCenters: many(workCenter),
}));

export const workCenterRelations = relations(workCenter, ({ one }) => ({
  plant: one(plant, {
    fields: [workCenter.plantId],
    references: [plant.id],
  }),
  department: one(department, {
    fields: [workCenter.depId],
    references: [department.id],
  }),
  costCenter: one(costCenter, {
    fields: [workCenter.costCenterId],
    references: [costCenter.id],
  }),
}));
