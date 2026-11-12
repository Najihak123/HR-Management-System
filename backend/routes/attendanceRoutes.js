
import express from "express";

import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance
} from "../controllers/attendanceController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee attendance
router.post("/checkin", protect, checkIn);
router.post("/checkout", protect, checkOut);
router.get("/my", protect, getMyAttendance);

// Admin attendance
router.get("/all", protect, adminOnly, getAllAttendance);

export default router;
