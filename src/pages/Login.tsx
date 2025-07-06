import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 检查是否已登录
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 输入验证
  const validateInput = () => {
    if (!username.trim()) {
      setError('请输入用户名');
      return false;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return false;
    }
    if (password.length < 6) {
      setError('密码长度至少为6位');
      return false;
    }
    if (!isLoginMode && password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) {
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        await authService.login(username.trim(), password);
      } else {
        await authService.register(username.trim(), password);
      }
      
      // 调用上下文的 login 方法来更新全局状态
      login();
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* 背景图片层 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/cursor.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* 毛玻璃效果覆盖层 */}
      <div className="absolute inset-0 backdrop-blur-sm" />
      
      {/* 渐变遮罩层 */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-gray-100/50" /> */}

      {/* 主容器 */}
      <div className="relative w-full max-w-md z-10">
        {/* 标题区域 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Cursor Meetup Hangzhou
            </h1>
            <p className="text-gray-200 text-sm">
              {isLoginMode ? '登录您的账户' : '创建新账户'}
            </p>
          </div>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 用户名输入 */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white/70 backdrop-blur-sm"
                placeholder="输入用户名"
                disabled={loading}
              />
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white/70 backdrop-blur-sm"
                placeholder={isLoginMode ? "输入密码" : "输入至少6位密码"}
                disabled={loading}
              />
            </div>

            {/* 确认密码（仅注册时显示） */}
            {!isLoginMode && (
              <div className="space-y-2 animate-slide-down">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white/70 backdrop-blur-sm"
                  placeholder="再次输入密码"
                  disabled={loading}
                />
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl animate-shake">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black/90 text-white py-3 px-4 rounded-xl font-medium hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  处理中...
                </div>
              ) : (
                isLoginMode ? '登录' : '注册'
              )}
            </button>
          </form>

          {/* 模式切换 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLoginMode ? '还没有账户？' : '已有账户？'}
              <button
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError('');
                  setUsername('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="ml-1 text-black hover:text-gray-700 font-medium transition-colors duration-200"
              >
                {isLoginMode ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8 text-xs text-gray-100">
          © 2025 Cursor Meetup Hangzhou
        </div>
      </div>
    </div>
  );
};

export default Login; 