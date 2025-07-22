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
        <div className="text-center mb-4">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">入场指引</h1> */}
          {/* <p className="text-gray-600">欢迎每一位Cursor Meetup Hangzhou的参与者</p> */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Hi，Dear</h2>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">一定要！记得！请提前打开</p>
              <p className="text-gray-700 font-semibold text-xl">luma二维码签到</p>
              <p className="text-gray-700 font-semibold">以便顺利进入流程~</p>
            </div>
          </div>
        </div>
        {/* 重要提示 */}
        {/* <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 mb-6 animate-pulse">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Hi，Dear</h2>
            <div className="space-y-2">
              <p className="text-gray-700 font-semibold">一定要！记得！请提前打开</p>
              <p className="text-gray-700 font-semibold text-xl">luma二维码签到</p>
              <p className="text-gray-700 font-semibold">以便顺利进入流程~</p>
            </div>
          </div>
        </div> */}
        
        {/* 场地信息卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="w-full rounded-xl overflow-hidden mb-4">
            <a 
              href="https://www.amap.com/place/B0J0UH5U3Y"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity duration-200"
            >
                <img 
                  src="https://restapi.amap.com/v3/staticmap?location=118.737533,31.980701&zoom=17&size=750*400&markers=mid,,A:118.737533,31.980701&key=f30d60f5b0afbfc41ca5864eba15a03f"
                  alt="场地位置地图 - 南京市建邺区白龙江东街9号金鱼嘴基金大厦15楼未来路演厅"
                  className="w-full h-auto object-cover cursor-pointer"
                  style={{ aspectRatio: "750/400" }}
                />
            </a>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cursor Meetup Nanjing场地</h3>
              <p className="text-gray-600">地址：南京市建邺区白龙江东街9号金鱼嘴基金大厦15楼未来路演厅</p>
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
        <div className="space-y-3 mb-4">
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
                <li>• 按照图中路线指引前往</li>
                <li>• 注意查看建筑标识和门牌号</li>

              </ul>
            </div>
          </div>
        )}

        {/* 活动时间表 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">今日活动时间表</h3>
            <p className="text-gray-600 text-sm">Cursor Meetup Nanjing 完整议程</p>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-blue-700">13:00-13:30</div>
              <div className="flex-1 text-sm text-gray-800">签到入场，加入Meetup现场群，扫码签到+领取贴纸，项目体验</div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-blue-700">13:30-14:00</div>
              <div className="flex-1 text-sm text-gray-800">签到入场，扫码签到+名牌贴纸+领取伴手礼，合影打卡区</div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-purple-700">14:20-14:30</div>
              <div className="flex-1 text-sm text-gray-800">开场致辞，AICoding团队介绍+南京站活动意义</div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-pink-700">14:30-15:00</div>
              <div className="flex-1 text-sm text-gray-800">官方Q&A & 神秘环节：Cursor官方分享</div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-yellow-700">15:00-15:10</div>
              <div className="flex-1 text-sm text-gray-800">合影留念</div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-green-700">15:10-16:10</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">内容分享（上半场）</div>
                <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                  <li>《建邺赋能：构筑大模型开发者成长新生态》</li>
                  <li>《自定义 MCP 工具加速软件开发》</li>
                  <li>《Cursor 赋能产品原型高效生成，提升需求对接转换率》</li>
                  <li>预留Q&A时间</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-orange-700">16:10-16:30</div>
              <div className="flex-1 text-sm text-gray-800">下午茶自由交流，项目展示，扫码加社群</div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-green-700">16:30-17:30</div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">内容分享（下半场）</div>
                <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                  <li>《用 Cursor 一站式完成 AI 项目从开发到部署：技巧与实践》</li>
                  <li>《基于认知心理学原理的 AI 自成长记忆系统》</li>
                  <li>预留Q&A时间</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-pink-700">17:30-18:00</div>
              <div className="flex-1 text-sm text-gray-800">自由交流+离场，开放1v1咨询，收集反馈问卷</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venue; 