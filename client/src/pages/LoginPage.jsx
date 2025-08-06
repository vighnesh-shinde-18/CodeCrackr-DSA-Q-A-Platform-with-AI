import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import LoginForm from "../components/ui/login-form";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const LOGIN_USER_URL = `${BASE_URL}/api/auth/login`;

  const handleLogin = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        LOGIN_USER_URL,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Login successful! Redirecting...");
      localStorage.setItem("isLoggedIn", "true");

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 404) {
        toast.error("User not found.");
      } else if (status === 401) {
        toast.error("Incorrect password.");
      } else {
        toast.error(err?.response?.data?.error || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </section>
  );
};

export default React.memo(LoginPage);
