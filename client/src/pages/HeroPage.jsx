import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RocketIcon,
  Sparkles,
  Github,
  PencilLine,
  MessageSquare,
  CheckCircle2,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const gitHubUrl = "https://github.com/vighnesh-shinde-18/CodeCrackr";
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4 py-12 transition-colors duration-300">
      <Card className="w-full max-w-6xl border rounded-3xl shadow-2xl bg-white dark:bg-zinc-900 dark:border-zinc-800 transition-colors duration-300">
        <CardContent className="p-6 sm:p-10 md:p-14 space-y-10">
          {/* Title + Description */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary dark:text-white flex justify-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-700 animate-bounce" />
              CodeCrackr — DSA Q&A Platform with AI
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              A Stack Overflow-inspired platform for DSA questions. Ask, answer, and get AI help to debug, explain, or improve your solutions.
            </p>
            <div className="flex justify-center pt-2">
              <Button onClick={() => navigate("/login")} size="lg" className="gap-2">
                <RocketIcon className="w-5 h-5" />
                Get Started
              </Button>
            </div>
          </div>

          {/* Feature Flow */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
            <div className="flex items-center gap-2">
              <PencilLine className="w-5 h-5 text-purple-700" />
              Post DSA Questions
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Submit Solutions
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Mark Answers as Accepted
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Get AI Help (Debug / Explain / Optimize)
            </div>
          </div>

          {/* GitHub Link */}
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-6">
            <a
              href={gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex justify-center items-center gap-1"
            >
              <Github className="w-4 h-4" />
              View Full Source Code on GitHub
            </a>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Hero;
