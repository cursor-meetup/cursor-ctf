import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navs = [
  { label: "首页", path: "/", icon: "🏠" },
  { label: "指引", path: "/venue", icon: "📍" },
  { label: "展示", path: "/gallery", icon: "🖼️" },
  { label: "排名", path: "/ranking", icon: "🏆" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    navigate("/login");
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
      {navs.map((nav) => (
        <button
          key={nav.path}
          onClick={() => navigate(nav.path)}
          className={`flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200 px-2 py-2 rounded-lg ${
            location.pathname === nav.path 
              ? "text-black bg-gray-100" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="text-lg mb-1">{nav.icon}</span>
          <span className="text-xs">{nav.label}</span>
        </button>
      ))}
      
      {/* 退出登录按钮 */}
      {/* <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center text-xs font-medium transition-colors duration-200 px-2 py-2 rounded-lg text-gray-500 hover:text-red-600"
      >
        <span className="text-lg mb-1">🚪</span>
        <span className="text-xs">退出</span>
      </button> */}
    </nav>
  );
};

export default BottomNav; 