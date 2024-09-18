import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";
import Form from "./components/form/form";
import Dashboard from "./pages/admin/dashboard/dashboard";
import { useSelector } from "react-redux";
import Servey from "./pages/admin/servey/servey";

const App: React.FC = () => {
  const user = useSelector((state: any) => state.userReducer?.user);
  console.log("Dispatched User: ", user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <Form /> : <Navigate to="/manager" />}
        />
        <Route path="/manager/servey" element={<Servey />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/manager"
          element={user ? <Dashboard /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
