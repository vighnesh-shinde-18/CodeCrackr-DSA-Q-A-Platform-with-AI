import React, { useState, useCallback } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const RESET_PASSWORD_URL = `${BASE_URL}/api/auth/reset-password`;

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await axios.post(
          RESET_PASSWORD_URL,
          { email, otp, newPassword },
          { withCredentials: true }
        );

        if (res.status === 200) {
          toast.success("Password reset successful. Login now.");
          navigate("/login");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          "Invalid OTP or email. Please try again.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [email, otp, newPassword, RESET_PASSWORD_URL, navigate]
  );

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 border p-6 rounded-md shadow"
      >
        <h2 className="text-xl font-bold text-center">Reset Your Password</h2>

        <div className="grid gap-3">
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="grid gap-3">
          <Label>OTP</Label>
          <Input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>

        <div className="grid gap-3">
          <Label>New Password</Label>
          <Input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </section>
  );
};

export default React.memo(ResetPasswordPage);
