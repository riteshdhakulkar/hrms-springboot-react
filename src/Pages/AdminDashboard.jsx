import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import "../Pages/AdminDashboard.css";

import DashboardCards from "../components/DashboardCards";
import EmployeeTable from "../components/EmployeeTable";
import Charts from "../components/Charts";
import AttendanceSummary from "../components/AttendanceSummary";
import AttendanceCharts from "../components/AttendanceCharts";
import { generateAttendancePDF } from "../components/generateAttendancePDF";
import { logout } from "../Pages/logout";

export default function AdminDashboard() {
  const API = import.meta.env.VITE_API_URL;

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [summary, setSummary] = useState(null);
  const [attendanceMsg, setAttendanceMsg] = useState("");
  const [todayStatus, setTodayStatus] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [employee, setEmployee] = useState({
    id: "",
    fname: "",
    email: "",
    dob: "",
    address: "",
    jdate: "",
    sal: "",
    desig: "",
    inc: "",
    bloodgrp: "",
    mobile: "",
    gender: "Male",
  });

  // ================= LOAD EMPLOYEES =================
 const loadEmployees = async () => {
  try {
    const res = await axios.get(`${API}/allemp`);

    console.log("API RESPONSE:", res.data);

    const data = Array.isArray(res.data) ? res.data : [];

    setEmployees(data);
  } catch (err) {
    console.error("Load employees error:", err);
    setEmployees([]);
  }
};
const loadTodayAttendance = async () => {
  try {
    const res = await axios.get(`${API}/attendance/today`);

    console.log("Attendance API:", res.data);

    const statusMap = {};

    res.data.forEach((att) => {
      statusMap[att.employeeId] =
        att.checkOut ? "COMPLETED" : att.checkIn ? "PRESENT" : "ABSENT";
    });

    console.log("Status Map:", statusMap);

    setTodayStatus(statusMap);
  } catch (err) {
    console.error("Attendance load error:", err);
  }
};

const loadAttendanceData = async () => {
  try {
    const res = await axios.get(`${API}/attendance/all`);

    console.log("REPORT DATA:", res.data);

    setAttendanceData(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  loadEmployees();
  loadTodayAttendance();
  loadAttendanceData();
  loadLeaveRequests();
}, []);

  // ================= LOCAL STORAGE SAFE LOAD =================
//  useEffect(() => {
//   try {
//     const savedEmployees = localStorage.getItem("employees");
//     const savedStatus = localStorage.getItem("todayStatus");

//     if (savedEmployees) {
//       const parsed = JSON.parse(savedEmployees);
//       setEmployees(Array.isArray(parsed) ? parsed : []);
//     }

//     if (savedStatus) {
//       const parsedStatus = JSON.parse(savedStatus);
//       setTodayStatus(parsedStatus && typeof parsedStatus === "object" ? parsedStatus : {});
//     }
//   } catch (err) {
//     console.error("LocalStorage error:", err);
//     setEmployees([]);
//     setTodayStatus({});
//   }
// }, []);

  // ================= SAVE TO LOCAL STORAGE =================
//   useEffect(() => {
//     localStorage.setItem("employees", JSON.stringify(employees || []));
//     localStorage.setItem("todayStatus", JSON.stringify(todayStatus || {}));
//   }, [employees, todayStatus]);

  // ================= SUMMARY =================
  const loadSummary = async (id) => {
    try {
      const res = await axios.get(`${API}/attendance/summary/${id}/2026/6`);
      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setEmployee((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SAVE =================
  const saveEmployee = async () => {
    try {
      const payload = {
        ...employee,
        sal: Number(employee.sal || 0),
        inc: Number(employee.inc || 0),
        mobile: Number(employee.mobile || 0),
      };

      if (employee.id) {
        await axios.put(`${API}/update`, payload);
        alert("Employee Updated Successfully");
      } else {
        await axios.post(`${API}/add`, payload);
        alert("Employee Added Successfully");
      }

      setEmployee({
        id: "",
        fname: "",
        email: "",
        dob: "",
        address: "",
        jdate: "",
        sal: "",
        desig: "",
        inc: "",
        bloodgrp: "",
        mobile: "",
        gender: "Male",
      });

      loadEmployees();
    } catch (err) {
      console.error(err);
      alert("Error Saving Employee");
    }
  };

  // ================= EDIT =================
  const editEmployee = (emp) => {
    setEmployee({
      ...emp,
      dob: emp.dob || "",
      jdate: emp.jdate || "",
    });
  };

  // ================= DELETE =================
  const deleteEmployee = async (email) => {
    if (!window.confirm("Delete Employee?")) return;

    try {
      await axios.delete(`${API}/delete?email=${email}`);
      loadEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= ATTENDANCE =================
  const checkIn = async (id) => {
  try {
    await axios.post(`${API}/attendance/checkin/${id}`);

    await loadTodayAttendance();

    setAttendanceMsg(`Employee ${id} Checked In Successfully`);
  } catch {
    setAttendanceMsg("Check In Failed");
  }
};

  const checkOut = async (id) => {
  try {
    await axios.post(`${API}/attendance/checkout/${id}`);

    await loadTodayAttendance();

    setAttendanceMsg(`Employee ${id} Checked Out Successfully`);
  } catch {
    setAttendanceMsg("Check Out Failed");
  }
};

const approveLeave = async (id) => {
  try {
    await axios.put(`${API}/leave/approve/${id}`);
    loadLeaveRequests();
  } catch (err) {
    console.error(err);
  }
};

const rejectLeave = async (id) => {
  try {
    await axios.put(`${API}/leave/reject/${id}`);
    loadLeaveRequests();
  } catch (err) {
    console.error(err);
  }
};

  // ================= SAFE FILTER =================
 const safeEmployees = Array.isArray(employees) ? employees : [];

const filteredEmployees = safeEmployees.filter((emp) =>
  emp?.fname?.toLowerCase().includes(search.toLowerCase()) ||
  emp?.email?.toLowerCase().includes(search.toLowerCase())
);

const loadLeaveRequests = async () => {
  try {
    const res = await axios.get(`${API}/leave/all`);
    setLeaveRequests(res.data);
  } catch (err) {
    console.error(err);
  }
};


  // ================= UI =================
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>HRMS</h2>

        <button onClick={() => setActivePage("dashboard")}>Dashboard</button>
        <button onClick={() => setActivePage("employees")}>Employees</button>
        <button onClick={() => setActivePage("attendance")}>Attendance</button>
        <button onClick={() => setActivePage("reports")}>Reports</button>

        <button onClick={() => setActivePage("leave")}>
  Leave Requests
</button>

        {/* <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button> */}
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="topbar">
  <h1>Admin Dashboard</h1>
<button onClick={logout}>
  Logout
</button>
 
</div>

        {activePage === "dashboard" && (
  <>
    <DashboardCards employees={employees} todayStatus={todayStatus} />

    <Charts employees={employees} todayStatus={todayStatus} />

    <div className="panel">
      <h2>Employee Records</h2>

      <EmployeeTable
        filteredEmployees={filteredEmployees}
        todayStatus={todayStatus}
        setSelectedEmployee={setSelectedEmployee}
        checkIn={checkIn}
        checkOut={checkOut}
        editEmployee={editEmployee}
        deleteEmployee={deleteEmployee}
        loadSummary={loadSummary}
      />
    </div>
  </>
)}

        {/* EMPLOYEES */}
        {activePage === "employees" && (
          <>
            <div className="panel">
              <h2>{employee.id ? "Update Employee" : "Add Employee"}</h2>

              <div className="form-grid">
                <input name="fname" placeholder="Full Name" value={employee.fname} onChange={handleChange} />
                <input name="email" placeholder="Email" value={employee.email} onChange={handleChange} />
                <input type="date" name="dob" value={employee.dob} onChange={handleChange} />
                <input name="address" placeholder="Address" value={employee.address} onChange={handleChange} />
                <input type="date" name="jdate" value={employee.jdate} onChange={handleChange} />
                <input type="number" name="sal" placeholder="Salary" value={employee.sal} onChange={handleChange} />
                <input name="desig" placeholder="Designation" value={employee.desig} onChange={handleChange} />
                <input type="number" name="inc" placeholder="Increment" value={employee.inc} onChange={handleChange} />
                <input name="bloodgrp" placeholder="Blood Group" value={employee.bloodgrp} onChange={handleChange} />
                <input type="number" name="mobile" placeholder="Mobile" value={employee.mobile} onChange={handleChange} />
              </div>

              <button onClick={saveEmployee}>
                {employee.id ? "Update Employee" : "Save Employee"}
              </button>
            </div>

            <div className="panel">
              <input
                className="search"
                placeholder="Search Employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <EmployeeTable
  filteredEmployees={filteredEmployees}
  todayStatus={todayStatus}
  setSelectedEmployee={setSelectedEmployee}
  checkIn={checkIn}
  checkOut={checkOut}
  editEmployee={editEmployee}
  deleteEmployee={deleteEmployee}
  loadSummary={loadSummary}
/>
          </>
        )}

        {/* ATTENDANCE */}
     {activePage === "attendance" && (
  <div className="panel">
    
    <h2>Attendance Monitor</h2>

    {/*  SUMMARY CARD */}
    <AttendanceSummary
      summary={{
        total: employees.length,
        present: Object.values(todayStatus).filter(
          (s) => s === "PRESENT"
        ).length,
        late: Object.values(todayStatus).filter(
          (s) => s === "LATE"
        ).length,
        completed: Object.values(todayStatus).filter(
          (s) => s === "COMPLETED"
        ).length,
        notMarked:
          employees.length - Object.keys(todayStatus).length,
      }}
    />

    <p>Total Employees: {employees.length}</p>

    <p>
      Present:{" "}
      {Object.values(todayStatus).filter(
        (s) => s === "PRESENT"
      ).length}
    </p>

    <p>
      Completed:{" "}
      {Object.values(todayStatus).filter(
        (s) => s === "COMPLETED"
      ).length}
    </p>

    <p>
      Not Marked:{" "}
      {employees.length - Object.keys(todayStatus).length}
    </p>

    <hr />

    {(employees || []).map((emp) => (
      <div key={emp.id}>
        <strong>{emp.fname}</strong> :{" "}
        <span>{todayStatus[emp.id] || "NOT MARKED"}</span>
      </div>
    ))}
  </div>
)}

<AttendanceCharts
  summary={{
    total: employees.length,
    present: Object.values(todayStatus).filter(
      (s) => s === "PRESENT"
    ).length,
    late: Object.values(todayStatus).filter(
      (s) => s === "LATE"
    ).length,
    completed: Object.values(todayStatus).filter(
      (s) => s === "COMPLETED"
    ).length,
    notMarked:
      employees.length - Object.keys(todayStatus).length,
  }}
  
/>
<button className="attendance-download-btn"
  onClick={() => generateAttendancePDF(employees, todayStatus)}
  style={{
    padding: "10px 15px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "15px",
  }}
>
  Download Attendance Report 📄
</button>


        {/* REPORTS */}
       {activePage === "reports" && (
  <div className="panel">
    <h2>Attendance Reports</h2>

    <table className="employee-table">
      <thead>
        <tr>
        <th>Employee Name</th>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Status</th>
          <th>Hours</th>
        </tr>
      </thead>

      <tbody>
        {attendanceData.map((att) => (
         <tr key={att.id}>
  <td>
    {
      employees.find(emp => emp.id === att.employeeId)?.fname
      || att.employeeId
    }
  </td>

  <td>{att.date}</td>
  <td>{att.checkIn || "-"}</td>
  <td>{att.checkOut || "-"}</td>
 <td>
  <span
    className={
      att.status === "PRESENT"
        ? "badge-present"
        : att.status === "LATE"
        ? "badge-late"
        : att.status === "COMPLETED"
        ? "badge-completed"
        : "badge-absent"
    }
  >
    {att.status}
  </span>
</td>
  <td>{att.workingHours || 0}</td>
</tr>
        ))}
      </tbody>
    </table>
  </div>
)}

        {/* MESSAGE */}
        <div className="panel">
          <h3>{attendanceMsg}</h3>
        </div>

      </div>

      {activePage === "leave" && (
  <div className="panel">
    <h2>Leave Requests</h2>

    <table className="table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Type</th>
          <th>From</th>
          <th>To</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {leaveRequests.map((leave) => (
          <tr key={leave.id}>
            <td>{leave.employeeName}</td>
            <td>{leave.leaveType}</td>
            <td>{leave.fromDate}</td>
            <td>{leave.toDate}</td>
            <td>{leave.reason}</td>
            <td>{leave.status}</td>

            <td>
              <button
                onClick={() => approveLeave(leave.id)}
              >
                Approve
              </button>

              <button
                onClick={() => rejectLeave(leave.id)}
                style={{ marginLeft: "8px" }}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {/* MODAL */}
      {selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Employee Details</h2>

            <p>Name: {selectedEmployee.fname}</p>
            <p>Email: {selectedEmployee.email}</p>
            <p>Mobile: {selectedEmployee.mobile}</p>
            <p>Designation: {selectedEmployee.desig}</p>
            <p>Salary: ₹ {selectedEmployee.sal}</p>
            <p>Blood Group: {selectedEmployee.bloodgrp}</p>
            <p>Join Date: {selectedEmployee.jdate}</p>

            <button onClick={() => setSelectedEmployee(null)}>Close</button>
          </div>
        
        </div>
      )}

    </div>
  );
}