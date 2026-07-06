import React from "react";

export const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.749_0.154_70.67)] to-purple-600 bg-clip-text text-transparent">
              BiTE
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Bitcoin High School. <br />
              Building the future, one block at a time.
            </p>
          </div>

          {/* <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-sm text-gray-600">
            <a
              href="https://bhs-ocr.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              AutoGrade
            </a>
          </div> */}
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Bitcoin High School. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};
