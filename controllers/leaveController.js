
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
    console.error("Register Error:", error);

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
      : await LeaveApplication.find({ userId: req.user.id }).populate('updatedBy');
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: ' status will update only admin ' });
    }

    const leave = await LeaveApplication.findByIdAndUpdate(
      id,
      { status, updatedBy: req.user.id },
      { new: true }
    );

    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await LeaveApplication.findById(id);

    if (!leave) return res.status(404).json({ message: 'Leave dose not find' });

    if (req.user.role !== 'admin' && leave.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await leave.deleteOne();
    res.status(200).json({ message: 'Leave deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
