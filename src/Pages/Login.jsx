import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const API = "https://hrms-springbootems-backend.onrender.com";

  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        username,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // save login data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("employeeId", res.data.employeeId);

      // redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      alert("Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>HRMS Pro</h1>
        <p>Smart Employee Management System</p>
      </div>

      <div className="right-panel">
        <div className="login-card">
          <h2>Login</h2>

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
}