import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';
import MeteorBackground from '../components/MeteorBackground';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 隐藏区域点击计数
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  // 检查是否已登录
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 处理隐藏区域点击
  const handleHiddenAreaClick = () => {
    // 清除之前的超时
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      // 连续点击3次，跳转到admin页面
      navigate('/admin');
      setClickCount(0);
      return;
    }

    // 设置2秒超时，如果2秒内没有继续点击，重置计数
    const timeout = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    setClickTimeout(timeout);
  };

  // 输入验证
  const validateInput = () => {
    if (!username.trim()) {
      setError('请输入用户名');
      return false;
    }
    if (username.trim().length > 11) {
      setError('用户名不能超过11个字符');
      return false;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return false;
    }
    if (password.length < 1) {
      setError('密码长度至少为1位');
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
      await authService.login(username.trim(), password);

      // 调用上下文的 login 方法来更新全局状态
      login();
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 pb-20 bg-gradient-to-br from-gray-100 to-gray-200">
      {/* 流星雨效果 */}
      <MeteorBackground />

      {/* 隐藏的左上角点击区域 */}
      <div
        onClick={handleHiddenAreaClick}
        className="absolute top-4 left-4 w-16 h-16 z-50 cursor-default opacity-0 hover:opacity-10 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        title={clickCount > 0 ? `点击次数: ${clickCount}/3` : ''}
      />

      {/* 主容器 */}
      <div className="relative w-full max-w-md z-10">
        {/* 标题区域 */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-float-title">
              Cursor Meetup Shanghai
            </h1>
            <p className="text-gray-700 text-sm">
              登录您的账户（新用户将自动注册）
            </p>
          </div>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 animate-slide-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 用户名输入 */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                用户名
              </label>
              <p className="text-xs text-gray-500">
                用户名用于积分排名，可以随意定义，不能和他人重复
              </p>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  maxLength={11}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="可以随意定义，不能和他人重复"
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                  {username.length}/11
                </div>
              </div>
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                密码
              </label>
              <p className="text-xs text-gray-500">
                活动结束后账号会自动注销，所以不需要设置复杂密码，自己能记住即可
              </p>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                placeholder="输入至少一位密码"
                disabled={loading}
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  处理中...
                </div>
              ) : (
                '登录 / 注册'
              )}
            </button>
          </form>

          {/* 说明文字 */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-sm text-gray-600">首次使用将自动创建账户</p>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8 text-xs text-gray-600">
          © 2025 Cursor Meetup Shanghaii
        </div>
      </div>
    </div>
  );
};

export default Login;
