import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/ui/register-form";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const REGISTER_USER_URL = `${BASE_URL}/api/auth/register`;
  const navigate = useNavigate();

  const handleRegister = async ({ email, username, password }) => {
    setLoading(true);

    try {
      const res = await fetch(REGISTER_USER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, username, password }),
      });

      if (res.status === 201) {
        toast.success(" Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else if (res.status === 409) {
        toast.error("User already exists.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </section>
  );
};

export default RegisterPage;
