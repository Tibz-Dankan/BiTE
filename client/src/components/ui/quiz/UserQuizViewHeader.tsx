// import { Search } from "lucide-react";
import React from "react";

export const UserQuizViewHeader: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  return (
    <div
      className="text-white rounded-2xl"
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
            Challenge yourself with curated quizzes across various subjects and
            elevate your learning journey
          </p>

          {/* Search Bar */}
          {/* <div className="max-w-2xl mx-auto relative">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};
