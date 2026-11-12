
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const emptyForm = {
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    designation: "",
    salary: ""
  };

  const [form, setForm] = useState(emptyForm);
  const token = localStorage.getItem("token");

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEmployees(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load employees"
      );
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        const { password, ...updatedData } = form;

        await axios.put(
          `http://localhost:5000/api/employees/${editingId}`,
          {
            ...updatedData,
            salary: Number(form.salary)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/employees",
          {
            ...form,
            salary: Number(form.salary)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || "Operation failed"
      );
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);

    setForm({
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this employee?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/employees/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete employee"
      );
    }
  };

  return (
    <div className="container mt-4 employee-page">

      <button
        className="btn employee-back mb-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h2>Employee Management</h2>
      <p>Add and manage your employees.</p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="employee-card mb-4">

        <h4>
          {editingId ? "Edit Employee" : "Add New Employee"}
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="row">

            {[
              ["name", "Full Name"],
              ["email", "Email Address"],
              ["password", "Password"],
              ["phone", "Phone Number"],
              ["department", "Department"],
              ["designation", "Designation"],
              ["salary", "Salary"]
            ].map(([name, label]) => (
              <div className="col-md-6 mb-3" key={name}>

                <label className="form-label">
                  {label}
                </label>

                <input
                  className="form-control"
                  type={
                    name === "password"
                      ? "password"
                      : name === "salary"
                      ? "number"
                      : "text"
                  }
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={
                    name === "password"
                      ? !editingId
                      : ["name", "email"].includes(name)
                  }
                  disabled={editingId && name === "password"}
                  placeholder={
                    editingId && name === "password"
                      ? "Password cannot be changed here"
                      : `Enter ${label}`
                  }
                />

              </div>
            ))}

          </div>

          <button
            className="btn btn-primary me-2"
            type="submit"
          >
            {editingId ? "Update Employee" : "Add Employee"}
          </button>

          {editingId && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      <div className="employee-card">

        <h4>Employee List</h4>

        <div className="table-responsive">

          <table className="table employee-table mt-3">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {employees.map((employee) => (
                <tr key={employee._id}>

                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.phone}</td>

                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Employees;
