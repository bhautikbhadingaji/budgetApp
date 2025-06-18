import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';

import {createLeave,getLeaves,updateLeave,deleteLeave} from '../controllers/leaveController.js';
import { validate } from '../validators/validate.js';
import { leaveSchema } from '../validators/leaveValidator.js';
const router = express.Router();



router.get('/createLeave', authMiddleware, (req, res) => {
  res.render('leaveApplication',{ success: req.query.success,
    error: req.query.error, user: req.user }); 
});


router.post('/createLeave', authMiddleware, validate(leaveSchema),createLeave);



router.get('/getLeaves',authMiddleware, getLeaves);
router.put('/updateLeave/:id', validate(leaveSchema), authMiddleware, updateLeave);
router.delete('/deleteLeave/:id', authMiddleware, deleteLeave);

export default router;
