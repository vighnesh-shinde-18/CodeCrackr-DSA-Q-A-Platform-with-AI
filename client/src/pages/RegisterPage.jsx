import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/ui/register-form";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const REGISTER_USER_URL = `${BASE_URL}/api/auth/register`;

  const handleRegister = useCallback(
    async ({ email, username, password }) => {
      setLoading(true);

      try {
        const res = await axios.post(
          REGISTER_USER_URL,
          { email, username, password },
          { withCredentials: true }
        );

        if (res.status === 201) {
          toast.success("Registration successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2500);
        }
      } catch (err) {
        const status = err?.response?.status;
        if (status === 409) {
          toast.error("User already exists.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate, REGISTER_USER_URL]
  );

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </section>
  );
};

export default React.memo(RegisterPage);
