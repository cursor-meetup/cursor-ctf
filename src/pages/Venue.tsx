import React, { useState } from 'react';
import MeteorBackground from '../components/MeteorBackground';

const Venue = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLumaSignIn = () => {
    // 这里先用一个示例链接，您可以稍后替换为实际的luma链接
    const lumaUrl = 'https://lu.ma/hsuzdjwv'; // 请替换为实际的luma链接
    window.open(lumaUrl, '_blank');
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
              <p className="text-gray-700 font-semibold">
                一定要！记得！请提前打开
              </p>
              <p className="text-gray-700 font-semibold text-xl">
                luma二维码签到
              </p>
              <p className="text-gray-700 font-semibold">以便顺利进入流程~</p>
            </div>

            {/* Luma签到按钮 */}
            <div className="mt-4">
              <button
                onClick={handleLumaSignIn}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span className="text-lg">📱</span>
                  <span>立即打开Luma签到</span>
                  <span className="text-sm">→</span>
                </span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                请使用默认浏览器打开
              </p>
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
              href="https://www.amap.com/place/B0FFGLCJNF"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity duration-200"
            >
              <img
                src="https://restapi.amap.com/v3/staticmap?location=121.605347,31.216252&zoom=17&size=750*400&markers=mid,,A:121.605347,31.216252&key=009dbec2a6e19d47163882e3f1a61541"
                alt="场地位置地图 - 上海市浦东新区浦东软件园郭守敬园-2号楼 2楼报告厅"
                className="w-full h-auto object-cover cursor-pointer"
                style={{ aspectRatio: '750/400' }}
              />
            </a>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cursor Meetup Shanghai场地
              </h3>
              <p className="text-gray-600">
                地址：上海市浦东新区浦东软件园郭守敬园-2号楼 2楼报告厅
              </p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">容量：</span>
                  <span className="font-medium">400人</span>
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
        {/* <div className="space-y-3 mb-4">
          <button
            onClick={handleShowDetails}
            className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            {showDetails ? '收起路线指引' : '查看路线指引'}
          </button>
        </div> */}

        {/* 详细信息展示区域 */}
        {showDetails && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border border-gray-100 animate-fade-in">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                地图引导
              </h3>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              8月16日活动议程
            </h3>
            <p className="text-gray-600 text-sm">
              Cursor Meetup Shanghai · 让开发更高效，让创造更简单
            </p>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-blue-700">
                13:00-13:30
              </div>
              <div className="flex-1 text-sm text-gray-800">
                签到入场，加入Meetup现场群，扫码签到+领取贴纸，项目体验
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-blue-700">
                13:30-14:00
              </div>
              <div className="flex-1 text-sm text-gray-800">
                签到入场，扫码签到，领取名牌贴纸
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-purple-700">
                14:20-14:30
              </div>
              <div className="flex-1 text-sm text-gray-800">
                开场致辞，AICoding团队介绍+上海站活动意义
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-green-700">
                14:30-15:30
              </div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">内容分享（上半场）</div>
                <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                  <li>
                    <strong>Calvin / AWS Startups</strong>：《非开发者的 Vibe
                    Coding 踩坑之路》
                    <br />
                    <span className="text-gray-500">
                      用"外行人"视角，告诉你在 Vibe Coding
                      旅程中容易掉的坑，以及如何绕过去。
                    </span>
                  </li>
                  <li>
                    <strong>陆彦达 / 飞书深诺研发总监</strong>：《V0 + Cursor
                    如何最快速度开发企业工具型项目》
                    <br />
                    <span className="text-gray-500">
                      实战拆解如何用 AI 工具链快速起盘，从 0 到 MVP
                      的全流程加速器。
                    </span>
                  </li>
                  <li>
                    <strong>好记星 / 前得物增长前端负责人</strong>：《玩转
                    Cursor Memories 打造带全局记忆的私人 Cursor》
                    <br />
                    <span className="text-gray-500">
                      深入魔改 Cursor，让它变成你的私人
                      Chatbot，并记住每一次对话的"前因后果"。
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-orange-700">
                15:30-15:50
              </div>
              <div className="flex-1 text-sm text-gray-800">
                抽奖环节 + 大合照 + 休息时间，下午茶自由交流
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-green-700">
                15:50-16:50
              </div>
              <div className="flex-1 text-sm text-gray-800">
                <div className="font-medium mb-1">内容分享（下半场）</div>
                <ul className="list-disc pl-5 text-xs text-gray-700 space-y-1">
                  <li>
                    <strong>孟健 / AI 畅销书作者</strong>：《Cursor + MCP
                    深度实践》
                    <br />
                    <span className="text-gray-500">
                      详解 MCP 协议的应用场景，让你的 AI 开发体验沉浸且高效。
                    </span>
                  </li>
                  <li>
                    <strong>黄巍 / Refly AI Founder & CEO</strong>：《从 Cursor
                    到全栈创作：AI Native 团队如何用 5 个人创造 4.2K stars
                    开源项目》
                    <br />
                    <span className="text-gray-500">
                      分享一个小团队如何用 AI 工具撬动巨大的产出与影响力。
                    </span>
                  </li>
                  <li>
                    <strong>魏知 / 金融科技公司 AI 企业转型项目负责人</strong>
                    ：《AI 时代的个人战略：如何在企业转型中找到职业新赛道》
                    <br />
                    <span className="text-gray-500">
                      帮你在行业巨变中找到自己的位置，抓住新机遇。
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-pink-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-pink-700">
                16:50-17:20
              </div>
              <div className="flex-1 text-sm text-gray-800">
                现场互动 Q&A 环节
                <br />
                <span className="text-gray-500">
                  10 个 QA 环节，开放提问，现场船新玩法保证过瘾！
                </span>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-700">
                17:20-18:00
              </div>
              <div className="flex-1 text-sm text-gray-800">
                自由交流+离场，开放1v1咨询，收集反馈问卷
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venue;
