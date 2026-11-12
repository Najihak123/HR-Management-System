
import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";

// Employee Registration
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      designation
    } = req.body;

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const employee = await Employee.create({
      name,
      email,
      password,
      phone,
      department,
      designation
    });

    res.status(201).json({
      message: "Employee registered successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await employee.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: employee._id,
        role: employee.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
