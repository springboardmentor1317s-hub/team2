import React, { useState, useEffect } from "react";
import api from "../api"; // make sure api.js exists

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  const registerEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/events/register`, { eventId }, { headers: { Authorization: token } });
      alert("Registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Student Dashboard</h2>
      <h4>Upcoming Events</h4>
      <ul className="list-group">
        {events.map((ev) => (
          <li key={ev._id} className="list-group-item">
            <strong>{ev.title}</strong> — {new Date(ev.date).toLocaleDateString()} {ev.time}
            <br />
            {ev.description}
            <button className="btn btn-success btn-sm mt-2" onClick={() => registerEvent(ev._id)}>
              Register
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
