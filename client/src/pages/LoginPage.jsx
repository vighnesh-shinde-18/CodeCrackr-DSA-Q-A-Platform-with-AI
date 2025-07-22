import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 
import LoginForm from "../components/ui/login-form";


const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const LOGIN_USER_URL = `${BASE_URL}/api/auth/login`;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await fetch(LOGIN_USER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        toast.success("Login successful! Redirecting...");
        localStorage.setItem("isLoggedIn", "true");
       setTimeout(()=>{
         navigate('/dashboard');
       },3000)
      } else if (response.status === 404) {
        toast.error("User not found.");
      } else if (response.status === 401) {
        toast.error("Incorrect password.");
      } else {
        toast.error("Login failed. Try again.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <LoginForm onSubmit={handleLogin} loading={loading} />
    </section>
  );
};

export default LoginPage;
