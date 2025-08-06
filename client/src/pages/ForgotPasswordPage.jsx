import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const FORGOT_PASSWORD_URL = `${BASE_URL}/api/auth/send-otp`;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await axios.post(
          FORGOT_PASSWORD_URL,
          { email },
          { headers: { "Content-Type": "application/json" } }
        );

        toast.success("Password reset link sent to your email!");
        setEmail("");
        navigate("/reset-password");
      } catch (err) {
        console.error("Forgot password error:", err);
        toast.error(
          err?.response?.data?.error || "Email not registered or failed to send."
        );
      } finally {
        setLoading(false);
      }
    },
    [email, navigate]
  );

  const handleBackToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 border p-6 rounded-md shadow-md bg-white dark:bg-zinc-900 dark:border-zinc-800 transition"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold">Reset your password</h2>
          <p className="text-sm text-muted-foreground">
            Enter your registered email. We’ll send a reset link.
          </p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <p
          className="text-sm text-blue-600 underline cursor-pointer text-center"
          onClick={handleBackToLogin}
        >
          Back to Login
        </p>
      </form>
    </section>
  );
}
