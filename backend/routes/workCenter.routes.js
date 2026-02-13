import express from "express";
import * as controller from "../controllers/workCenter.controller.js";
import { validateWorkCenter } from "../validations/workCenter.validation.js";

const router = express.Router();

router.post("/", validateWorkCenter, controller.createWorkCenter);
router.get("/", controller.getAllWorkCenters);
router.get("/:id", controller.getWorkCenterById);
router.put("/:id", controller.updateWorkCenter);
router.delete("/:id", controller.deleteWorkCenter);

export default router;
