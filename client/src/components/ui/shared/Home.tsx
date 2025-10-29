import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="p-16 flex flex-col items-center justify-center gap-4 ">
      <span>Platform Under development</span>

      <div className="fle">
        <p>
          <Link to="/auth/signup" className="hover:text-(--primary)">
            Sign Up
          </Link>
        </p>
        <p>
          <Link to="auth/signin" className="hover:text-(--primary)">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
