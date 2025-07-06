import React from "react";
import MeteorBackground from "../components/MeteorBackground";

const Venue = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 relative">
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
          <button className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200">
            查看详细信息
          </button>
          {/* <button className="w-full py-3 bg-white text-black font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200">
            预订场地
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Venue; 