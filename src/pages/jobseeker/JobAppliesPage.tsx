import React from 'react';
import { HeaderManager } from '../../components/header/jobseeker/HeaderManager.tsx';
import '../../styles/pages/JobAppliesPage.css';

function JobAppliesPage() {
  return (
    <div className="job-applies-page-container">
      <HeaderManager />
      <span className='job-applies-page-title'>Quản lý đơn ứng tuyển</span>
      <span className='job-applies-page-subtitle'>Xem và quản lý các đơn ứng tuyển của bạn tại đây</span>
      <div className='job-applies-page-counter'>
        <div className='job-applies-page-total-counting'>
          <div className='job-applies-page-counting-value'>
            10
          </div>
          <div className='job-applies-page-counting-title'>
            Tổng đơn
          </div>
        </div>

        <div className='job-applies-page-waiting-counting'>
          <div className='job-applies-page-waiting-value'>
            10
          </div>
          <div className='job-applies-page-counting-title'>
            Đang chờ
          </div>
        </div>

        <div className='job-applies-page-interview-counting'>
          <div className='job-applies-page-interview-value'>
            10
          </div>
          <div className='job-applies-page-counting-title'>
            Phỏng vấn
          </div>
        </div>

        <div className='job-applies-page-recieved-counting'>
          <div className='job-applies-page-recieved-value'>
            10
          </div>
          <div className='job-applies-page-counting-title'>
            Đã nhận
          </div>
        </div>
      </div>
    </div>
  );
}
export { JobAppliesPage };
