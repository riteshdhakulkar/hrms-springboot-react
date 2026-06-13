import React from "react";
import "../components/AttendanceSummary.css";

const AttendanceSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="summary-container">

      <div className="summary-card total">
        <h3>Total Records</h3>
        <p>{summary.total}</p>
      </div>

      <div className="summary-card present">
        <h3>Present</h3>
        <p>{summary.present}</p>
      </div>

      <div className="summary-card late">
        <h3>Late</h3>
        <p>{summary.late}</p>
      </div>

      <div className="summary-card completed">
        <h3>Completed</h3>
        <p>{summary.completed}</p>
      </div>

      <div className="summary-card absent">
        <h3>Not Marked</h3>
        <p>{summary.notMarked}</p>
      </div>

    </div>
  );
};

export default AttendanceSummary;