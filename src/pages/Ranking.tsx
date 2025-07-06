import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rankingService, RankingItem } from '../services/RankingService';
import { authService } from '../services/AuthService';
import { RealtimeChannel } from '@supabase/supabase-js';
import MeteorBackground from '../components/MeteorBackground';
import { supabase } from '../config/supabase';

const Ranking: React.FC = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [userRanking, setUserRanking] = useState<RankingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showPrizeDialog, setShowPrizeDialog] = useState(false);
  const [prizePassword, setPrizePassword] = useState('');
  const [prizeLoading, setPrizeLoading] = useState(false);
  const [prizeError, setPrizeError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentUser = authService.getCurrentUser();

  // 检查是否满足领奖条件
  const checkPrizeEligibility = () => {
    if (!userRanking) return false;
    
    // 检查当前时间是否在17:00之后
    const currentHour = currentTime.getHours();
    const isAfter17 = currentHour >= 17;
    
    // 检查排名是否在前20
    const isTop20 = userRanking.rank <= 20;
    
    return isAfter17 && isTop20;
  };

  // 获取领奖按钮的状态和文本
  const getPrizeButtonState = () => {
    if (!userRanking) return { disabled: true, text: '获取排名中...', className: 'bg-gray-400 cursor-not-allowed' };
    
    // 已经领取过奖励
    if (userRanking.has_claimed_prize) {
      return { disabled: true, text: '已领取奖励', className: 'bg-gray-400 cursor-not-allowed' };
    }
    
    const currentHour = currentTime.getHours();
    const isAfter17 = currentHour >= 17;
    const isTop20 = userRanking.rank <= 20;
    
    // 时间未到17:00
    if (!isAfter17) {
      return { disabled: true, text: `🕒 17:00后开放领取`, className: 'bg-gray-400 cursor-not-allowed' };
    }
    
    // 排名不在前20
    if (!isTop20) {
      return { disabled: true, text: '仅限前20名领取', className: 'bg-gray-400 cursor-not-allowed' };
    }
    
    // 满足条件，可以领取
    return { disabled: false, text: '🎁 领取奖励', className: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg' };
  };

  // 定期更新时间，以便按钮状态能够实时更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let rankingSubscription: RealtimeChannel;

    const validateAndFetchRankings = async () => {
      try {
        setLoading(true);
        setError('');

        // 如果用户已登录，验证会话有效性
        if (currentUser) {
          const isValidSession = await authService.validateSession();
          if (!isValidSession) {
            authService.logout();
            // 不强制跳转，让用户继续浏览排行榜
          }
        }

        // 获取排行榜数据
        const rankingsData = await rankingService.getRankings();
        setRankings(rankingsData);

        // 如果用户已登录，获取用户排名
        if (currentUser) {
          try {
            const userRankingData = await rankingService.getUserRanking(currentUser);
            setUserRanking(userRankingData);
          } catch (err: any) {
            console.error('获取用户排名失败:', err);
            // 如果是授权相关错误，清除登录状态
            if (err?.code === 'PGRST301' || err?.message?.includes('JWT')) {
              authService.logout();
            }
          }
        }

        // 订阅排行榜更新
        rankingSubscription = rankingService.subscribeToRankingUpdates(async () => {
          try {
            const updatedRankings = await rankingService.getRankings();
            setRankings(updatedRankings);

            if (currentUser) {
              const updatedUserRanking = await rankingService.getUserRanking(currentUser);
              setUserRanking(updatedUserRanking);
            }
          } catch (err: any) {
            console.error('更新排行榜失败:', err);
            // 如果是授权相关错误，清除登录状态
            if (err?.code === 'PGRST301' || err?.message?.includes('JWT')) {
              authService.logout();
            }
          }
        });
      } catch (err: any) {
        console.error('获取排行榜失败:', err);
        setError('获取排行榜数据失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };

    validateAndFetchRankings();

    // 清理订阅
    return () => {
      if (rankingSubscription) {
        rankingSubscription.unsubscribe();
      }
    };
  }, [currentUser, navigate]);

  const handleClaimPrize = async () => {
    if (!currentUser) {
      setPrizeError('请先登录');
      return;
    }

    if (!prizePassword.trim()) {
      setPrizeError('请输入密码');
      return;
    }

    // 检查是否满足领奖条件
    if (!checkPrizeEligibility()) {
      setPrizeError('您还不满足领奖条件');
      return;
    }

    setPrizeLoading(true);
    setPrizeError('');

    try {
      // 验证密码
      const correctPassword = '0000';
      if (prizePassword !== correctPassword) {
        setPrizeError('密码错误');
        setPrizeLoading(false);
        return;
      }

      // 检查用户是否已经领取过奖励
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('has_claimed_prize')
        .eq('username', currentUser)
        .single();

      if (userError) {
        throw userError;
      }

      if (userData.has_claimed_prize) {
        setPrizeError('您已经领取过奖励了');
        setPrizeLoading(false);
        return;
      }

      // 更新用户奖励状态
      const { error: updateError } = await supabase
        .from('users')
        .update({ has_claimed_prize: true })
        .eq('username', currentUser);

      if (updateError) {
        throw updateError;
      }

      // 刷新用户排名数据
      if (currentUser) {
        const updatedUserRanking = await rankingService.getUserRanking(currentUser);
        setUserRanking(updatedUserRanking);
      }

      // 关闭弹窗并显示成功提示
      setShowPrizeDialog(false);
      setPrizePassword('');
      alert('恭喜您！奖励领取成功！');
    } catch (error: any) {
      console.error('领取奖励失败:', error);
      setPrizeError('领取失败，请重试');
    } finally {
      setPrizeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">加载排行榜中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 relative">
      {/* 流星雨背景 */}
      <MeteorBackground />
      
      {/* 登录/退出按钮 */}
      <div className="absolute top-4 right-4">
        {currentUser ? (
          <button
            onClick={() => {
              authService.logout();
              navigate('/login');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
          >
            退出登录
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
          >
            登录
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">排行榜</h1>

        {/* 未登录提示 */}
        {!currentUser && (
          <div className="bg-black border border-gray-200 rounded-lg p-6 mb-8 text-center">
            <p className="text-2xl text-gray-100 mb-4">登录后查看您的排名和积分</p>
          </div>
        )}

        {/* 当前用户排名 */}
        {currentUser && userRanking && (
          <div className="bg-black shadow-lg rounded-lg p-6 mb-8">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-400">当前排名</p>
                <p className="text-2xl font-bold text-white">#{userRanking.rank}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">总分</p>
                <p className="text-2xl font-bold text-white">{userRanking.total_score}</p>
              </div>
            </div>
          </div>
        )}

        {/* 奖励领取按钮 */}
        {currentUser && userRanking && (
          <div className="mb-8">
            <button
              onClick={() => {
                if (!getPrizeButtonState().disabled) {
                  setShowPrizeDialog(true);
                }
              }}
              disabled={getPrizeButtonState().disabled}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${getPrizeButtonState().className}`}
            >
              {getPrizeButtonState().text}
            </button>
          </div>
        )}

        {/* 排行榜列表 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分数
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((item) => (
                <tr 
                  key={item.username}
                  className={currentUser === item.username ? 'bg-gray-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{item.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.username}
                    {currentUser === item.username && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        你
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.total_score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 奖励领取弹窗 */}
      {showPrizeDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">领取奖励</h3>
              <p className="text-gray-600">请输入密码以领取您的奖励</p>
            </div>

            <div className="mb-4">
              <input
                type="password"
                placeholder="请输入密码"
                value={prizePassword}
                onChange={(e) => setPrizePassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                disabled={prizeLoading}
              />
            </div>

            {prizeError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{prizeError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPrizeDialog(false);
                  setPrizePassword('');
                  setPrizeError('');
                }}
                disabled={prizeLoading}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                取消
              </button>
              <button
                onClick={handleClaimPrize}
                disabled={prizeLoading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200 disabled:opacity-50"
              >
                {prizeLoading ? '领取中...' : '确认领取'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranking; 