import React, { useState } from 'react';
import '../../styles/header/HeaderManager.css';
import { useCredential, useCurrentPage } from '../../store';
import { useNavigate } from 'react-router-dom';

function HeaderManager() {
  const navigate = useNavigate();
  const { isLogin, setLoginStatus } = useCredential();
  const { currentPage, setCurrentPage } = useCurrentPage();

  const handLogin = () => {
    setLoginStatus(true);
  }

  const handleLogout = () => {
    setLoginStatus(false);
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    navigate('/' + name);
  }

  if (isLogin === false) {
    return (

      <div className="header-manger-container-quest">
        <button className="home-button"
          name='home'
        >
          Trang chủ
        </button>

        <button className="login-button"
          name='login'
          onClick={handleClick}
        >
          <span className="login-text">Đăng nhập</span>
        </button>

      </div>
    );
  }
  else {
    return (
      <div className='header-manger-container-user'>
        <button className="home-button"
          onClick={handleClick}
          name='home'
        >
          Trang chủ
        </button>

        <button className="find-job-button"
          name='findjob'
          onClick={handleClick}
        >
          <span className="find-job-text">Tìm việc</span>
        </button>

        <button className="job-applies-button"
          name='jobapplies'
          onClick={handleClick}
        >
          <span className="job-applies-text">Đơn ứng tuyển</span>
        </button>

        <button className="company-follow-button"
          name='followcompanies'
          onClick={handleClick}
        >
          <span className="company-follow-text">Công ty theo dõi</span>
        </button>

        <button className="message-button"
          name='messages'
          onClick={handleClick}
        >
          <span className="message-text-button">Tin nhắn</span>
        </button>

        <button className="profile-button"
          name='profile'
          onClick={handleClick}
        >
          <span className="profile-text">Hồ sơ của tôi</span>
        </button>

        <button className="ai-evaluation-button"
          name='aiEvaluation'
          onClick={handleClick}
        >
          <span className="ai-evaluation-text">AI đánh giá CV</span>
        </button>

        <button className="logout-button"
          name='register'
          onClick={handleClick}
        >
          <span className="logout-text">Đăng xuất</span>
        </button>

      </div>
    )
  }
}
export { HeaderManager };
