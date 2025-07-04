import React, { useState } from "react";

interface LoginFormProps {
  onSubmit: (username: string, password: string, isLogin: boolean) => void;
  isLogin: boolean;
  toggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLogin, toggleMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password, isLogin);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors duration-200 bg-white"
            placeholder="用户名"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors duration-200 bg-white"
            placeholder="密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg"
        >
          {isLogin ? "登录" : "注册"}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {isLogin ? "没有账号？" : "已有账号？"}
          <button 
            type="button" 
            className="ml-2 text-black font-medium hover:underline transition-all duration-200" 
            onClick={toggleMode}
          >
            {isLogin ? "立即注册" : "立即登录"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 