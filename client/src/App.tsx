import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";

//import Dashboard from "./pages/admin/dashboard/dashboard";
import { useSelector } from "react-redux";
import Servey from "./pages/admin/servey/servey";
import Dashboard from "./pages/admin/dashboard/dashboard";
import Questionaire from "./pages/customers/questionaire";
import Login from "./components/form/login/login";
import Registration from "./components/form/register/register";
import { ToastContainer } from "react-toastify";
//import Dashboard from "./pages/dashboard/dashboard";

const App: React.FC = () => {
  const user = useSelector((state: any) => state.user?.user);

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
        <Route path="/manager/servey" element={<Servey />} />
        <Route path="/" element={<Home />} />
        <Route path="/client" element={<Questionaire />} />

        <Route path="/manager" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
