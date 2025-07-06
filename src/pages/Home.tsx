import React, { useState, useEffect } from "react";
import InputDialog from "../components/InputDialog";
import flagConfig from "../config/flag.json";
import { rankingService } from "../services/RankingService";
// import { Dialog } from "@/components/ui/dialog"; // 预留shadcn弹窗

interface UnlockedFlag {
  flag_key: string;
  points: number;
  unlocked_at: string;
}

const Home = () => {
  const [input, setInput] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedFlags, setUnlockedFlags] = useState<UnlockedFlag[]>([]);
  const [username, setUsername] = useState<string>("");

  // 从本地存储加载用户名和已解锁的 flags
  useEffect(() => {
    const loadUserData = async () => {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
        
        try {
          // 获取用户排名信息
          const userRanking = await rankingService.getUserRanking(storedUsername);
          if (userRanking) {
            setTotalPoints(userRanking.total_score);
          }

          // 获取用户已解锁的 flags
          const flags = await rankingService.getUserFlags(storedUsername);
          const unlockedFlagDetails = flags.map(flagKey => {
            const flagInfo = flagConfig.flags.find(f => f.key === flagKey);
            return {
              flag_key: flagKey,
              points: flagInfo?.points || 0,
              unlocked_at: new Date().toISOString() // 这里可能需要从数据库获取实际解锁时间
            };
          });
          setUnlockedFlags(unlockedFlagDetails);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 查找对应的 flag
    const foundFlag = flagConfig.flags.find(flag => flag.key === input);
    
    if (foundFlag) {
      try {
        // 检查是否已经解锁
        const isUnlocked = await rankingService.checkFlagUnlocked(username, foundFlag.key);
        if (isUnlocked) {
          setResult("该 Flag 已经提交过了！");
          setShowDialog(true);
          return;
        }

        // 解锁新的 flag
        await rankingService.updateUserScore(username, foundFlag.key, foundFlag.points);
        
        // 更新本地状态
        const newUnlockedFlag: UnlockedFlag = {
          flag_key: foundFlag.key,
          points: foundFlag.points,
          unlocked_at: new Date().toISOString()
        };
        setUnlockedFlags([...unlockedFlags, newUnlockedFlag]);
        setTotalPoints(totalPoints + foundFlag.points);
        
        setResult(`恭喜！获得 ${foundFlag.points} 积分\n${foundFlag.description}`);
      } catch (error) {
        console.error('Error submitting flag:', error);
        setResult("提交失败，请重试");
      }
    } else {
      setResult("Flag 不正确，请重试");
    }
    setShowDialog(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-50">
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
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg"
          >
            提交验证
          </button>
        </form>
        
        {/* 提示信息 */}
        <div className="mt-8 mb-8 text-center">
          <p className="text-sm text-gray-500">
            提示: 享受Meetup的过程，答案就在其中
          </p>
        </div>

        {/* 已解锁的 Flags */}
        <div className="mb-8">
          {unlockedFlags.length > 0 && (
            <h2 className="text-lg font-semibold mb-2">已解锁的 Flags ({unlockedFlags.length})</h2>
          )}
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
      </div>
      
      <InputDialog open={showDialog} result={result} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default Home; 