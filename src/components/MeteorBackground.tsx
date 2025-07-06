import React from 'react';

const MeteorBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="meteor meteor-1"></div>
      <div className="meteor meteor-2"></div>
      <div className="meteor meteor-3"></div>
      <div className="meteor meteor-4"></div>
      <div className="meteor meteor-5"></div>
    </div>
  );
};

export default MeteorBackground; 