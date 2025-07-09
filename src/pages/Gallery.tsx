import React from "react";
import MeteorBackground from "../components/MeteorBackground";

const projects = [
  {
    title: "梦想记录平台",
    subtitle: "记录分享探索梦想的创新平台",
    description: "把每一个梦想都变成一个独特的故事，把全世界的梦想家联系起来。Cursor1H黑客松获奖作品",
    url: "http://47.83.178.124:3000/",
    category: "黑客松获奖作品"
  },
  {
    title: "Elasticsearch查询构建器",
    subtitle: "支持JSON格式数据查询的Web应用",
    description: "允许用户轻松创建JSON格式的数据查询，支持条件管理、查询持久化、搜索、导入/导出、多语言和主题切换",
    url: "https://oktaykcr.github.io/elasticsearch-query-builder/",
    category: "完全使用Cursor AI开发"
  },
  {
    title: "AI应用规划助手",
    subtitle: "从零开始规划新应用的智能工具",
    description: "帮助用户从零开始规划新应用，或在现有代码库基础上完善功能。AI通过提问澄清设计决策，最终生成逐步的实现计划",
    url: "https://useprd.com/",
    category: "AI辅助开发工具"
  },
  {
    title: "硬盘价格比较器",
    subtitle: "亚马逊最佳硬盘价格查找工具",
    description: "帮助用户在亚马逊上查找最佳硬盘和存储设备价格的工具，前端采用Next.js，后端切换至.NET",
    url: "https://pricepergig.com/",
    category: "Cursor AI构建MVP"
  },
  {
    title: "角色化记录App",
    subtitle: "创新型家庭生活记录应用",
    description: "以角色化记录为核心的创新型应用，全方位覆盖家庭成员的生活记录需求，文科生利用cursor从零开发",
    url: "https://niu.sspai.com/post/100782",
    category: "文科生开发实记"
  },

];

const Gallery = () => {
  const handleProjectClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 pb-20 relative">
      {/* 流星雨背景 */}
      <MeteorBackground />

       
        
      
      <div className="max-w-4xl mx-auto relative">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">作品展示</h1>
          <p className="text-gray-600">Cursor AI创造的精彩成果集锦</p>
        </div>

        {/* 底部统计 */}
        <div className=" text-center mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">创作成果</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
                <div className="text-sm text-gray-500">优秀作品</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-sm text-gray-500">Cursor开发</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">多领域</div>
                <div className="text-sm text-gray-500">应用场景</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 作品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
              onClick={() => handleProjectClick(project.url)}
            >
              {/* 预览区域 */}
              <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                <iframe
                  src={project.url}
                  className="w-full h-full scale-50 origin-top-left transform"
                  style={{ width: '200%', height: '200%' }}
                  sandbox="allow-scripts allow-same-origin"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                    点击访问
                  </div>
                </div>
              </div>
              
              {/* 内容区域 */}
              <div className="p-5">
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  {project.subtitle}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
       
      </div>
    </div>
  );
};

export default Gallery; 