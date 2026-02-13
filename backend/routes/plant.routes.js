import express from "express";
import * as controller from "../controllers/plant.controller.js";
import { validatePlant } from "../validations/plant.validation.js";

const router = express.Router();

router.post("/", validatePlant, controller.createPlant);
router.get("/", controller.getAllPlants);
router.get("/:id", controller.getPlantById);
router.put("/:id", controller.updatePlant);
router.delete("/:id", controller.deletePlant);

export default router;
