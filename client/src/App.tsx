import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";
import Form from "./components/form/form";
//import Dashboard from "./pages/admin/dashboard/dashboard";
import { useSelector } from "react-redux";
import Servey from "./pages/admin/servey/servey";
import Dashboard from "./pages/admin/dashboard/dashboard";
import Questionaire from "./pages/customers/questionaire";
//import Dashboard from "./pages/dashboard/dashboard";

const App: React.FC = () => {
  const user = useSelector((state: any) => state.user?.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={!user ? <Form /> : <Navigate to="/manager" />}
        />
        <Route path="/manager/servey" element={<Servey />} />
        <Route path="/" element={<Home />} />
        <Route path="/client" element={<Questionaire />} />

        <Route
          path="/manager"
          element={user ? <Dashboard /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
