import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Venue from "./pages/Venue";
import Gallery from "./pages/Gallery";
import Ranking from "./pages/Ranking";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import { authService } from "./services/AuthService";

const App = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <div className="pb-16">
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
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
        {isAuthenticated && <BottomNav />}
      </div>
    </Router>
  );
};

export default App; 