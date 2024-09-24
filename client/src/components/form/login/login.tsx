import React, { useState } from "react";
import "./../form.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../../../logics/action/auth";

const initialState = {
  email: "",
  password: "",
};
const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(signin(formData, navigate) as any);
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1 className="h1">Sign in</h1>

        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <a href="#">Forgot your password?</a>
        <button className="button" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
