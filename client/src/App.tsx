import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./components/home";
import RootLayout from "./components/RootLayout";
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
        {/* Pages that don't use the layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />

        {/* Pages wrapped in layout */}
        <Route
          path="/"
          element={
            <RootLayout>
              <Home />
            </RootLayout>
          }
        />
        <Route
          path="/confirm-email"
          element={
            <RootLayout>
              <EmailConfirm />
            </RootLayout>
          }
        />
        <Route
          path="/:companyName/surveys/preview/:surveyId"
          element={
            <RootLayout>
              <Preview />
            </RootLayout>
          }
        />
        <Route
          path="/:companyName/surveys/:surveyId"
          element={
            <RootLayout>
              <Customer />
            </RootLayout>
          }
        />
        <Route
          path="/manager"
          element={
            <RootLayout>
              <Dashboard />
            </RootLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
