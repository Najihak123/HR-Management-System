
import express from "express";

import {
  addSalary,
  getMySalary,
  getAllSalaries,
  updateSalaryStatus
} from "../controllers/salaryController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee route
router.get("/my", protect, getMySalary);

// Admin routes
router.post("/add", protect, adminOnly, addSalary);
router.get("/all", protect, adminOnly, getAllSalaries);
router.put("/:id", protect, adminOnly, updateSalaryStatus);

export default router;
