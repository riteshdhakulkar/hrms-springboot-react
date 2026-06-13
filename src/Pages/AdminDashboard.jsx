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

  const API = "https://hrms-springbootems-backend.onrender.com/api";

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
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Load employees error:", err);
      setEmployees([]);
    }
  };

  // ================= TODAY ATTENDANCE =================
  const loadTodayAttendance = async () => {
    try {
      const res = await axios.get(`${API}/attendance/today`);

      const statusMap = {};

      res.data.forEach((att) => {
        statusMap[att.employeeId] =
          att.checkOut ? "COMPLETED" :
          att.checkIn ? "PRESENT" :
          "ABSENT";
      });

      setTodayStatus(statusMap);
    } catch (err) {
      console.error(err);
      setTodayStatus({});
    }
  };

  // ================= ALL ATTENDANCE =================
  const loadAttendanceData = async () => {
    try {
      const res = await axios.get(`${API}/attendance/all`);
      setAttendanceData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setAttendanceData([]);
    }
  };

  // ================= LEAVES =================
  const loadLeaveRequests = async () => {
    try {
      const res = await axios.get(`${API}/leave/all`);
      setLeaveRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setLeaveRequests([]);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadTodayAttendance();
    loadAttendanceData();
    loadLeaveRequests();
  }, []);

  // ================= SAFE FILTER =================
  const filteredEmployees = (employees || []).filter((emp) =>
    emp?.fname?.toLowerCase().includes(search.toLowerCase()) ||
    emp?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= SAVE EMPLOYEE =================
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
      } else {
        await axios.post(`${API}/add`, payload);
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

  // ================= DELETE =================
  const deleteEmployee = async (email) => {
    try {
      await axios.delete(`${API}/delete?email=${email}`);
      loadEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ATTENDANCE =================
  const checkIn = async (id) => {
    try {
      await axios.post(`${API}/attendance/checkin/${id}`);
      loadTodayAttendance();
      setAttendanceMsg(`Employee ${id} Checked In`);
    } catch {
      setAttendanceMsg("Check In Failed");
    }
  };

  const checkOut = async (id) => {
    try {
      await axios.post(`${API}/attendance/checkout/${id}`);
      loadTodayAttendance();
      setAttendanceMsg(`Employee ${id} Checked Out`);
    } catch {
      setAttendanceMsg("Check Out Failed");
    }
  };

  // ================= LEAVE =================
  const approveLeave = async (id) => {
    await axios.put(`${API}/leave/approve/${id}`);
    loadLeaveRequests();
  };

  const rejectLeave = async (id) => {
    await axios.put(`${API}/leave/reject/${id}`);
    loadLeaveRequests();
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
        <button onClick={() => setActivePage("leave")}>Leave Requests</button>
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="topbar">
          <h1>Admin Dashboard</h1>
          <button onClick={logout}>Logout</button>
        </div>

        {/* ===== DASHBOARD ===== */}
        {activePage === "dashboard" && (
          <>
            <DashboardCards employees={employees} todayStatus={todayStatus} />
            <Charts employees={employees} todayStatus={todayStatus} />
          </>
        )}

        {/* ===== LEAVE ===== */}
        {activePage === "leave" && (
          <div className="panel">
            <h2>Leave Requests</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {leaveRequests.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employeeName}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.status}</td>
                    <td>
                      <button onClick={() => approveLeave(leave.id)}>Approve</button>
                      <button onClick={() => rejectLeave(leave.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="panel">
          <h3>{attendanceMsg}</h3>
        </div>

      </div>
    </div>
  );
}