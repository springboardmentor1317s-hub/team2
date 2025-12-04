import React, { useState, useEffect } from "react";
import api from "../api"; // Make sure src/api.js exists

export default function AdminDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: ""
  });
  const [events, setEvents] = useState([]);

  // Fetch all events from backend
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Submit new event
  const submit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // JWT token from login
      await api.post("/events", form, {
        headers: { Authorization: token }
      });
      alert("Event created successfully");
      setForm({ title: "", description: "", date: "", time: "" });
      fetchEvents(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      <h4 className="mt-4">Create Event</h4>
      <form onSubmit={submit}>
        <input
          className="form-control my-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="form-control my-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="form-control my-2"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="form-control my-2"
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />
        <button className="btn btn-primary mt-2">Create Event</button>
      </form>

      <h4 className="mt-5">All Events</h4>
      <ul className="list-group">
        {events.map((ev) => (
          <li key={ev._id} className="list-group-item">
            <strong>{ev.title}</strong> — {new Date(ev.date).toLocaleDateString()} {ev.time}
            <br />
            {ev.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
