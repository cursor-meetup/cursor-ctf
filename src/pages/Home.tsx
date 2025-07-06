import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import InputDialog from '../components/InputDialog';
import flagConfig from '../config/flag.json';
import { supabase } from '../config/supabase';

interface UnlockedFlag {
  flag_key: string;
  points: number;
  unlocked_at: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedFlags, setUnlockedFlags] = useState<UnlockedFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const username = authService.getCurrentUser();

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    // 加载用户数据
    loadUserData();
  }, [username, navigate]);

  const loadUserData = async () => {
    try {
      // 获取用户总分
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_score')
        .eq('username', username)
        .single();

      if (userError) throw userError;
      setTotalPoints(userData.total_score);

      // 获取已解锁的 flags
      const { data: flagsData, error: flagsError } = await supabase
        .from('user_flags')
        .select('flag_key, points, created_at')
        .eq('username', username);

      if (flagsError) throw flagsError;

      setUnlockedFlags(
        flagsData.map(item => ({
          flag_key: item.flag_key,
          points: item.points,
          unlocked_at: item.created_at,
        }))
      );
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 查找对应的 flag
      const foundFlag = flagConfig.flags.find(flag => flag.key === input);
      
      if (foundFlag) {
        // 检查是否已经解锁
        const { data: existingFlag, error: checkError } = await supabase
          .from('user_flags')
          .select('flag_key')
          .eq('username', username)
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
          p_username: username,
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
    } catch (error) {
      console.error('提交 flag 失败:', error);
      setResult("提交失败，请重试");
    } finally {
      setLoading(false);
      setShowDialog(true);
      setInput("");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 退出登录按钮 */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
        >
          退出登录
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursor Meetup Hangzhou</h1>
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
              className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '验证中...' : '提交验证'}
            </button>
          </form>
          
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
              <div className="space-y-2">
                {unlockedFlags.map((flag, index) => (
                  <div key={flag.flag_key} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Flag #{index + 1}</span>
                      <span className="text-green-600">+{flag.points} 分</span>
                    </div>
                    <div className="text-sm text-gray-500">
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
      </div>
    </div>
  );
};

export default Home; 