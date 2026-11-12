
import express from "express";

import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} from "../controllers/LeaveController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee routes
router.post("/apply", protect, applyLeave);
router.get("/my", protect, getMyLeaves);

// Admin routes
router.get("/all", protect, adminOnly, getAllLeaves);
router.put("/:id", protect, adminOnly, updateLeaveStatus);

export default router;
