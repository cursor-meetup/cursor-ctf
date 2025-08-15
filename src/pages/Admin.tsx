import React, { useState } from 'react';
import { adminService } from '../services/AdminService';
import MeteorBackground from '../components/MeteorBackground';

const Admin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [flagKey, setFlagKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [availableFlags] = useState(adminService.getAllFlags());

  const handleAddFlag = async () => {
    if (!username.trim() || !flagKey.trim()) {
      showMessage('请输入用户名和flag key', 'error');
      return;
    }

    try {
      setLoading(true);
      await adminService.addFlagToUser(username.trim(), flagKey.trim());
      
      setUsername('');
      setFlagKey('');
      showMessage(`成功为用户 ${username.trim()} 添加 flag: ${flagKey.trim()}`, 'success');
    } catch (error: any) {
      console.error('添加flag失败:', error);
      showMessage(error.message || '添加flag失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (key: string) => {
    setFlagKey(key);
    showMessage(`已选择 ${key}`, 'success');
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden pb-safe">
      <MeteorBackground />
      
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          管理员面板
        </h1>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-500 bg-opacity-20 border border-green-500' 
              : 'bg-red-500 bg-opacity-20 border border-red-500'
          }`}>
            {message}
          </div>
        )}

        {/* 主要操作区域 */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6 text-center">为用户添加 Flag</h2>
          
          <div className="space-y-6">
            {/* 用户名输入 */}
            <div>
              <label className="block text-sm font-medium mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Flag Key输入 */}
            <div>
              <label className="block text-sm font-medium mb-2">Flag Key</label>
              <input
                type="text"
                value={flagKey}
                onChange={(e) => setFlagKey(e.target.value)}
                placeholder="请输入 flag key..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFlag()}
              />
            </div>

            {/* 快速导入按钮 */}
            <div>
              <label className="block text-sm font-medium mb-2">快速选择</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleQuickSelect('xiaohongshu007')}
                  className="px-4 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-lg transition-all duration-200 font-medium text-center"
                >
                  📱 小红书分享达人 (30分)
                </button>
                <button
                  onClick={() => handleQuickSelect('jike006')}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-all duration-200 font-medium text-center"
                >
                  📱 即刻分享之星 (30分)
                </button>
                <button
                  onClick={() => handleQuickSelect('share007')}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-200 font-medium text-center"
                >
                  🐦 推特分享之星 (30分)
                </button>
                <button
                  onClick={() => handleQuickSelect('wechatshare008')}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg transition-all duration-200 font-medium text-center"
                >
                  💬 朋友圈分享达人 (30分)
                </button>
              </div>
            </div>

            {/* 添加按钮 */}
            <button
              onClick={handleAddFlag}
              disabled={loading || !username.trim() || !flagKey.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
            >
              {loading ? '添加中...' : '添加 Flag'}
            </button>
          </div>

          {/* 可用Flag列表 */}
          <div className="mt-8">
            <details className="group">
              <summary className="cursor-pointer text-lg font-medium mb-4 hover:text-purple-300 transition-colors">
                {/* <span className="group-open:rotate-90 inline-block transition-transform">▶</span> */}
                查看所有可用的 Flag Keys
              </summary>
              <div className="bg-gray-700 rounded-lg p-4 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableFlags.map((flag) => (
                    <div 
                      key={flag.key} 
                      className="flex justify-between items-center p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                      onClick={() => setFlagKey(flag.key)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-purple-300">{flag.key}</div>
                        <div className="text-sm text-gray-300 truncate">{flag.description}</div>
                      </div>
                      <div className="text-yellow-400 font-bold ml-2">{flag.points}分</div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;