import React from "react";

const DashboardCards = ({ employees, todayStatus }) => {
  return (
    <div className="cards">

      <div className="card">
        <h3>Total Employees</h3>
        <h1>{employees.length}</h1>
      </div>

      <div className="card">
        <h3>Present Today</h3>
        <h1>{Object.values(todayStatus).filter(s => s === "PRESENT").length}</h1>
      </div>

      <div className="card">
        <h3>Completed Shift</h3>
        <h1>{Object.values(todayStatus).filter(s => s === "COMPLETED").length}</h1>
      </div>

      <div className="card">
        <h3>Not Marked</h3>
        <h1>{employees.length - Object.keys(todayStatus).length}</h1>
      </div>

    </div>
  );
};

export default DashboardCards;