import React from 'react';
import { HeaderManager } from '../components/header/HeaderManager.tsx';
import '../styles/pages/AIEvaluatePage.css';

function AIEvaluatePage() {
  return (
    <div className="ai-evaluate-page-container">
      <HeaderManager />
      <div className='ai-evaluate-page-title'>
        AI Đánh Giá CV
      </div>
      <div className='ai-evaluate-page-subtitle'>
        Tải lên CV của bạn để nhận phân tích và gợi ý cải thiện từ AI
      </div>
      <div className='ai-evaluate-page-upload-section'>
        <span className='ai-evaluate-page-upload-title'>Tải lên CV của bạn</span>
        <div className='ai-evaluate-page-upload-box'>
        </div>
      </div>
    </div>
  );
}
export { AIEvaluatePage };

