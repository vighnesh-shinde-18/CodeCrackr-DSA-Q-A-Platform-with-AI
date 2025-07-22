import React, { useState } from "react"
import { Eye, EyeOff, GalleryVerticalEnd, LogIn } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

export default function LoginForm({ className, onSubmit, loading = false, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <GalleryVerticalEnd className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Code<span className="text-blue-600">Crackr</span></h1>
            </div>
          </div>
          <h1 className="text-xl text-center font-bold">Welcome Back, Login Please</h1>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          {/* Password Input */}
          <div className="grid gap-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <div
              className="absolute right-3 top-7.5 cursor-pointer text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>

            <span
              className="text-sm mt-1 text-right text-blue-600 underline cursor-pointer hover:text-blue-800"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </div>
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* <div className="relative text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-border z-0"></div>
            <span className="bg-background relative z-10 px-2 text-muted-foreground">
              Or
            </span>
          </div> */}

          {/* <div className="flex items-center-safe">
            <Button onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
              variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div> */}
        </div>
      </form>

      <div className="text-muted-foreground text-center text-xs mt-6 *:[a]:underline *:[a]:underline-offset-4"> <p className="text-sm text-muted-foreground text-center">
        Don&apos;t have an account?{" "}
        <span
          className="text-primary underline cursor-pointe"
          onClick={() => navigate("/register")}
        >
          Register Now
        </span>
      </p>
      </div>
    </div>
  )
}
