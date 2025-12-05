import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { DiscoverEvents } from "./components/DiscoverEvents";
import { useState } from "react";
import "./styles/custom.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="app-container">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === "home" && <Hero setCurrentPage={setCurrentPage} />}
      {currentPage === "register" && <Register />}
      {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
      {currentPage === "discover" && <DiscoverEvents />}
    </div>
  );
}