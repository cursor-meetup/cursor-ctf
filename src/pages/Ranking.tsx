import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rankingService, RankingItem } from '../services/RankingService';
import { authService } from '../services/AuthService';
import { RealtimeChannel } from '@supabase/supabase-js';

const Ranking: React.FC = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [userRanking, setUserRanking] = useState<RankingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    let rankingSubscription: RealtimeChannel;

    const validateAndFetchRankings = async () => {
      try {
        // 验证会话有效性
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const isValidSession = await authService.validateSession();
        if (!isValidSession) {
          navigate('/login');
          return;
        }

        setLoading(true);
        setError('');

        // 获取排行榜数据
        const rankingsData = await rankingService.getRankings();
        setRankings(rankingsData);

        // 如果用户已登录，获取用户排名
        if (currentUser) {
          const userRankingData = await rankingService.getUserRanking(currentUser);
          setUserRanking(userRankingData);
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
            // 如果是授权相关错误，跳转到登录页面
            if (err?.code === 'PGRST301' || err?.message?.includes('JWT')) {
              authService.logout();
              navigate('/login');
            }
          }
        });
      } catch (err: any) {
        console.error('获取排行榜失败:', err);
        // 如果是授权相关错误，跳转到登录页面
        if (err?.code === 'PGRST301' || err?.message?.includes('JWT')) {
          authService.logout();
          navigate('/login');
          return;
        }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">排行榜</h1>

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
    </div>
  );
};

export default Ranking; 