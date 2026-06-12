import React from "react";
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

const Dashboard = () => {
  // ===== SAMPLE DATA (replace with your backend data later) =====
  const stats = {
    total: 50,
    present: 38,
    absent: 8,
    leave: 4,
  };

  const monthlyData = [
    { month: "Jan", present: 80, absent: 15, leave: 5 },
    { month: "Feb", present: 75, absent: 20, leave: 5 },
    { month: "Mar", present: 85, absent: 10, leave: 5 },
    { month: "Apr", present: 78, absent: 17, leave: 5 },
    { month: "May", present: 82, absent: 12, leave: 6 },
  ];

  const pieData = [
    { name: "Present", value: stats.present },
    { name: "Absent", value: stats.absent },
    { name: "Leave", value: stats.leave },
  ];

  const COLORS = ["#4f46e5", "#ef4444", "#f59e0b"];

  const employees = [
    { name: "Rohit", present: 20, absent: 2, leave: 1 },
    { name: "Amit", present: 18, absent: 4, leave: 1 },
    { name: "Sara", present: 22, absent: 1, leave: 0 },
    { name: "Neha", present: 19, absent: 3, leave: 1 },
  ];

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

      {/* ===== CHARTS SECTION ===== */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {/* LINE CHART */}
        <div style={boxStyle}>
          <h3>Monthly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#4f46e5" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" />
              <Line type="monotone" dataKey="leave" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div style={boxStyle}>
          <h3>Today Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== EMPLOYEE TABLE ===== */}
      <div style={boxStyle}>
        <h3>Employee Performance</h3>
        <table style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leave</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={i}>
                <td>{emp.name}</td>
                <td>{emp.present}</td>
                <td>{emp.absent}</td>
                <td>{emp.leave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===== SMALL CARD COMPONENT =====
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

// ===== BOX STYLE =====
const boxStyle = {
  flex: 1,
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export default Dashboard;