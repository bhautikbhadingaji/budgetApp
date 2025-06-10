import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';

import {createLeave,getLeaves,updateLeave,deleteLeave} from '../controllers/leaveController.js';
import { validate } from '../validators/validate.js';
import { leaveSchema } from '../validators/leaveValidators.js';
const router = express.Router();

router.post('/createLeave', validate(leaveSchema), authMiddleware, createLeave);
router.get('/getLeaves',authMiddleware, getLeaves);
router.put('/updateLeave/:id', validate(leaveSchema), authMiddleware, updateLeave);
router.delete('/deleteLeave/:id', authMiddleware, deleteLeave);

export default router;
