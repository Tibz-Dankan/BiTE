import React from "react";
import { SCNButton } from "../../../ui/shared/button";
import { ArrowRight, ChevronRight, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-white min-h-screen flex items-center justify-center pt-16">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] animate-float transition-all delay-1000" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 text-xs font-medium text-gray-600 mb-8 animate-fade-in-up border border-gray-100 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Accepting New Students for 2025
          <ChevronRight className="w-3 h-3" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 animate-fade-in-up [animation-delay:200ms]">
          World-Class STEM Education. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[oklch(0.749_0.154_70.67)] to-purple-600">
            Powered by Bitcoin.
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up [animation-delay:400ms]">
          Empowering a generation of self-sovereign thinkers to build the future
          of AI, Robotics, and Software. Sign up today to access quizzes and
          track your progress.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
          <SCNButton
            asChild
            size="lg"
            className="rounded-full h-12 px-8 text-base shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all"
          >
            <Link to="/auth/signup">
              Create an Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SCNButton>
          <SCNButton
            asChild
            variant="outline"
            size="lg"
            className="rounded-full h-12 px-8 text-base bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all"
          >
            <Link to="/auth/signin">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to Attempt Quizzes
            </Link>
          </SCNButton>
        </div>
      </div>
    </div>
  );
};
