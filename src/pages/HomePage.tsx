import React from 'react';
import { HeaderManager } from '../components/header/HeaderManager.tsx';
import { FuzzyFinder } from "../components/finder/FuzzyFinder.tsx";
import '../styles/pages/HomePage.css';

function HomePage() {

  return (
    <>
      <HeaderManager />
      <div className='slogan-section'>
        <div className='title-big'>
          Tìm công việc mơ ước của bạn
        </div>
        <div className='title-small'>
          Hàng ngàn cơ hội việc làm đang chờ đón bạn
        </div>
      </div>
      <div className='status-section'>
        <div className='current-job-counting'>
          <div className='job-counting-title-section'>
            Công việc
          </div>
        </div>

        <div className='current-company-counting'>
          <div className='company-counting-title-section'>
            Công ty
          </div>
        </div>

        <div className='current-user-counting'>
          <div className='user-counting-title-section'>
            Ứng viên
          </div>
        </div>
      </div>
      <FuzzyFinder />
      <div className='flavor-job-section'>
        <div className='favor-job-title'>
          Công việc nổi bật
        </div>

      </div>
    </>
  );
}
export { HomePage };
