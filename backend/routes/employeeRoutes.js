
import express from "express";

import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getEmployees);
router.post("/", protect, adminOnly, addEmployee);
router.put("/:id", protect, adminOnly, updateEmployee);
router.delete("/:id", protect, adminOnly, deleteEmployee);

export default router;
