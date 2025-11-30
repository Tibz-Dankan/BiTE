import React, { useState } from "react";
import {
  Clock,
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  Filter,
  Search,
  ChevronRight,
} from "lucide-react";

// Sample data based on your schema
const categories = [
  {
    id: "1",
    name: "Mathematics",
    icon: "🔢",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "2",
    name: "Physics",
    icon: "⚛️",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    name: "Software Development",
    icon: "💻",
    color: "from-green-500 to-emerald-500",
  },
  { id: "4", name: "Art", icon: "🎨", color: "from-orange-500 to-red-500" },
  {
    id: "5",
    name: "English",
    icon: "📚",
    color: "from-indigo-500 to-purple-500",
  },
];

const quizzes = [
  {
    id: "1",
    title: "Advanced Calculus Challenge",
    introduction:
      "Test your understanding of derivatives, integrals, and limits in this comprehensive calculus assessment.",
    quizCategoryID: "1",
    startsAt: "2025-11-20T10:00:00Z",
    endsAt: "2025-12-20T23:59:59Z",
    canBeAttempted: true,
    postedByUser: { name: "Dr. Sarah Johnson", avatar: "👩‍🏫" },
    questions: Array(15).fill(null),
    attempts: Array(234).fill(null),
  },
  {
    id: "2",
    title: "Quantum Mechanics Fundamentals",
    introduction:
      "Explore the fascinating world of quantum physics through thought-provoking questions on wave-particle duality and uncertainty.",
    quizCategoryID: "2",
    startsAt: "2025-11-25T10:00:00Z",
    endsAt: "2025-12-25T23:59:59Z",
    canBeAttempted: true,
    postedByUser: { name: "Prof. Michael Chen", avatar: "👨‍🔬" },
    questions: Array(20).fill(null),
    attempts: Array(156).fill(null),
  },
  {
    id: "3",
    title: "React & Modern Web Development",
    introduction:
      "Master the essentials of React, hooks, state management, and component architecture in this practical coding assessment.",
    quizCategoryID: "3",
    startsAt: "2025-11-15T10:00:00Z",
    endsAt: "2025-12-15T23:59:59Z",
    canBeAttempted: true,
    postedByUser: { name: "Alex Rivera", avatar: "👨‍💻" },
    questions: Array(25).fill(null),
    attempts: Array(567).fill(null),
  },
  {
    id: "4",
    title: "Renaissance Art History",
    introduction:
      "Journey through the masterpieces of the Renaissance period, from da Vinci to Michelangelo.",
    quizCategoryID: "4",
    startsAt: "2025-11-18T10:00:00Z",
    endsAt: "2025-12-18T23:59:59Z",
    canBeAttempted: true,
    postedByUser: { name: "Emma Thompson", avatar: "👩‍🎨" },
    questions: Array(18).fill(null),
    attempts: Array(89).fill(null),
  },
  {
    id: "5",
    title: "Shakespeare & Elizabethan Literature",
    introduction:
      "Delve into the works of Shakespeare and contemporaries, exploring themes, language, and historical context.",
    quizCategoryID: "5",
    startsAt: "2025-11-22T10:00:00Z",
    endsAt: "2025-12-22T23:59:59Z",
    canBeAttempted: true,
    postedByUser: { name: "James Bennett", avatar: "👨‍🏫" },
    questions: Array(12).fill(null),
    attempts: Array(203).fill(null),
  },
  {
    id: "6",
    title: "Linear Algebra Essentials",
    introduction:
      "Master vectors, matrices, eigenvalues and transformations in this foundational mathematics quiz.",
    quizCategoryID: "1",
    startsAt: "2025-11-28T10:00:00Z",
    endsAt: "2025-12-28T23:59:59Z",
    canBeAttempted: true,
    postedByUser: { name: "Dr. Sarah Johnson", avatar: "👩‍🏫" },
    questions: Array(22).fill(null),
    attempts: Array(178).fill(null),
  },
];

const QuizPlatform = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory =
      selectedCategory === "all" || quiz.quizCategoryID === selectedCategory;
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.introduction.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryById = (id) => categories.find((cat) => cat.id === id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      {/* Hero Header */}
      <div
        className="text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(74.93% 0.154 70.67) 0%, oklch(65% 0.18 60) 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Explore Knowledge
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Challenge yourself with curated quizzes across various subjects
              and elevate your learning journey
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search quizzes by title or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Filter size={20} className="text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                selectedCategory === "all"
                  ? "text-white shadow-lg"
                  : "bg-white text-slate-700 hover:bg-slate-50 shadow"
              }`}
              style={
                selectedCategory === "all"
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(74.93% 0.154 70.67) 0%, oklch(70% 0.17 65) 100%)",
                    }
                  : {}
              }
            >
              All Quizzes
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : "bg-white text-slate-700 hover:bg-slate-50 shadow"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const category = getCategoryById(quiz.quizCategoryID);
            return (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
              >
                {/* Category Badge Header */}
                <div className={`h-2 bg-gradient-to-r ${category.color}`}></div>

                <div className="p-6">
                  {/* Category Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${category.color} text-white`}
                    >
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                    {quiz.canBeAttempted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 transition-colors"
                    style={{ "--hover-color": "oklch(74.93% 0.154 70.67)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color =
                        "oklch(74.93% 0.154 70.67)")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    {quiz.title}
                  </h3>

                  {/* Introduction */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {quiz.introduction}
                  </p>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <BookOpen
                        size={16}
                        style={{ color: "oklch(74.93% 0.154 70.67)" }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {quiz.questions.length} Questions
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User
                        size={16}
                        style={{ color: "oklch(74.93% 0.154 70.67)" }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {quiz.attempts.length} Attempts
                      </span>
                    </div>
                  </div>

                  {/* Posted By */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                    <span className="text-2xl">{quiz.postedByUser.avatar}</span>
                    <div>
                      <p className="text-xs text-slate-500">Posted by</p>
                      <p className="text-sm font-medium text-slate-700">
                        {quiz.postedByUser.name}
                      </p>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} className="text-green-600" />
                      <span>Starts: {formatDate(quiz.startsAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={14} className="text-red-600" />
                      <span>Ends: {formatDate(quiz.endsAt)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group/btn ${
                      quiz.canBeAttempted
                        ? `bg-gradient-to-r ${category.color} text-white hover:shadow-lg`
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {quiz.canBeAttempted ? "Start Quiz" : "Coming Soon"}
                    {quiz.canBeAttempted && (
                      <ChevronRight
                        size={18}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No quizzes found
            </h3>
            <p className="text-slate-600">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlatform;
