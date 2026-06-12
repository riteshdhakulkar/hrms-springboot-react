import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"];

const AttendanceCharts = ({ summary }) => {
  if (!summary) return null;

  const pieData = [
    { name: "Present", value: summary.present },
    { name: "Late", value: summary.late },
    { name: "Completed", value: summary.completed },
    { name: "Not Marked", value: summary.notMarked },
  ];

  const barData = pieData;

  return (
    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>

      {/* PIE CHART */}
      <div>
        <h3>Attendance Breakdown</h3>
        <PieChart width={350} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* BAR CHART */}
      <div>
        <h3>Attendance Stats</h3>
        <BarChart width={400} height={300} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </div>

    </div>
  );
};

export default AttendanceCharts;