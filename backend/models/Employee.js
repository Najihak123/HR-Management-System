
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    department: {
      type: String
    },
    designation: {
      type: String
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee"
    },
    salary: {
      type: Number,
      default: 0
    },
    joiningDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

employeeSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
