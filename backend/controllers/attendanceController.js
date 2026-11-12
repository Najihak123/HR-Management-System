
import Attendance from "../models/Attendance.js";

// Employee Check In
export const checkIn = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const existing = await Attendance.findOne({
      employee: req.employee._id,
      date: { $gte: start, $lt: end }
    });

    if (existing) {
      return res.status(400).json({
        message: "Already checked in today"
      });
    }

    const attendance = await Attendance.create({
      employee: req.employee._id,
      checkIn: new Date()
    });

    res.status(201).json({
      message: "Check-in successful",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee Check Out
export const checkOut = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const attendance = await Attendance.findOne({
      employee: req.employee._id,
      date: { $gte: start, $lt: end }
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Please check in first"
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Already checked out"
      });
    }

    attendance.checkOut = new Date();
    await attendance.save();

    res.status(200).json({
      message: "Check-out successful",
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View My Attendance
export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      employee: req.employee._id
    }).sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin View All Attendance
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("employee", "name email department")
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
