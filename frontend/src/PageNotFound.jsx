import React from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-5">
        <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Page Not Found
        </h2>
        <p className="text-slate-400 text-sm">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
