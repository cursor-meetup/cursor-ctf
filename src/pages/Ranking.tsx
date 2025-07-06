import React, { useState, useEffect } from "react";

interface UnlockedFlag {
  key: string;
  points: number;
  timestamp: number;
}

const topRankers = [
  { rank: 1, username: "cyber_master", score: 950, isMe: false },
  { rank: 2, username: "hacker_pro", score: 880, isMe: false },
  { rank: 3, username: "sec_expert", score: 750, isMe: false },
  { rank: 4, username: "code_ninja", score: 640, isMe: false },
];

const Ranking = () => {
  const [myScore, setMyScore] = useState(0);
  const [myRank, setMyRank] = useState(0);
  const [username, setUsername] = useState("未登录用户");

  useEffect(() => {
    // 从 localStorage 读取用户名和已解锁的 flags
    const storedUsername = localStorage.getItem("username");
    const storedFlags = localStorage.getItem("unlockedFlags");
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    if (storedFlags) {
      const unlockedFlags: UnlockedFlag[] = JSON.parse(storedFlags);
      // 计算总积分
      const totalPoints = unlockedFlags.reduce((acc, flag) => acc + flag.points, 0);
      setMyScore(totalPoints);

      // 计算排名
      const allScores = [...topRankers.map(r => r.score), totalPoints].sort((a, b) => b - a);
      const rank = allScores.indexOf(totalPoints) + 1;
      setMyRank(rank);
    }
  }, []);

  // 动态生成完整的排行榜数据
  const fullRankingList = [...topRankers];
  if (myScore > 0 && !topRankers.some(r => r.score === myScore)) {
    fullRankingList.push({
      rank: myRank,
      username: username,
      score: myScore,
      isMe: true
    });
    fullRankingList.sort((a, b) => b.score - a.score);
    fullRankingList.forEach((player, index) => {
      player.rank = index + 1;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">排行榜</h1>
          <p className="text-gray-600">查看你的排名和积分情况</p>
        </div>
        
        {/* 我的排名卡片 */}
        <div className="bg-black text-white rounded-2xl p-6 mb-6 text-center">
          <div className="text-sm text-gray-300 mb-2">我的排名</div>
          <div className="text-4xl font-bold mb-3">#{myRank || '-'}</div>
          <div className="text-lg mb-1">{username}</div>
          <div className="text-2xl font-semibold">{myScore} 分</div>
        </div>
        
        {/* 排行榜列表 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">排行榜</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {fullRankingList.map((player) => (
              <div 
                key={player.username} 
                className={`px-6 py-4 flex items-center justify-between ${
                  player.isMe ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    player.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                    player.rank === 2 ? "bg-gray-100 text-gray-800" :
                    player.rank === 3 ? "bg-orange-100 text-orange-800" :
                    "bg-gray-50 text-gray-600"
                  }`}>
                    {player.rank}
                  </div>
                  <div>
                    <div className={`font-medium ${player.isMe ? "text-black" : "text-gray-900"}`}>
                      {player.username}
                      {player.isMe && <span className="ml-2 text-xs text-gray-500">(我)</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{player.score}</div>
                  <div className="text-xs text-gray-500">分</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            继续寻找 Flag，提升排名！
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ranking; 