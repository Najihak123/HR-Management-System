
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hr-management-system-yoed.onrender.com";

function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    leaveType: "Casual",
    fromDate: "",
    toDate: "",
    reason: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const employee = JSON.parse(
    localStorage.getItem("employee") || "{}"
  );
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchLeaves = async () => {
    try {
      setError("");
      const url =
        employee.role === "admin"
          ? `${API_URL}/api/leaves/all`
          : `${API_URL}/api/leaves/my`;

      const response = await axios.get(url, { headers });
      setLeaves(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load leaves"
      );
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/api/leaves/apply`,
        {
          leaveType: form.leaveType,
          startDate: form.fromDate,
          endDate: form.toDate,
          reason: form.reason
        },
        { headers }
      );

      setMessage(
        response.data.message || "Leave applied successfully"
      );

      setForm({
        leaveType: "Casual",
        fromDate: "",
        toDate: "",
        reason: ""
      });

      await fetchLeaves();
    } catch (err) {
      setError(
        err.response?.data?.message || "Leave application failed"
      );
    }
  };

  const handleStatus = async (id, status) => {
    try {
      setError("");
      setMessage("");

      const response = await axios.put(
        `${API_URL}/api/leaves/${id}`,
        { status },
        { headers }
      );

      setMessage(
        response.data.message || `Leave ${status} successfully`
      );

      await fetchLeaves();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update leave"
      );
    }
  };

  return (
    <div className="container mt-4">

      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h2>Leave Management</h2>
      <p>Apply for leave and manage leave requests.</p>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {employee.role !== "admin" && (
        <div className="card p-4 mb-4">
          <h4>Apply for Leave</h4>

          <form onSubmit={handleApply}>
            <div className="mb-3">
              <label>Leave Type</label>
              <select
                className="form-select"
                value={form.leaveType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    leaveType: e.target.value
                  })
                }
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Annual">Annual Leave</option>
              </select>
            </div>

            <div className="mb-3">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                value={form.fromDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fromDate: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>To Date</label>
              <input
                type="date"
                className="form-control"
                value={form.toDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    toDate: e.target.value
                  })
                }
                min={form.fromDate || undefined}
                required
              />
            </div>

            <div className="mb-3">
              <label>Reason</label>
              <textarea
                className="form-control"
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value
                  })
                }
                required
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Apply Leave
            </button>
          </form>
        </div>
      )}

      <div className="card p-4">
        <h4>
          {employee.role === "admin"
            ? "All Leave Requests"
            : "My Leave Requests"}
        </h4>

        <div className="table-responsive">
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                {employee.role === "admin" && <th>Employee</th>}
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                {employee.role === "admin" && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  {employee.role === "admin" && (
                    <td>
                      {leave.employee?.name || "Employee"}
                    </td>
                  )}

                  <td>{leave.leaveType}</td>

                  <td>
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>

                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>

                  {employee.role === "admin" && (
                    <td>
                      {leave.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              handleStatus(leave._id, "Approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              handleStatus(leave._id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {leaves.length === 0 && (
                <tr>
                  <td
                    colSpan={employee.role === "admin" ? 7 : 6}
                    className="text-center"
                  >
                    No leave requests found
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

export default Leaves;
