import React, { useState } from "react";
import "./header.css";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">Logo</div>
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="/" className="nav-link">
          Home
        </a>
        <a href="/contact" className="nav-link">
          Contact us
        </a>
        <a href="/auth" className="nav-link">
          Login
        </a>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </div>
    </nav>
  );
};

export default Header;
