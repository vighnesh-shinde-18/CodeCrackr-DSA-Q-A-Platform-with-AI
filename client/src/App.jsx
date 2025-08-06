// src/App.jsx
import React, { memo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggleButton from "@/components/theme/ThemeToggleButton";

// Pages
import Hero from "./pages/HeroPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProblemsPage from "./pages/ProblemPage";
import HistoryPage from "./pages/HistoryPage";
import AIFeaturePage from "./pages/AIFeaturePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProblemSolvingPage from "./pages/ProblemSolvingPage";
import ProblemManagerPage from "./pages/ProblemManagerPage";

const AppRoutes = memo(() => (
  <Routes>
    <Route path="/" element={<Hero />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/problems" element={<ProblemsPage />} />
    <Route path="/history" element={<HistoryPage />} />

    {/* AI Features */}
    <Route path="/debug" element={<AIFeaturePage featureName="codeDebugging" />} />
    <Route path="/review" element={<AIFeaturePage featureName="codeReview" />} />
    <Route path="/generate" element={<AIFeaturePage featureName="codeGeneration" />} />
    <Route path="/convert" element={<AIFeaturePage featureName="convertCode" />} />
    <Route path="/explain" element={<AIFeaturePage featureName="explainCode" />} />
    <Route path="/testcases" element={<AIFeaturePage featureName="generateTestCases" />} />

    {/* Problem Manager and Solving */}
    <Route path="/problem-manager" element={<ProblemManagerPage />} />
    <Route path="/solve-problem/:id" element={<ProblemSolvingPage />} />

    {/* Auth Recovery */}
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
  </Routes>
));

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
        <ThemeToggleButton />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
