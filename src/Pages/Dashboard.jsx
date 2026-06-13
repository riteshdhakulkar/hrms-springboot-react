import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const Dashboard = () => {
  const API = "https://hrms-springbootems-backend.onrender.com/api";

  const [employees, setEmployees] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState([]);

  // ===== FETCH DATA FROM BACKEND =====
  useEffect(() => {
    loadEmployees();
    loadAttendance();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.log("Employee fetch error:", err);
    }
  };

  const loadAttendance = async () => {
    try {
      const res = await axios.get(`${API}/attendance/today`);
      setAttendanceToday(res.data);
    } catch (err) {
      console.log("Attendance fetch error:", err);
    }
  };

  // ===== STATS (REAL DATA) =====
  const stats = {
    total: employees.length,
    present: attendanceToday.length,
    absent: employees.length - attendanceToday.length,
    leave: 0, // you can update later if leave API exists
  };

  const pieData = [
    { name: "Present", value: stats.present },
    { name: "Absent", value: stats.absent },
    { name: "Leave", value: stats.leave },
  ];

  const COLORS = ["#4f46e5", "#ef4444", "#f59e0b"];

  return (
    <div style={{ padding: "20px", background: "#f5f6fa", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>📊 Attendance Dashboard</h2>

      {/* ===== STATS CARDS ===== */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <Card title="Total Employees" value={stats.total} color="#6366f1" />
        <Card title="Present Today" value={stats.present} color="#22c55e" />
        <Card title="Absent Today" value={stats.absent} color="#ef4444" />
        <Card title="On Leave" value={stats.leave} color="#f59e0b" />
      </div>

      {/* ===== CHARTS ===== */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={boxStyle}>
          <h3>Today Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={boxStyle}>
          <h3>Live Employees</h3>
          <table style={{ width: "100%", marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i}>
                  <td>{emp.fname}</td>
                  <td>{emp.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ===== CARD =====
const Card = ({ title, value, color }) => {
  return (
    <div
      style={{
        flex: 1,
        padding: "15px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderLeft: `5px solid ${color}`,
      }}
    >
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
};

const boxStyle = {
  flex: 1,
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export default Dashboard;