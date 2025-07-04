import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Venue from "./pages/Venue";
import Gallery from "./pages/Gallery";
import Ranking from "./pages/Ranking";
import BottomNav from "./components/BottomNav";

// 检查用户是否已登录
const isAuthenticated = () => {
  return localStorage.getItem("isLogin") === "true";
};

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// 应用主体组件
const AppContent = () => {
  const location = useLocation();
  const showBottomNav = isAuthenticated() && location.pathname !== "/login";

  return (
    <div className="pb-16 min-h-screen bg-white">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/venue" element={
          <ProtectedRoute>
            <Venue />
          </ProtectedRoute>
        } />
        <Route path="/gallery" element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        } />
        <Route path="/ranking" element={
          <ProtectedRoute>
            <Ranking />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App; 