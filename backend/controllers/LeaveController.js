
import Leave from "../models/Leave.js";

// Employee - Apply Leave
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    const leave = await Leave.create({
      employee: req.employee._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee - View My Leaves
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employee: req.employee._id
    }).sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - View All Leave Requests
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Approve or Reject Leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid leave status"
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    res.status(200).json({
      message: "Leave status updated successfully",
      leave
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
