// import { Search } from "lucide-react";
import React from "react";

export const UserQuizViewHeader: React.FC = () => {
  // const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="relative overflow-hidden rounded-2xl text-white group bg-slate-900">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 transition-all duration-500 ease-in-out blur-sm group-hover:blur-none"
        style={{
          backgroundImage: "url('/images/bg-bite.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-opacity duration-500 group-hover:opacity-0">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in shadow-black/50 drop-shadow-md">
            Explore Knowledge
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto shadow-black/50 drop-shadow-md">
            Challenge yourself with curated quizzes across various subjects and
            elevate your learning journey
          </p>

          {/* Search Bar - Preserved but commented out as per original
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
          */}
        </div>
      </div>
    </div>
  );
};
