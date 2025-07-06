import React from "react";

interface InputDialogProps {
  open: boolean;
  result: string;
  onClose: () => void;
}

const InputDialog: React.FC<InputDialogProps> = ({ open, result, onClose }) => {
  if (!open) return null;
  
  const isSuccess = !result.includes("不正确") && !result.includes("已经提交");
  const resultLines = result.split('\n');
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm w-full">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
          isSuccess ? "bg-green-100" : "bg-red-100"
        }`}>
          <span className="text-2xl">
            {isSuccess ? "✅" : "❌"}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isSuccess ? "验证成功！" : "验证失败"}
        </h3>
        
        {resultLines.map((line, index) => (
          <p key={index} className={`text-lg ${index === 0 ? "mb-2" : "mb-1"} ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}>
            {line}
          </p>
        ))}
        
        <button 
          className="w-full py-3 mt-6 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200"
          onClick={onClose}
        >
          确定
        </button>
      </div>
    </div>
  );
};

export default InputDialog; 