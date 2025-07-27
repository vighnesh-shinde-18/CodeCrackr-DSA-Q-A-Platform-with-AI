// src/App.jsx
import Hero from "./pages/HeroPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import ProblemsPage from "./pages/ProblemPage";
import HistoryPage from "./pages/HistoryPage";
import AIFeaturePage from "./pages/AIFeaturePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ProblemSolvingPage from "./pages/ProblemSolvingPage.jsx";
import ProblemManagerPage from "./pages/ProblemManagerPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggleButton from "@/components/theme/ThemeToggleButton";

function App({children}) {
  return (
    <ThemeProvider>
{children}
<ThemeToggleButton/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/debug" element={<AIFeaturePage featureName="codeDebugging" />} />
        <Route path="/review" element={<AIFeaturePage featureName="codeReview" />} />
        <Route path="/generate" element={<AIFeaturePage featureName="codeGeneration" />} />
        <Route path="/convert" element={<AIFeaturePage featureName="convertCode" />} />
        <Route path="/explain" element={<AIFeaturePage featureName="explainCode" />} />
        <Route path="/testcases" element={<AIFeaturePage featureName="generateTestCases" />} />
        <Route path="/solve-problem/:id" element={<ProblemSolvingPage />} />
        <Route path="/problem-manager" element={<ProblemManagerPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
      <Route path="/reset-password/" element={<ResetPasswordPage />} />
      </Routes>
      {/* 296312 */}
      <Toaster richColors position="top-right" />
    </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
