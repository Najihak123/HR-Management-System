
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Attendance.css";

const API_URL = "https://hr-management-system-yoed.onrender.com";

function Attendance() {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const employee = JSON.parse(localStorage.getItem("employee") || "{}");
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const fetchAttendance = async () => {
    try {
      const url =
        employee.role === "admin"
          ? `${API_URL}/api/attendance/all`
          : `${API_URL}/api/attendance/my`;

      const response = await axios.get(url, { headers });
      setRecords(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/api/attendance/checkin`,
        {},
        { headers }
      );

      setMessage(response.data.message);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/api/attendance/checkout`,
        {},
        { headers }
      );

      setMessage(response.data.message);
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <div className="container mt-4 attendance-page">

      <button
        className="btn attendance-back mb-3"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <h2>Attendance Management</h2>
      <p>Track employee attendance and working hours.</p>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {employee.role !== "admin" && (
        <div className="attendance-card mb-4">
          <h4>My Attendance</h4>
          <p>Mark your daily attendance below.</p>

          <div className="attendance-actions">
            <button
              className="btn checkin-btn"
              onClick={handleCheckIn}
            >
              ✓ Check In
            </button>

            <button
              className="btn checkout-btn"
              onClick={handleCheckOut}
            >
              ↗ Check Out
            </button>
          </div>
        </div>
      )}

      <div className="attendance-card">
        <h4>Attendance Records</h4>

        <div className="table-responsive">
          <table className="table attendance-table mt-3">
            <thead>
              <tr>
                {employee.role === "admin" && <th>Employee</th>}
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  {employee.role === "admin" && (
                    <td>{record.employee?.name || "Employee"}</td>
                  )}

                  <td>
                    {new Date(record.date).toLocaleDateString()}
                  </td>

                  <td>
                    {record.checkIn
                      ? new Date(record.checkIn).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>
                    {record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>
                    <span className="attendance-status">
                      {record.status || "Present"}
                    </span>
                  </td>
                </tr>
              ))}

              {records.length === 0 && (
                <tr>
                  <td
                    colSpan={employee.role === "admin" ? 5 : 4}
                    className="text-center"
                  >
                    No attendance records found
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

export default Attendance;
