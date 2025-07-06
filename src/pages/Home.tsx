import React, { useState } from "react";
import InputDialog from "../components/InputDialog";
// import { Dialog } from "@/components/ui/dialog"; // 预留shadcn弹窗

const Home = () => {
  const [input, setInput] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 调用后端接口校验
    if (input === "ctf2024") {
      setResult("匹配成功");
    } else {
      setResult("匹配失败");
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
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            提示: 仔细观察页面内容，答案就在其中
          </p>
        </div>
      </div>
      
      <InputDialog open={showDialog} result={result} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default Home; 