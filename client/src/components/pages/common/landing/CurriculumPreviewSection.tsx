import React from "react";
import { SCNButton } from "../../../ui/shared/button";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Gamepad2,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface QuizPreview {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

const FEATURED_QUIZZES: QuizPreview[] = [
  {
    id: "7d81bd25-6e83-4727-b1bf-bdd78b06b872",
    title: "Mathematics of 'SHAmory'",
    category: "Game Theory",
    description:
      "Apply your mathematical skills to find the best strategy in the Bitcoin Board game 'SHAmory'.",
    icon: <Gamepad2 className="w-6 h-6 text-purple-500" />,
  },
  {
    id: "2bdcbe50-86b9-4609-8ceb-90cfeda371c6",
    title: "Mathematics of AI",
    category: "Computer Science",
    description:
      "Explore the mathematics of change and optimization that powers AI models like Gradient Descent.",
    icon: <BrainCircuit className="w-6 h-6 text-blue-500" />,
  },
  {
    id: "eb2cee11-7f23-4e00-bf53-b4e8fc878296",
    title: "Quantum Computing for Bitcoin",
    category: "Cryptography",
    description:
      "Understand why quantum computing is an augmentation to Bitcoin's ecosystem, not just a threat.",
    icon: <Lock className="w-6 h-6 text-green-500" />,
  },
];

export const CurriculumPreviewSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Curriculum Highlights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our rigorous STEM modules rooted in real-world Bitcoin
            applications. Sign in to access the full catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_QUIZZES.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="mb-6 bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100">
                {quiz.icon}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                  {quiz.category}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {quiz.title}
              </h3>

              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                {quiz.description}
              </p>

              <SCNButton
                asChild
                variant="outline"
                className="w-full justify-between group border-gray-200 hover:bg-gray-50"
              >
                <Link to="/auth/signin">
                  Start Module
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </Link>
              </SCNButton>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <SCNButton
            asChild
            className="rounded-full px-8 shadow-lg shadow-purple-100"
          >
            <Link to="/auth/signup">
              <BookOpen className="w-4 h-4 mr-2" />
              View Full Curriculum
            </Link>
          </SCNButton>
        </div>
      </div>
    </section>
  );
};
