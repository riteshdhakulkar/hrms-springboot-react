import { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeDashboard.css";
import { logout } from "../Pages/logout";

export default function EmployeeDashboard() {

  const API = "https://hrms-springbootems-backend.onrender.com/api";

  const [employee, setEmployee] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);

  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const employeeId = localStorage.getItem("employeeId");

  // ===== LOAD SUMMARY =====
  const loadMySummary = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const res = await axios.get(
        `${API}/attendance/summary/${employeeId}/${year}/${month}`
      );

      setSummary(res.data);
    } catch (err) {
      console.error("Summary error:", err);
    }
  };

  // ===== LOAD HISTORY =====
  const loadHistory = async () => {
    try {
      const res = await axios.get(
        `${API}/attendance/employee/${employeeId}`
      );
      setHistory(res.data);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  // ===== LOAD EMPLOYEE =====
  const loadEmployee = async () => {
    try {
      const res = await axios.get(
        `${API}/employees/${employeeId}`
      );
      setEmployee(res.data);
    } catch (err) {
      console.error("Employee error:", err);
    }
  };

  useEffect(() => {
    loadMySummary();
    loadHistory();
    loadEmployee();
  }, []);

  // ===== CHECK IN =====
  const checkIn = async () => {
    try {
      await axios.post(
        `${API}/attendance/checkin/${employeeId}`
      );

      alert("Checked In Successfully");

      loadMySummary();
      loadHistory();
    } catch (err) {
      console.error(err);
      alert("Check In Failed");
    }
  };

  // ===== CHECK OUT =====
  const checkOut = async () => {
    try {
      await axios.post(
        `${API}/attendance/checkout/${employeeId}`
      );

      alert("Checked Out Successfully");

      loadMySummary();
      loadHistory();
    } catch (err) {
      console.error(err);
      alert("Check Out Failed");
    }
  };

  // ===== APPLY LEAVE (backend not confirmed, keep safe) =====
  const applyLeave = async () => {
    try {
      await axios.post(`${API}/leave/apply`, {
        employeeId,
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
        <button onClick={logout}>Logout</button>
      </div>

      {summary && (
        <>
          {/* ===== SUMMARY CARDS ===== */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
            marginBottom: "20px",
          }}>
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

          {/* ===== PROFILE ===== */}
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
                <p><b>ID:</b> {employee.id}</p>
               <p><b>Password:</b> {employee.password}</p>

                </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>

          {/* ===== ACTIONS ===== */}
          <div className="panel">
            <h2>Attendance Actions</h2>

            <button onClick={checkIn}>Check In</button>
            <button onClick={checkOut} style={{ marginLeft: "10px" }}>
              Check Out
            </button>
          </div>

          {/* ===== LEAVE ===== */}
          <div className="panel">
            <h2>Apply Leave</h2>

            <input
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

          {/* ===== HISTORY ===== */}
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