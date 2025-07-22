import React, { useState } from "react";
import { Eye, EyeOff, GalleryVerticalEnd, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ className, onSubmit, loading = false, ...props }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, username, password });
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center gap-2">
            <GalleryVerticalEnd className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">
              Code<span className="text-blue-600">Crackr</span>
            </h1>
          </div>
          <h2 className="text-lg font-semibold">Create your account</h2>
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* Username */}
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="your_username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        {/* Password */}
        <div className="grid gap-2 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-8 text-muted-foreground cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full gap-2" disabled={loading}>
          <UserPlus className="w-4 h-4" />
          {loading ? "Registering..." : "Register"}
        </Button>

        {/* Divider */}
        {/* <div className="relative text-center text-sm my-2">
          <div className="absolute inset-0 top-1/2 border-t border-border z-0"></div>
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            OR
          </span>
        </div> */}

        {/* Google OAuth */}
        {/* <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            (window.location.href = "http://localhost:5000/api/auth/google")
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          Continue with Google
        </Button> */}

        {/* Navigation */}
        <p className="text-sm text-center text-muted-foreground mt-4">
          Already have an account?{" "}
          <span
            className="text-primary underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
