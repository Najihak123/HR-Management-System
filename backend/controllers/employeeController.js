
import Employee from "../models/Employee.js";

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add employee
export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      department,
      designation,
      salary
    } = req.body;

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee already exists"
      });
    }

    const employee = await Employee.create({
      name,
      email,
      password,
      phone,
      department,
      designation,
      salary
    });

    res.status(201).json({
      message: "Employee added successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
