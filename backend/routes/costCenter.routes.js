import express from "express";
import * as controller from "../controllers/costCenter.controller.js";
import { validateCostCenter } from "../validations/costCenter.validation.js";

const router = express.Router();

router.post("/", validateCostCenter, controller.createCostCenter);
router.get("/", controller.getAllCostCenters);
router.get("/:id", controller.getCostCenterById);
router.put("/:id", controller.updateCostCenter);
router.delete("/:id", controller.deleteCostCenter);

export default router;
