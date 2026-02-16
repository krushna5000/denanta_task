import express from 'express';
import * as controller from '../controllers/workCenter.controller.js';

const router = express.Router();

router.post('/', controller.createWorkCenter);
router.get('/', controller.getAllWorkCenters);
router.get('/:id', controller.getWorkCenterById);
router.put('/:id', controller.updateWorkCenter);
router.delete('/:id', controller.deleteWorkCenter);

export default router;
