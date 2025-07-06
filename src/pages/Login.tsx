import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (username: string, password: string, isLogin: boolean) => {
    // TODO: 登录/注册逻辑
    localStorage.setItem("isLogin", "true"); // 设置登录态
    localStorage.setItem("username", username); // 保存用户名
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? "登录" : "注册"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "欢迎回来，请登录您的账户" : "创建新账户以开始使用"}
          </p>
        </div>
        
        <LoginForm
          onSubmit={handleSubmit}
          isLogin={isLogin}
          toggleMode={() => setIsLogin(!isLogin)}
        />
      </div>
    </div>
  );
};

export default Login; 