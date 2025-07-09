import React, { useState } from "react";
import MeteorBackground from "../components/MeteorBackground";

const Venue = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 pb-20 relative">
      {/* 流星雨背景 */}
      <MeteorBackground />
      
      <div className="max-w-md mx-auto relative">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">入场指引</h1>
          <p className="text-gray-600">欢迎每一位Cursor Meetup Hangzhou的参与者</p>
        </div>
        
        {/* 场地信息卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="w-full rounded-xl overflow-hidden mb-4">
            <a 
              href="https://www.amap.com/place/B0FFKZFTVG"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity duration-200"
            >
                <img 
                  src="https://restapi.amap.com/v3/staticmap?location=120.005060,30.292772&zoom=17&size=750*400&markers=mid,,A:120.005060,30.292772&key=009dbec2a6e19d47163882e3f1a61541"
                  alt="场地位置地图 - 杭州梦想小镇互联网村21幢"
                  className="w-full h-auto object-cover cursor-pointer"
                  style={{ aspectRatio: "750/400" }}
                />
            </a>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cursor Meetup Hangzhou场地</h3>
              <p className="text-gray-600">地址：杭州市余杭区梦想小镇互联网村21幢</p>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">容量：</span>
                  <span className="font-medium">500人</span>
                </div>
                <div>
                  <span className="text-gray-500">状态：</span>
                  <span className="font-medium text-green-600">可用</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 功能按钮 */}
        <div className="space-y-3">
          <button 
            onClick={handleShowDetails}
            className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            {showDetails ? '收起路线指引' : '查看路线指引'}
          </button>
          {/* <button className="w-full py-3 bg-white text-black font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200">
            预订场地
          </button> */}
        </div>

        {/* 详细信息展示区域 */}
        {showDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100 animate-fade-in">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">地图引导</h3>
              <p className="text-gray-600 text-sm">详细的入场路线指引</p>
            </div>
            
            <div className="w-full rounded-xl overflow-hidden">
              <img 
                src="./src/assets/venue2.jpg"
                alt="入场路线地图引导"
                className="w-full h-auto object-cover"
              />
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">入场提示：</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 从地铁站出发，按照图中路线指引前往</li>
                <li>• 注意查看建筑标识和门牌号</li>

              </ul>
            </div>
          </div>
        )}

        {/* 活动时间表 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">今日活动时间表</h3>
            <p className="text-gray-600 text-sm">Cursor Meetup Hangzhou 完整议程</p>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-gray-700">13:30</div>
              <div className="flex-1 text-sm text-gray-800">签到</div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-blue-700">14:00-14:10</div>
              <div className="flex-1 text-sm text-gray-800">开场</div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-green-700">14:10-14:25</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">Ray</div>
                <div>Startup at 14: How Cursor Became My AI Co-Founder</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-purple-700">14:25-14:55</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">官方连线</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-green-700">14:55-15:10</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">覃貌Tim</div>
                <div>用Cursor突破无代码工具的天花板</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-green-700">15:10-15:25</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">白袍</div>
                <div>Everything is about Html manipulation - experience of content producing with cursor/内容生产本质上就是 HTML 操作 —— 结合 Cursor 的实际使用经</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-yellow-700">15:25-15:55</div>
              <div className="flex-1 text-sm text-gray-800">集体合影&茶歇</div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-green-700">15:55-16:10</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">负一</div>
                <div>用Cursor写脱口秀</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-green-700">16:10-16:25</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">SHINJI</div>
                <div>不会写一行代码的产品经理，如何用Cursor搭建一个短视频全链路创作网站</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-green-700">16:25-16:40</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">Zy</div>
                <div>Vibe Coding, or Vibe over Coding？使用Cursor 的一些思考</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-green-700">16:40-16:55</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">DH</div>
                <div>用cursor搓出一款日活过万的旅行产品</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-orange-700">16:55-17:25</div>
              <div className="flex-1 text-sm text-gray-800">抽奖 & 自由讨论</div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg">
              <div className="flex-shrink-0 w-20 text-sm font-medium text-pink-700">17:25-18:00</div>
              <div className="flex-1 text-sm text-gray-800">自由 Networking 时间 & 离场</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venue; 