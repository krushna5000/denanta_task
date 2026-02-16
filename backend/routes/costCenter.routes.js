import express from 'express';
import * as controller from '../controllers/costCenter.controller.js';

const router = express.Router();

router.post('/', controller.createCostCenter);
router.get('/', controller.getAllCostCenters);
router.get('/:id', controller.getCostCenterById);
router.get('/by-plant', controller.getCostCentersByPlant);
router.get('/by-department', controller.getCostCentersByDepartment);
router.put('/:id', controller.updateCostCenter);
router.delete('/:id', controller.deleteCostCenter);

export default router;
