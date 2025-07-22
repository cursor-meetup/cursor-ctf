import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';
import InputDialog from '../components/InputDialog';
import MeteorBackground from '../components/MeteorBackground';
import flagConfig from '../config/flag.json';
import { supabase } from '../config/supabase';

interface UnlockedFlag {
  flag_key: string;
  points: number;
  unlocked_at: string;
  description: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [input, setInput] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [result, setResult] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedFlags, setUnlockedFlags] = useState<UnlockedFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // 从 localStorage 获取用户名
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const validateAndLoadData = async () => {
      try {
        // 如果用户已登录，验证会话有效性并加载数据
        if (currentUser) {
          const isValidSession = await authService.validateSession();
          if (!isValidSession) {
            logout();
            setSessionLoading(false);
            return;
          }
          // 加载用户数据
          await loadUserData();
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        logout();
      } finally {
        setSessionLoading(false);
      }
    };

    validateAndLoadData();
  }, [currentUser, logout, navigate]);

  const loadUserData = async () => {
    try {
      // 获取用户总分
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_score')
        .eq('username', currentUser)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          // 用户不存在，可能是会话过期
          logout();
          return;
        }
        throw userError;
      }
      setTotalPoints(userData.total_score);

      // 获取已解锁的 flags
      const { data: flagsData, error: flagsError } = await supabase
        .from('user_flags')
        .select('flag_key, points, unlocked_at')
        .eq('username', currentUser);

      if (flagsError) {
        throw flagsError;
      }

      setUnlockedFlags(
        flagsData.map(item => {
          const flagInfo = flagConfig.flags.find(flag => flag.key === item.flag_key);
          return {
            flag_key: item.flag_key,
            points: item.points,
            unlocked_at: item.unlocked_at,
            description: flagInfo?.description || '未知标志',
          };
        })
      );
    } catch (error: any) {
      console.error('加载用户数据失败:', error);
      // 如果是授权相关错误，清除登录状态
      if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
        logout();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 检查是否已登录
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // 查找对应的 flag
      const foundFlag = flagConfig.flags.find(flag => flag.key === input);
      
      if (foundFlag) {
        // 检查是否已经解锁
        const { data: existingFlag, error: checkError } = await supabase
          .from('user_flags')
          .select('flag_key')
          .eq('username', currentUser)
          .eq('flag_key', foundFlag.key)
          .single();

        if (existingFlag) {
          setResult("该 Flag 已经提交过了！");
          setShowDialog(true);
          return;
        }

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        // 解锁新的 flag
        const { error: updateError } = await supabase.rpc('unlock_flag', {
          p_username: currentUser,
          p_flag_key: foundFlag.key,
          p_points: foundFlag.points
        });

        if (updateError) throw updateError;

        // 重新加载用户数据
        await loadUserData();

        setResult(`恭喜！获得 ${foundFlag.points} 积分\n${foundFlag.description}`);
      } else {
        setResult("Flag 不正确，请重试");
      }
    } catch (error: any) {
      console.error('提交 flag 失败:', error);
      // 如果是授权相关错误，跳转到登录页面
      if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
        logout();
        navigate('/login');
        return;
      }
      setResult("提交失败，请重试");
    } finally {
      setLoading(false);
      setShowDialog(true);
      setInput("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCopyFlag = async () => {
    try {
      // 复制专属flag
      const specialFlag = 'hzcursor2025';
      await navigator.clipboard.writeText(specialFlag);
      alert('Flag已复制到剪贴板！快去首页输入框试试吧！');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制：hzcursor2025');
    }
    setShowActivityDialog(false);
    setInput('hzcursor2025');
  };

  // 如果正在验证会话，显示加载状态
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">验证登录状态...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 relative">
      {/* 流星雨背景 */}
      <MeteorBackground />
      
      {/* 登录/退出按钮 */}
      <div className="fixed top-4 right-4">
        {currentUser ? (
          <button
            onClick={handleLogout}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
          >
            退出登录
          </button>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
          >
            登录
          </button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6 pb-20">
        <div className="w-full max-w-md">
          {/* 标题 */}
          <div className="text-center mb-8">
            {username && <p className="text-xl text-gray-700 mb-2">Hi，{username} 欢迎来到</p>}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursor Meetup Nanjing</h1>
            <p className="text-gray-600">请输入正确的口令以继续</p>
            {totalPoints > 0 && <p className="text-lg font-semibold text-black mt-4">当前积分: {totalPoints}</p>}
          </div>
                
          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors duration-200 bg-white"
                placeholder="请输入口令/flag"
                value={input}
                onChange={e => setInput(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                input === 'hzcursor2025' ? 'animate-pulse-scale' : ''
              }`}
            >
              {loading ? '验证中...' : '提交验证'}
            </button>
          </form>

          {/* 活动说明按钮 */}
          <div className="mt-6">
            <button
              onClick={() => setShowActivityDialog(true)}
              className={`w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200 text-lg border-2 border-gray-200 ${
                (unlockedFlags.length === 0 && input !== 'hzcursor2025') ? 'animate-pulse-scale' : ''
              }`}
            >
              活动说明
            </button>
          </div>
          
          {/* 提示信息 */}
          <div className="mt-8 mb-8 text-center">
            <p className="text-sm text-gray-500">
              提示: 享受Meetup的过程，答案就在其中
            </p>
          </div>

          {/* 已解锁的 Flags */}
          {unlockedFlags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-2">已解锁的 Flags ({unlockedFlags.length})</h2>
              <div className="space-y-3">
                {unlockedFlags.map((flag, index) => (
                  <div key={flag.flag_key} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">Flag #{index + 1}</span>
                      <span className="text-green-600 font-semibold">+{flag.points} 分</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      {flag.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(flag.unlocked_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <InputDialog
          open={showDialog}
          result={{ success: !result.includes("不正确") && !result.includes("已经提交"), message: result }}
          onClose={() => setShowDialog(false)}
          onSubmit={() => {}} // 这里不需要处理提交，因为主要的提交逻辑在表单中
        />

        {/* 活动说明弹窗 */}
        {showActivityDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">活动说明</h2>
                  <button
                    onClick={() => setShowActivityDialog(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                {/* 活动说明内容区域 */}
                <div className="min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="text-gray-800 leading-relaxed space-y-8">
                    {/* 主题与目标 */}
                    <div>
                      <h3 className="text-xl font-bold text-center mb-4 text-red-600">「让开发更高效，让创造更简单」</h3>
                      <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400 mb-2">
                        <p className="font-bold text-lg mb-2">活动核心目标：</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                          <li>建立参会者与 <span className="font-semibold text-black">Cursor 社区</span> 之间的深层连接，增强归属感</li>
                          <li>80% 以上参会者加入微信群等线上社区并保持活跃</li>
                          <li>收集产品反馈与新功能建议</li>
                        </ul>
                      </div>
                    </div>
                    {/* 活动议程 */}
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-purple-700">活动议程（8月9日 14:00-18:00）</h4>
                      <div className="bg-purple-50 p-3 rounded-lg text-sm text-gray-700">
                        <ul className="list-disc pl-6 space-y-1">
                          <li>开场 & 社区介绍</li>
                          <li>嘉宾主题分享：<span className="font-semibold">大模型开发者生态、MCP工具、AI项目实战、认知心理学AI成长系统</span> 等</li>
                          <li>官方神秘环节</li>
                          <li>互动交流 & Q&A</li>
                          <li>积分排名与福利兑换</li>
                        </ul>
                      </div>
                    </div>
                    {/* 互动与连接策略 */}
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-pink-600">互动任务 & 贴纸/纪念币领取攻略</h4>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border-l-4 border-pink-400">
                          <span className="font-bold">❶</span> 转发报名公众号文章到朋友圈<br/>
                          <span className="text-pink-600 font-medium">💖 领取1款限量贴纸</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-400">
                          <span className="font-bold">❷</span> 在 <span className="font-semibold">X (Twitter)</span> 或 <span className="font-semibold">小红书</span> 分享参会瞬间<br/>
                          <span className="text-yellow-600 font-medium">💛 每个平台可领取1款贴纸</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
                          <span className="font-bold">❸</span> 嘉宾Q&A环节积极互动<br/>
                          <span className="text-green-600 font-medium">💚 领取1款限量贴纸</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400">
                          <span className="font-bold">❹</span> 收集flag，积分排名前20可兑换纪念币<br/>
                          <span className="text-purple-600 font-medium">💜 Flag收集挑战，冲击前20名！</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm">
                          <span className="font-semibold">Flag活动细则：</span>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>注册账号参与，账号仅用于活动统计</li>
                            <li>分享后在群里备注账号名自动获取30积分</li>
                            <li>嘉宾PPT/活动文案中可能藏有flag，纯小写英文或小写+数字</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* 现场福利 */}
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-green-700">现场福利</h4>
                      <div className="bg-green-50 p-4 rounded-lg text-gray-800">
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Cursor 官方限量 T 恤</li>
                          <li>Cursor 冰淇淋 & 茶歇甜点</li>
                          <li>Cursor Coin、Cursor Card、超好看贴纸套装</li>
                          <li>讲师原版 PPT</li>
                        </ul>
                      </div>
                    </div>
                    {/* 赠送flag */}
                    <div className="bg-purple-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700 mb-2">这里赠送大家一个Flag，复制后粘贴到首页的输入框中，即可获取积分。Have fun！</p>
                      <div className="bg-white p-2 rounded border border-dashed border-purple-300 text-center font-mono text-sm text-purple-700">
                        hzcursor2025
                      </div>
                    </div>
                  </div>
                </div>
                {/* 底部按钮 */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowActivityDialog(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    关闭弹窗
                  </button>
                  <button
                    onClick={handleCopyFlag}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    复制flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 