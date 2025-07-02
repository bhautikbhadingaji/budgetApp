import LeaveApplication from '../models/leaveApplication.js';

export const createLeave = async (req, res) => {
  try {
    const { fromDate, toDate, type, reason } = req.body;

    if (!req.user || !req.user.userId) {
      return res.redirect(`/leave/createLeave?error=${encodeURIComponent("Unauthorized: user info missing")}`);
    }

    const leave = new LeaveApplication({
      userId: req.user.userId,
      fromDate,
      toDate,
      leaveType: type,
      reason
    });

    await leave.save();
    res.redirect("/leave/createLeave?success=true");

  } catch (error) {
    console.error("Create Leave Error:", error);

    let errorMessage = 'Something went wrong';
    if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors[0];
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.redirect(`/leave/createLeave?error=${encodeURIComponent(errorMessage)}`);
  }
};


export const getLeaves = async (req, res) => {
  try {
    const leaves = req.user.role === 'admin'
      ? await LeaveApplication.find().populate('userId updatedBy')
      : await LeaveApplication.find({ userId: req.user.userId }).populate('updatedBy');

    res.render('leaveTable', { leaves, user: req.user, error: null, success: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;


    if (req.user.role === 'admin' && req.body.status) {
      await LeaveApplication.findByIdAndUpdate(id, {
        status: req.body.status,
        updatedBy: req.user.userId,
        updatedAt: new Date()
      });
      return res.redirect('/leave/createLeave?success=' + encodeURIComponent('Status updated successfully!'));
    }

 
    if (req.user.role !== 'admin') {
      const leave = await LeaveApplication.findById(id);
      if (!leave) {
        return res.redirect('/leave/createLeave?error=Leave not found');
      }

      if (leave.userId.toString() !== req.user.userId.toString()) {
        return res.redirect('/leave/createLeave?error=Permission denied');
      }

      const editDeadline = new Date(leave.fromDate);
      editDeadline.setDate(editDeadline.getDate() - 2);
      const now = new Date();
      if (now > editDeadline) {
        return res.redirect('/leave/createLeave?error=' + encodeURIComponent('Edit not allowed after deadline.'));
      }

      await LeaveApplication.findByIdAndUpdate(id, {
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        leaveType: req.body.type,
        reason: req.body.reason,
      });

      return res.redirect('/leave/createLeave?success=' + encodeURIComponent('Leave updated successfully!'));
    }

    res.redirect('/leave/createLeave?error=Invalid action');
  } catch (error) {
    console.error('Update Leave Error:', error);
    res.redirect('/leave/createLeave?error=Something went wrong');
  }
};


export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await LeaveApplication.findById(id);

    if (!leave) {
      return res.redirect('/leave/createLeave?error=Leave not found');
    }

    if (req.user.role !== 'admin' && leave.userId.toString() !== req.user.userId.toString()) {
      return res.redirect('/leave/createLeave?error=Permission denied');
    }

    await leave.deleteOne();
    res.redirect('/leave/createLeave');
  } catch (error) {
    console.error('Delete Leave Error:', error);
    res.redirect('/leave/createLeave?error=Something went wrong');
  }
};
