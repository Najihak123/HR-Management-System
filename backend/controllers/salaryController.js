
import Salary from "../models/Salary.js";

// Admin - Add Salary
export const addSalary = async (req, res) => {
  try {
    const {
      employee,
      month,
      basicSalary,
      allowance,
      deduction,
      paymentStatus
    } = req.body;

    const netSalary =
      Number(basicSalary) +
      Number(allowance || 0) -
      Number(deduction || 0);

    const salary = await Salary.create({
      employee,
      month,
      basicSalary,
      allowance,
      deduction,
      netSalary,
      paymentStatus
    });

    res.status(201).json({
      message: "Salary added successfully",
      salary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Employee - View My Salary
export const getMySalary = async (req, res) => {
  try {
    const salaries = await Salary.find({
      employee: req.employee._id
    }).sort({ createdAt: -1 });

    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - View All Salaries
export const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate("employee", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSalaryStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["Paid", "Pending"].includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status"
      });
    }

    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!salary) {
      return res.status(404).json({
        message: "Salary record not found"
      });
    }

    res.status(200).json({
      message: "Salary status updated successfully",
      salary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
