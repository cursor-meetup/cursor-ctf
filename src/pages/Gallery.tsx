import React from "react";

const images = [
  { placeholder: "比赛现场", description: "激烈的比赛氛围" },
  { placeholder: "获奖时刻", description: "荣誉的见证" },
  { placeholder: "团队合作", description: "协作的力量" },
  { placeholder: "技术展示", description: "创新的成果" },
  { placeholder: "颁奖典礼", description: "成功的喜悦" },
  { placeholder: "闭幕仪式", description: "圆满的结束" },
];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">精彩展示</h1>
          <p className="text-gray-600">记录比赛中的精彩瞬间</p>
        </div>
        
        {/* 图片网格 */}
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100"
            >
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-1">🖼️</div>
                  <span className="text-xs">{img.placeholder}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600 text-center">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            点击查看大图 • 更多精彩内容即将上线
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gallery; 