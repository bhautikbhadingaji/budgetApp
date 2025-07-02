import express from 'express';
import { authMiddleware } from '../middleware/authmiddleware.js';

import {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave
} from '../controllers/leaveController.js';

import { validate } from '../validators/validate.js';
import { leaveSchema } from '../validators/leaveValidator.js';
import LeaveApplication from '../models/leaveApplication.js';
import methodOverride from 'method-override';

const router = express.Router();
router.use(methodOverride('_method'));


router.get('/', (req, res) => {
  res.redirect('/leave/createLeave');
});

router.get('/createLeave', authMiddleware, async (req, res) => {
  try {
    let leaves = [];

    if (req.user.role === 'admin') {
      leaves = await LeaveApplication.find()
        .populate('userId updatedBy')
        .sort({ fromDate: -1 });
    } else {
      leaves = await LeaveApplication.find({ userId: req.user.userId })
        .populate('updatedBy')
        .sort({ fromDate: -1 });
    }

    res.render('leaveApplication', {
      success: req.query.success,
      error: req.query.error,
      user: req.user,
      leaves,
    });
  } catch (error) {
    console.error('Error loading leaves:', error.message);
    res.render('leaveApplication', {
      success: null,
      error: 'Failed to load leaves',
      user: req.user,
      leaves: [],
    });
  }
});


router.post('/createLeave', authMiddleware, validate(leaveSchema), createLeave);
router.post('/getLeaves', authMiddleware, getLeaves);


router.put('/updateLeave/:id', authMiddleware, updateLeave);
router.get('/edit/:id', authMiddleware, async (req, res) => {
  try {
    const leave = await LeaveApplication.findById(req.params.id);

    if (!leave) {
      return res.redirect('/leave/createLeave?error=Leave not found');
    }

    if (req.user.role !== 'admin' && leave.userId.toString() !== req.user.userId.toString()) {
      return res.redirect('/leave/createLeave');
    }

    res.render('editLeaveForm', {
      user: req.user,
      leave,
      success: null,
      error: null
    });

  } catch (error) {
    res.redirect('/leave/createLeave');
  }
});

router.delete('/delete/:id', authMiddleware, deleteLeave);

export default router;
