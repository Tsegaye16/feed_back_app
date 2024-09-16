import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./../form.css";
import { signup } from "../../../logics/action/auth";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
function Registration() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(signup(formData, navigate) as any);
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1 className="h1">Create Account</h1>

        <span>or use your email for registration</span>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          value={formData.name}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={formData.confirmPassword}
        />
        <button className="button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Registration;
