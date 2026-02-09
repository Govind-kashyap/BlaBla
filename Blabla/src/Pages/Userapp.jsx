import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import Outsidehome from "./outsidehome.jsx";
import Login from "./login.jsx";
import Register from "./Register.jsx";
import Home from "./home.jsx";
import { checkAuth } from "../utlis/checkauth.js";
import AddRide from "./Addride.jsx";
import ForgotPassword from "../Component/Forgetpass.jsx";
import ResetPassword from "../Component/Resetpass.jsx";
import Myprofile from "../Component/Myprofile.jsx";
import ViewDetail from "../Component/ViewDetail.jsx";
import BookingRide from "../Component/BookingRide.jsx";

const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await checkAuth();
        setIsAuth(!!res);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return isAuth ? children : <Navigate to="/login" replace />;
};

function Userapp() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Outsidehome />
          </PrivateRoute>
        }
      />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="/addRide"
        element={
          <PrivateRoute>
            <AddRide />
          </PrivateRoute>
        }
      />

      <Route
        path="/ride/:id"
        element={
          <PrivateRoute>
            <ViewDetail />
          </PrivateRoute>
        }
      />

      <Route
        path="/Myprofile"
        element={
          <PrivateRoute>
            <Myprofile />
          </PrivateRoute>
        }
      />

      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <BookingRide />
          </PrivateRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


export default Userapp;
