
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Salaries.css";

const API_URL = "https://hr-management-system-yoed.onrender.com";

function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    employee: "",
    basicSalary: "",
    allowance: "0",
    deduction: "0",
    month: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("employee") || "{}");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  const fetchSalaries = async () => {
    try {
      const url =
        user.role === "admin"
          ? `${API_URL}/api/salaries/all`
          : `${API_URL}/api/salaries/my`;

      const response = await axios.get(url, { headers });
      setSalaries(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load salaries");
    }
  };

  const fetchEmployees = async () => {
    if (user.role !== "admin") return;

    try {
      const response = await axios.get(
        `${API_URL}/api/employees`,
        { headers }
      );
      setEmployees(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load employees");
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const handleAddSalary = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/api/salaries/add`,
        {
          employee: form.employee,
          basicSalary: Number(form.basicSalary),
          allowance: Number(form.allowance || 0),
          deduction: Number(form.deduction || 0),
          month: form.month,
          paymentStatus: "Pending"
        },
        { headers }
      );

      setMessage(response.data.message || "Salary added successfully");

      setForm({
        employee: "",
        basicSalary: "",
        allowance: "0",
        deduction: "0",
        month: ""
      });

      await fetchSalaries();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add salary");
    }
  };

  const handlePayment = async (id, paymentStatus) => {
    try {
      setError("");
      setMessage("");

      const response = await axios.put(
        `${API_URL}/api/salaries/${id}`,
        { paymentStatus },
        { headers }
      );

      setMessage(response.data.message || "Payment status updated");
      await fetchSalaries();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update payment");
    }
  };

  return (
    <div className="container mt-4 salary-page">

      <button
        className="btn salary-back mb-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h2>Salary Management</h2>
      <p>Manage employee salary and payment records.</p>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {user.role === "admin" && (
        <div className="salary-card mb-4">
          <h4>Add Salary</h4>

          <form onSubmit={handleAddSalary}>
            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">Employee</label>
                <select
                  className="form-select"
                  value={form.employee}
                  onChange={(e) =>
                    setForm({ ...form, employee: e.target.value })
                  }
                  required
                >
                  <option value="">Select Employee</option>

                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Basic Salary (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={form.basicSalary}
                  onChange={(e) =>
                    setForm({ ...form, basicSalary: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Allowance (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={form.allowance}
                  onChange={(e) =>
                    setForm({ ...form, allowance: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Deduction (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={form.deduction}
                  onChange={(e) =>
                    setForm({ ...form, deduction: e.target.value })
                  }
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Month</label>
                <select
                  className="form-select"
                  value={form.month}
                  onChange={(e) =>
                    setForm({ ...form, month: e.target.value })
                  }
                  required
                >
                  <option value="">Select Month</option>

                  {[
                    "January", "February", "March", "April",
                    "May", "June", "July", "August",
                    "September", "October", "November", "December"
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <button className="btn salary-submit" type="submit">
              Add Salary
            </button>
          </form>
        </div>
      )}

      <div className="salary-card">
        <h4>
          {user.role === "admin"
            ? "All Salary Records"
            : "My Salary Records"}
        </h4>

        <div className="table-responsive">
          <table className="table salary-table mt-3">
            <thead>
              <tr>
                {user.role === "admin" && <th>Employee</th>}
                <th>Month</th>
                <th>Basic Salary</th>
                <th>Allowance</th>
                <th>Deduction</th>
                <th>Net Salary</th>
                <th>Payment Status</th>
                {user.role === "admin" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {salaries.map((salary) => (
                <tr key={salary._id}>
                  {user.role === "admin" && (
                    <td>{salary.employee?.name || "Employee"}</td>
                  )}

                  <td>{salary.month}</td>
                  <td>₹{salary.basicSalary}</td>
                  <td>₹{salary.allowance}</td>
                  <td>₹{salary.deduction}</td>
                  <td className="salary-net">
                    ₹{salary.netSalary}
                  </td>

                  <td>
                    <span
                      className={`salary-status ${
                        salary.paymentStatus === "Paid"
                          ? "paid"
                          : "pending"
                      }`}
                    >
                      {salary.paymentStatus}
                    </span>
                  </td>

                  {user.role === "admin" && (
                    <td>
                      {salary.paymentStatus !== "Paid" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handlePayment(salary._id, "Paid")
                          }
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {salaries.length === 0 && (
                <tr>
                  <td
                    colSpan={user.role === "admin" ? 8 : 7}
                    className="text-center"
                  >
                    No salary records found
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

export default Salaries;
