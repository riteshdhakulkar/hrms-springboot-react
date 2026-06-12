import { useEffect, useState } from "react";
import { api } from "../api/api";
import "./EmployeeDashboard.css";
import { logout } from "../Pages/logout";

export default function EmployeeDashboard() {
const [employee, setEmployee] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [leaveType, setLeaveType] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [reason, setReason] = useState("");


const employeeId = localStorage.getItem("employeeId");


  const loadMySummary = async () => {
    try {
      const res = await api.get(
        `/attendance/summary/${employeeId}/2026/6`
      );
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
  try {
    const res = await api.get(`/attendance/employee/${employeeId}`);
    setHistory(res.data);
  } catch (err) {
    console.error(err);
  }
};

const loadEmployee = async () => {
  try {
    const res = await api.get(`/employee/${employeeId}`);
    setEmployee(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadMySummary();
  loadHistory();
  loadEmployee();
}, []);

  const checkIn = async () => {
    try {
      await api.post(`/attendance/checkin/${employeeId}`);

      alert("Checked In Successfully");

      loadMySummary();
      loadHistory();
    } catch (err) {
      console.error(err);
      alert("Check In Failed");
    }
  };

  const checkOut = async () => {
    try {
      await api.post(`/attendance/checkout/${employeeId}`);

      alert("Checked Out Successfully");

      loadMySummary();
      loadHistory();
    } catch (err) {
      console.error(err);
      alert("Check Out Failed");
    }
  };

const applyLeave = async () => {
  try {
    await api.post("/leave/apply", {
      employeeId: 1,
      employeeName: "Employee",
      leaveType,
      fromDate,
      toDate,
      reason,
    });

    alert("Leave Applied Successfully");

    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");
  } catch (err) {
    console.error(err);
    alert("Leave Apply Failed");
  }
};

  return (
    <div className="main">
      <div className="topbar">
        <h1>Employee Dashboard</h1> 
        <button onClick={logout}>
  Logout
</button>
      </div>

      {summary && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div className="summary-card">
              <h3>Present Days</h3>
              <h2>{summary.presentDays}</h2>
            </div>

            <div className="summary-card">
              <h3>Late Days</h3>
              <h2>{summary.lateDays}</h2>
            </div>

            <div className="summary-card">
              <h3>Total Hours</h3>
              <h2>{summary.totalWorkingHours}</h2>
            </div>
          </div>
<div className="panel">
  <h2>My Profile</h2>

  {employee ? (
    <div>
      <p><b>Name:</b> {employee.fname}</p>
      <p><b>Email:</b> {employee.email}</p>
      <p><b>Mobile:</b> {employee.mobile}</p>
      <p><b>Designation:</b> {employee.desig}</p>
      <p><b>Salary:</b> ₹{employee.sal}</p>
      <p><b>Blood Group:</b> {employee.bloodgrp}</p>
      <p><b>Gender:</b> {employee.gender}</p>
      <p><b>Employee ID:</b> {employee.id}</p>
    </div>
  ) : (
    <p>Loading profile...</p>
  )}
</div>

          <div className="panel">
            <h2>Attendance Actions</h2>

            <button onClick={checkIn}>
              Check In
            </button>

            <button
              onClick={checkOut}
              style={{ marginLeft: "10px" }}
            >
              Check Out
            </button>
          </div>

          <div className="panel">
            <h2>Monthly Summary</h2>

            <p>Present Days: {summary.presentDays}</p>
            <p>Late Days: {summary.lateDays}</p>
            <p>Total Hours: {summary.totalWorkingHours}</p>
          </div>
          <div className="panel">
  <h2>Apply Leave</h2>

  <input
    type="text"
    placeholder="Leave Type"
    value={leaveType}
    onChange={(e) => setLeaveType(e.target.value)}
  />

  <br /><br />

  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
  />

  <br /><br />

  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
  />

  <br /><br />

  <textarea
    placeholder="Reason"
    value={reason}
    onChange={(e) => setReason(e.target.value)}
  />

  <br /><br />

  <button onClick={applyLeave}>
    Apply Leave
  </button>
</div>

       <div className="panel">
  <h2>Attendance History</h2>

  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Status</th>
          <th>Hours</th>
        </tr>
      </thead>

      <tbody>
        {history.map((att) => (
          <tr key={att.id}>
            <td>{att.date}</td>
            <td>{att.checkIn || "-"}</td>
            <td>{att.checkOut || "-"}</td>
            <td>{att.status}</td>
            <td>{att.workingHours || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        </>
      )}
    </div>
  );
}