import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RefreshHandler from "./RefreshHandler.jsx";
import GoogleLogin from "./GoogleLogin.jsx";
import Dashboard from "./Dashboard.jsx";
import PageNotFound from "./PageNotFound.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GithubCallback from "./GithubCallback.jsx";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("user-info"),
  );

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="1064767348894-ni78r69kq6p4tbp0tg6i4csm5iam8lam.apps.googleusercontent.com">
        <GoogleLogin setIsAuthenticated={setIsAuthenticated} />
      </GoogleOAuthProvider>
    );
  };

  const PrivateRoute = ({ element }) => {
    const isAuth = isAuthenticated || !!localStorage.getItem("user-info");
    return isAuth ? element : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/auth/github/callback" element={<GithubCallback setIsAuthenticated={setIsAuthenticated}/>}/>
        <Route path="/login" element={<GoogleAuthWrapper />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={<Dashboard setIsAuthenticated={setIsAuthenticated} />}
            />
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
