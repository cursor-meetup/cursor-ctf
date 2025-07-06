import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Venue from "./pages/Venue";
import Gallery from "./pages/Gallery";
import Ranking from "./pages/Ranking";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div >
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/" element={<Home />} />
        <Route path="/venue" element={<Venue />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App; 