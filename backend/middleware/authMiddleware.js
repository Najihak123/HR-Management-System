
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

// Verify Login
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Please login."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const employee = await Employee.findById(decoded.id).select("-password");

    if (!employee) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.employee = employee;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// Admin Only
export const adminOnly = (req, res, next) => {
  if (req.employee && req.employee.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Admin access only"
  });
};
