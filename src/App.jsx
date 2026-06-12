import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AdminDashboard from "./Pages/AdminDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import Login from "./Pages/Login";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  

  // 🔥 IMPORTANT: keep role updated after login
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* DEFAULT ROUTE */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* DASHBOARD (ROLE BASED) */}
      <Route
        path="/dashboard"
        element={
          role === "ADMIN"
            ? <AdminDashboard />
            : role === "EMPLOYEE"
              ? <EmployeeDashboard />
              : <Navigate to="/login" />
        }
      />

      {/* EMPLOYEES (ADMIN ONLY) */}
      <Route
        path="/employees"
        element={
          role === "ADMIN"
            ? <AdminDashboard />
            : <Navigate to="/dashboard" />
        }
      />

      {/* REPORTS (ADMIN ONLY) */}
      <Route
        path="/reports"
        element={
          role === "ADMIN"
            ? <AdminDashboard />
            : <Navigate to="/dashboard" />
        }
      />

    </Routes>
  );
}