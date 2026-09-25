import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { githubAuth } from "./api";
import React, { useEffect, useState, useRef } from "react";

function GithubCallback({ setIsAuthenticated }){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const calledRef = useRef(false);

    useEffect(() => {
      // Prevent React StrictMode from sending the one-time code twice
      if (calledRef.current) return;
      calledRef.current = true;

      const processGithubAuth = async () => {
        //grabbing the code query parameter from the URL
        const code = searchParams.get("code");

        if (!code) {
          setErrorMsg("No authorization code found in URL.");
          return;
        }

        try {
          //calling the backend to exchange the code dor user info and JWT
          const result = await githubAuth(code);

          //saving to localStorage with the exact same structure as google auth
          if (result?.data.user && result?.data?.token) {
            const { email, name, image } = result.data.user;
            const token = result.data.token;
            const obj = { email, name, image, token };

            localStorage.setItem("user-info", JSON.stringify(obj));

            if (setIsAuthenticated) {
              setIsAuthenticated(true);
            }

            //sending the user to the protected dashboard

            navigate("/dashboard");
          } else {
            setErrorMsg("Failed tp retrieve user details from the server.");
          }
        } catch (error) {
          console.error("Github auth error:", error);
          setErrorMsg(
            error.response?.data?.message ||
              error.message ||
              "Failed to complete Github sign-in.",
          );
        }
      };

      processGithubAuth();
    },[navigate, searchParams, setIsAuthenticated]);
        return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        {errorMsg ? (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Authentication Failed</h2>
            <p className="text-slate-400 text-sm mb-6">{errorMsg}</p>
            <Link
              to="/login"
              className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* Spinning Loader */}
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-300 font-medium">Authenticating with GitHub...</p>
            <p className="text-slate-500 text-xs">Please wait while we log you in.</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default GithubCallback;
