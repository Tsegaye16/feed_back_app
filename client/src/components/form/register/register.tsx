import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./../form.css";
import { signup } from "../../../logics/action/auth";
import axios from "axios";

const initialState = {
  name: "",
  email: "",
  password: "",
};
function Registration() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(signup(formData, navigate) as any);
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

        <button className="button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Registration;
