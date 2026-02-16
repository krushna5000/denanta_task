import express from 'express';
import * as controller from '../controllers/plant.controller.js';

const router = express.Router();

router.post('/', controller.createPlant);
router.get('/', controller.getAllPlants);
router.get('/:id', controller.getPlantById);
router.put('/:id', controller.updatePlant);
router.delete('/:id', controller.deletePlant);

export default router;
