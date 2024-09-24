import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Fix import

import { getUserById } from "../../logics/action/user";
import "./header.css";

interface CustomJwtPayload {
  id: any; // Ensure correct type
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const currenTtoken = useSelector((state: any) => state.auth?.authData);

  useEffect(() => {
    if (currenTtoken) {
      const decoded = jwtDecode<CustomJwtPayload>(currenTtoken);
      dispatch(getUserById(decoded.id) as any);
    }
  }, [currenTtoken, dispatch]);

  const user = useSelector((state: any) => state.user?.user);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">Logo</div>
      {currenTtoken ? (
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="/manager/servey" className="nav-link">
            Create survey
          </a>
          <a href="/manager/feedBack" className="nav-link">
            Feedbacks
          </a>
          <a href="#" className="nav-link">
            {user?.newUser.name}
          </a>
        </div>
      ) : (
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
      )}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </div>
    </nav>
  );
};

export default Header;
