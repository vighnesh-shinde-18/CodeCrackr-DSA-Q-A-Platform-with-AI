// src/App.jsx
import Hero from "./pages/HeroPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import ProblemsPage from "./pages/ProblemPage";
import HistoryPage from "./pages/HistoryPage";
import FeaturePage from "./pages/FeaturePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ProblemSolvingPage from "./pages/ProblemSolvingPage.jsx";
import ProblemManagerPage from "./pages/ProblemManagerPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/debug" element={<FeaturePage featureName="Debug Code" />} />
        <Route path="/review" element={<FeaturePage featureName="Review & Refactor Code" />} />
        <Route path="/generate" element={<FeaturePage featureName="Generat Code" />} />
        <Route path="/convert" element={<FeaturePage featureName="Convert Code" />} />
        <Route path="/explain" element={<FeaturePage featureName="Explain Code" />} />
        <Route path="/testcases" element={<FeaturePage featureName="Generate Test Cases" />} />
        <Route path="/solve-problem/:id" element={<ProblemSolvingPage />} />
        <Route path="/problem-manager" element={<ProblemManagerPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
      <Route path="/reset-password/" element={<ResetPasswordPage />} />
      </Routes>
      {/* 296312 */}
      <Toaster richColors position="top-right" />
    </BrowserRouter>

  );
}

export default App;
