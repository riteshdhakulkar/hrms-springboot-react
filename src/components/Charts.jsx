import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

const Charts = ({ employees, todayStatus }) => {
  const present = Object.values(todayStatus).filter(s => s === "PRESENT").length;
  const completed = Object.values(todayStatus).filter(s => s === "COMPLETED").length;
  const absent = employees.length - Object.keys(todayStatus).length;

  const pieData = [
    { name: "Present", value: present },
    { name: "Completed", value: completed },
    { name: "Absent", value: absent }
  ];

  const barData = employees.map(emp => ({
    name: emp.fname,
    present: todayStatus[emp.id] === "PRESENT" ? 1 : 0,
    completed: todayStatus[emp.id] === "COMPLETED" ? 1 : 0
  }));

  return (
    <div>
      <div className="panel">
        <h2>Attendance Overview</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label>
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.name === "Present"
                      ? "#22c55e"
                      : entry.name === "Completed"
                      ? "#3b82f6"
                      : "#ef4444"
                  }
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="panel">
        <h2>Employee Attendance</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="present" fill="#22c55e" />
            <Bar dataKey="completed" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;