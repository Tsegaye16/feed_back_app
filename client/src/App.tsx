import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";

import Dashboard from "./pages/admin/dashboard/dashboard";
import Login from "./components/form/login/login";
import Registration from "./components/form/register/register";
import { ToastContainer } from "react-toastify";
import Preview from "./pages/admin/serveys/preview";
import Customer from "./pages/customers/customer";
import EmailConfirm from "./components/form/emailConfirm";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        <Route path="/" element={<Home />} />

        <Route path="/confirm-email" element={<EmailConfirm />} />
        <Route
          path={"/:companyName/surveys/preview/:surveyId"}
          element={<Preview />}
        />
        <Route
          path={"/:companyName/surveys/:surveyId"}
          element={<Customer />}
        />

        <Route path="/manager" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
