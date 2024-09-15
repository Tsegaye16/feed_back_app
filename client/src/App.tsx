import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";
import Header from "./components/header/header";
import Form from "./components/form/form";
import Dashboard from "./pages/admin/dashboard/dashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Form />} />
        <Route path="/manager" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
