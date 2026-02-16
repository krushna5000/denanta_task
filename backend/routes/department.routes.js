import express from 'express';
import * as controller from '../controllers/department.controller.js';

const router = express.Router();

router.post('/', controller.createDepartment);
router.get('/', controller.getAllDepartments);
router.get('/:id', controller.getDepartmentById);
router.get('/by-plant', controller.getDepartmentsByPlant);
router.put('/:id', controller.updateDepartment);
router.delete('/:id', controller.deleteDepartment);

export default router;
