
import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    month: {
      type: String,
      required: true
    },
    basicSalary: {
      type: Number,
      required: true
    },
    allowance: {
      type: Number,
      default: 0
    },
    deduction: {
      type: Number,
      default: 0
    },
    netSalary: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
