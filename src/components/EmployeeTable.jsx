import React from "react";

const EmployeeTable = ({
  filteredEmployees,
  todayStatus,
  setSelectedEmployee,
  checkIn,
  checkOut,
  editEmployee,
  deleteEmployee,
}) => {
  const safeEmployees = Array.isArray(filteredEmployees)
    ? filteredEmployees
    : [];

  return (
    <div className="panel">
      <h2>Employee Records</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Actions</th>
            <th>Attendance</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {safeEmployees.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No Employees Found
              </td>
            </tr>
          ) : (
            safeEmployees.map((emp) => (
              <tr key={emp.id}>

                {/* NAME (CLICK TO VIEW MODAL) */}
                <td>
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#2563eb",
                      fontWeight: "600",
                    }}
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    {emp.fname}
                  </span>
                </td>

                <td>{emp.email}</td>
                <td>{emp.desig}</td>
                <td>₹ {emp.sal}</td>

                {/* ACTIONS */}
                <td>
                  <button onClick={() => editEmployee(emp)}>Edit</button>
                  <button onClick={() => deleteEmployee(emp.email)}>
                    Delete
                  </button>
                </td>

                {/* ATTENDANCE */}
                <td>
                  <button onClick={() => checkIn(emp.id)}>IN</button>
                  <button onClick={() => checkOut(emp.id)}>OUT</button>
                </td>

                {/* STATUS */}
                <td>
                  {todayStatus?.[emp.id] === "PRESENT" && (
                    <span className="badge-present">PRESENT</span>
                  )}

                  {todayStatus?.[emp.id] === "COMPLETED" && (
                    <span className="badge-completed">COMPLETED</span>
                  )}

                  {!todayStatus?.[emp.id] && (
                    <span className="badge-absent">NOT MARKED</span>
                  )}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;