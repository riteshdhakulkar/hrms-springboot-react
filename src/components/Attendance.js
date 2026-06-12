import React, { useState } from "react";
import { checkIn, checkOut } from "../services/api";

const Attendance = () => {

    const [employeeId] = useState(1);
    const [msg, setMsg] = useState("");

    const handleCheckIn = async () => {
        try {
            await checkIn(employeeId);
            setMsg("Checked In ✔");
        } catch (err) {
            setMsg("Check-In Failed ❌");
        }
    };

    const handleCheckOut = async () => {
        try {
            await checkOut(employeeId);
            setMsg("Checked Out ✔");
        } catch (err) {
            setMsg("Check-Out Failed ❌");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h1>EMS Attendance</h1>

            <button onClick={handleCheckIn} style={{ margin: "10px", padding: "10px" }}>
                Check In
            </button>

            <button onClick={handleCheckOut} style={{ margin: "10px", padding: "10px" }}>
                Check Out
            </button>

            <h3>{msg}</h3>
        </div>
    );
};

export default Attendance;