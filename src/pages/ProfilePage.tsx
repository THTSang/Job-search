import React from 'react';
import { HeaderManager } from '../components/header/HeaderManager.tsx';
import '../styles/pages/ProfilePage.css';

function ProfilePage() {
  return (
    <div className="profile-page-container">
      <HeaderManager />
      <span className='profile-page-title'>Hồ sơ cá nhân</span>
      <div className='profile-image-basics-container'>

      </div>
      <div className='profile-page-introduce'>
        <div className='profile-page-introduce-title'>
          Giời thiệu bản thân
        </div>
        <div className='profile-page-introduce-content'>
          dsdlajdlasldajdalj
        </div>
      </div>

      <div className='profile-page-experience'>
      </div>

      <div className='profile-page-certificate'>
        <div className='profile-page-certificate-study-container'>
          <div className='profile-page-certificate-study-title'>
            Học vấn
          </div>
        </div>

        <div className='profile-page-certificate-skill-container'>
          <div className='profile-page-certificate-skill-title'>
            Kỹ năng
          </div>
        </div>
      </div>

      <div className='profile-page-project'>
        <div className='profile-page-project-title'>
          Dự án
        </div>
      </div>
    </div>
  );
}

export { ProfilePage };
