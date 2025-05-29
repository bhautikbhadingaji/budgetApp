import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';

import {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave
} from '../controllers/leaveController.js';

const router = express.Router();

router.post('/createLeave', authMiddleware, createLeave);
router.get('/getLeaves',authMiddleware, getLeaves);
router.put('/updateLeave/:id', authMiddleware, updateLeave);
router.delete('/deleteLeave/:id', authMiddleware, deleteLeave);

export default router;
