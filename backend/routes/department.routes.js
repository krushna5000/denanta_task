import express from "express";
import * as controller from "../controllers/department.controller.js";
import { validateDepartment } from "../validations/department.validation.js";

const router = express.Router();

router.post("/", validateDepartment, controller.createDepartment);
router.get("/", controller.getAllDepartments);
router.get("/:id", controller.getDepartmentById);
router.put("/:id", controller.updateDepartment);
router.delete("/:id", controller.deleteDepartment);

export default router;
