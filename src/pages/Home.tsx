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
  const [input, setInput] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedFlags, setUnlockedFlags] = useState<UnlockedFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [username, setUsername] = useState<string>('');

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
        flagsData.map((item) => {
          const flagInfo = flagConfig.flags.find(
            (flag) => flag.key === item.flag_key
          );
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
      const foundFlag = flagConfig.flags.find((flag) => flag.key === input);

      if (foundFlag) {
        // 检查是否已经解锁
        const { data: existingFlag, error: checkError } = await supabase
          .from('user_flags')
          .select('flag_key')
          .eq('username', currentUser)
          .eq('flag_key', foundFlag.key)
          .single();

        if (existingFlag) {
          setResult('该 Flag 已经提交过了！');
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
          p_points: foundFlag.points,
        });

        if (updateError) throw updateError;

        // 重新加载用户数据
        await loadUserData();

        setResult(
          `恭喜！获得 ${foundFlag.points} 积分\n${foundFlag.description}`
        );
      } else {
        setResult('Flag 不正确，请重试');
      }
    } catch (error: any) {
      console.error('提交 flag 失败:', error);
      // 如果是授权相关错误，跳转到登录页面
      if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
        logout();
        navigate('/login');
        return;
      }
      setResult('提交失败，请重试');
    } finally {
      setLoading(false);
      setShowDialog(true);
      setInput('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
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
            {username && (
              <p className="text-xl text-gray-700 mb-2">
                Hi，{username} 欢迎来到
              </p>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cursor Meetup Nanjing
            </h1>
            <p className="text-gray-600">请输入正确的口令以继续</p>
            {totalPoints > 0 && (
              <p className="text-lg font-semibold text-black mt-4">
                当前积分: {totalPoints}
              </p>
            )}
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors duration-200 bg-white"
                placeholder="请输入口令/flag"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                input === 'njcursor2025' ? 'animate-pulse-scale' : ''
              }`}
            >
              {loading ? '验证中...' : '提交验证'}
            </button>
          </form>

          {/* 活动说明内容 */}
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              {/* <h2 className="text-xl font-bold text-gray-900 mb-4">活动说明</h2> */}
              <div className="text-gray-800 leading-relaxed space-y-6">
                {/* 主题与目标 */}
                <div>
                  <h3 className="text-lg font-bold text-center mb-3 text-red-600">
                    「让开发更高效，让创造更简单」
                  </h3>
                </div>

                {/* 互动任务 */}
                <div>
                  <h4 className="font-bold text-base mb-3 text-pink-600">
                    互动任务 & 贴纸/纪念币领取攻略
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      <span className="font-bold">❶</span> 在本页面
                      <span className="font-bold">注册账号</span>
                      参与抽奖活动和积分排名
                      <br />
                      <span className="text-blue-600 font-medium">
                        💙 输入正确的flag可以获取积分
                      </span>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-400">
                      <span className="font-bold">❷</span> 加入现场
                      <span className="font-bold">微信群</span>
                      ，参与交流获取微信群专属flag
                      <br />
                      <div className="flex justify-center mt-3 mb-3">
                        <img
                          src="https://jgn.oss-cn-beijing.aliyuncs.com/cursor/qun1.jpg"
                          alt="微信群二维码"
                          className="w-64 h-64 object-contain rounded-lg border border-gray-200 max-w-full"
                        />
                      </div>
                      <div className="text-xs text-gray-600 text-center mb-2">
                        如果微信群满请联系山鬼：
                      </div>
                      <div className="flex justify-center mb-3">
                        <img
                          src="https://jgn.oss-cn-beijing.aliyuncs.com/cursor/shanguiwx.jpg"
                          alt="山鬼微信二维码"
                          className="w-56 h-56 object-contain rounded-lg border border-gray-200 max-w-full"
                        />
                      </div>
                      <span className="text-indigo-600 font-medium">
                        💜 群内专属flag等你来发现
                      </span>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-400">
                      <span className="font-bold">❸</span> 社交平台分享任务：
                      <br />
                      <div className="text-sm mt-2 space-y-2">
                        <div>
                          • 转发公众号文章到
                          <span className="font-bold">朋友圈</span>
                          <br />
                          <a
                            href="https://mp.weixin.qq.com/s/Y8Huw2_zaOJ9i6qDW-ociw?scene=1&click_id=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-1 px-3 py-1 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors duration-200 text-xs"
                          >
                            公众号：南京首场 Cursor Meetup！
                          </a>
                        </div>
                        <div>
                          • 在 <span className="font-semibold">即刻</span> 或{' '}
                          <span className="font-semibold">小红书</span>{' '}
                          分享参会瞬间，并附带#CursorMeetupNanjing标签
                        </div>
                      </div>
                      <br />
                      <span className="text-sm text-gray-600 mb-1">
                        分享后截图并携带本次活动注册的用户名发送到现场群中，以便官方人员为您添加积分
                      </span>
                      <br />
                      <span className="text-pink-600 font-medium">
                        💖 完成任一平台分享可领取纪念币或贴纸
                      </span>
                      <br />
                      <span className="text-xs text-gray-500">
                        （每人限领一份，纪念币或贴纸，先到先得发完即止）
                      </span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                      <span className="font-bold">❹</span> 参与嘉宾现场
                      <span className="font-bold">Q&A问答</span>
                      <br />
                      <span className="text-orange-600 font-medium">
                        🧡 获取纪念币+贴纸双重奖励
                      </span>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg border-l-4 border-cyan-400">
                      <span className="font-bold">❺</span> 填写问卷任务：
                      <br />
                      <div className="text-sm mt-2 space-y-3">
                        <div>
                          • 在<span className="font-bold">15:00之前</span>
                          填写问题收集问卷
                          <br />
                          <span className="text-xs text-gray-600 mt-1">
                            有关于Cursor或者AI
                            Coding您最想了解的问题，我们会挑选总结部分问题现场为你解答
                          </span>
                          <br />
                          <a
                            href="https://aicoding.feishu.cn/share/base/form/shrcnN2Ngnhhj1bspWTet09Yzhh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-1 px-3 py-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors duration-200 text-xs"
                          >
                            📋 问题收集问卷
                          </a>
                        </div>
                        <div>
                          • 活动结束后填写反馈问卷
                          <br />
                          <span className="text-xs text-gray-600 mt-1">
                            活动结束后，提出您珍贵的意见，我们会做得更好
                          </span>
                          <br />
                          <a
                            href="https://aicoding.feishu.cn/share/base/form/shrcnbCDZRX43VsKGgmvxbyaUfh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-1 px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 text-xs"
                          >
                            💬 活动反馈问卷
                          </a>
                        </div>
                      </div>
                      <br />
                      <span className="text-cyan-600 font-medium">
                        💎 您的建议对我们十分重要！
                      </span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                      <span className="font-bold">❻</span>{' '}
                      嘉宾PPT/活动文案中寻找隐藏Flag
                      <br />
                      <span className="text-green-600 font-medium">
                        💚 纯小写英文或小写+数字组合
                      </span>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
                      <span className="font-bold">❼</span>{' '}
                      收集flag，积分排名前20可兑换纪念币，积分排名前3可兑换Cursor专属T恤！
                      <br />
                      <span className="text-purple-600 font-medium">
                        💜 Flag收集挑战，冲击前20名！
                      </span>
                    </div>
                  </div>
                </div>

                {/* 赠送flag */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-700 mb-3">
                    这里赠送大家一个Flag，复制后粘贴到上方的输入框中，即可获取积分。Have
                    fun！
                  </p>
                  <div className="bg-white p-3 rounded border border-dashed border-purple-300 text-center font-mono text-sm text-purple-700 mb-3">
                    njcursor2025
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard
                        .writeText('njcursor2025')
                        .then(() => {
                          setInput('njcursor2025');
                          alert('Flag已复制并填入输入框！');
                        })
                        .catch(() => {
                          alert('复制失败，请手动复制：njcursor2025');
                        });
                    }}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm"
                  >
                    复制Flag到输入框
                  </button>
                </div>
              </div>
            </div>
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
              <h2 className="text-lg font-semibold mb-2">
                已解锁的 Flags ({unlockedFlags.length})
              </h2>
              <div className="space-y-3">
                {unlockedFlags.map((flag, index) => (
                  <div
                    key={flag.flag_key}
                    className="bg-white p-4 rounded-lg shadow-sm border"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">
                        Flag #{index + 1}
                      </span>
                      <span className="text-green-600 font-semibold">
                        +{flag.points} 分
                      </span>
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
          result={{
            success: !result.includes('不正确') && !result.includes('已经提交'),
            message: result,
          }}
          onClose={() => setShowDialog(false)}
          onSubmit={() => {}} // 这里不需要处理提交，因为主要的提交逻辑在表单中
        />
      </div>
    </div>
  );
};

export default Home;
