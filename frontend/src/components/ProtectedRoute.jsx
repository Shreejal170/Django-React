import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constant";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAuthroized, setIsAuthroized] = useState(null);
  useEffect(() => {
    auth().catch(() => setIsAuthroized(flase));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthroized(true);
      } else {
        setIsAuthroized(flase);
      }
    } catch (error) {
      console.log(error);
      setIsAuthroized(flase);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthroized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthroized(true);
    }
  };

  if (isAuthroized == null) {
    return <div>Loading...</div>;
  }

  return isAuthroized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
