import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RocketIcon,
  Sparkles,
  Github,
  PencilLine,
  PlayCircle,
  Brain,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const gitHubUrl = "https://github.com/vighnesh-shinde-18/CodeCrackr";
const navigate = useNavigate()
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <Card className="w-full max-w-6xl border rounded-3xl shadow-2xl bg-white">
        <CardContent className="p-6 sm:p-10 md:p-14 space-y-10">
 
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary flex justify-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-700 animate-bounce" />
              LeetCode Clone with AI Superpowers
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Solve, run, and debug coding questions just like LeetCode — now with real-time AI help.
            </p>
            <div className="flex justify-center pt-2">
              <Button onClick={() => navigate("/login")} size="lg" className="gap-2">
                <RocketIcon className="w-5 h-5" />
                Get Started Now
              </Button>
            </div>
          </div>
 
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-700 text-sm sm:text-base font-medium">
            <div className="flex items-center gap-2">
              <PencilLine className="w-5 h-5 text-purple-700" />
              Write DSA Code
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-green-600" />
              Run & Test via Judge0
            </div>
            <ArrowRight className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Get AI Help (Debug / Explain / Optimize)
            </div>
          </div>
 
          <div className="text-center text-xs text-gray-400 pt-6">
            <a
              href= {gitHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex justify-center items-center gap-1"
            >
              <Github className="w-4 h-4" />
              View Project on GitHub
            </a>
          </div>
          
        </CardContent>
      </Card>
    </section>
  );
};

export default Hero;
