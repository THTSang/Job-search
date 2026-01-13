import React from 'react';
import '../../../styles/header/jobseeker/HeaderManager.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserCredential } from '../../../store'
import logoImage from '../../../assets/logo.jpg';

function HeaderManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userBasicInfo, setToken, setUserBasicInfo } = useUserCredential();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    navigate('/jobseeker/' + name);
  }

  const handleLogoClick = () => {
    navigate('/jobseeker/home');
  }

  const handleLogout = () => {
    setToken('');
    setUserBasicInfo(null);
    navigate('/auth');
  }

  if (token === '') {
    return (

      <div className="header-manger-container-quest">
        <div className="header-logo" onClick={handleLogoClick}>
          <img src={logoImage} alt="Logo" />
        </div>
        <div className="header-nav-buttons">
          <button
            className={`home-button ${location.pathname === '/jobseeker/home' ? 'home-button-isactive' : ''}`}
            name='home'
            onClick={handleClick}
          >
            Trang chủ
          </button>

          <button className="login-button"
            name='auth'
            onClick={() => {
              navigate('/auth');
            }}
          >
            <span className="login-text">Đăng nhập</span>
          </button>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className='header-manger-container-user'>
        <div className="header-logo" onClick={handleLogoClick}>
          <img src={logoImage} alt="Logo" />
        </div>
        <div className="header-nav-buttons">
          <button
            className={`home-button ${location.pathname === '/jobseeker/home' ? 'home-button-isactive' : ''}`}
            onClick={handleClick}
            name='home'
          >
            Trang chủ
          </button>

          <button
            className={`find-job-button ${location.pathname === '/jobseeker/findjob' ? 'find-job-button-isactive' : ''}`}
            onClick={handleClick}
            name='findjob'
          >
            <span className="find-job-text">Tìm việc</span>
          </button>

          <button
            className={`job-applies-button ${location.pathname === '/jobseeker/jobapplies' ? 'job-applies-button-isactive' : ''}`}
            name='jobapplies'
            onClick={handleClick}
          >
            <span className="job-applies-text">Đơn ứng tuyển</span>
          </button>

          <button
            className={`company-follow-button ${location.pathname === '/jobseeker/followcompanies' ? 'company-follow-button-isactive' : ''}`}
            name='followcompanies'
            onClick={handleClick}
          >
            <span className="company-follow-text">Công ty theo dõi</span>
          </button>

          <button
            className={`message-button ${location.pathname === '/jobseeker/messages' ? 'message-button-isactive' : ''}`}
            name='messages'
            onClick={handleClick}
          >
            <span className="message-text-button">Tin nhắn</span>
          </button>

          <button
            className={`profile-button ${location.pathname === '/jobseeker/personalprofile' ? 'profile-button-isactive' : ''}`}
            name='personalprofile'
            onClick={handleClick}
          >
            <span className="profile-text">Hồ sơ của tôi</span>
          </button>

          <button
            className={`ai-evaluation-button ${location.pathname === '/jobseeker/aiEvaluation' ? 'ai-evaluation-button-isactive' : ''}`}
            name='aiEvaluation'
            onClick={handleClick}
          >
            <span className="ai-evaluation-text">AI đánh giá CV</span>
          </button>
        </div>

        <div className="header-user-section">
          <span className="header-greeting">
            Xin chào, <strong>{userBasicInfo?.name || 'Bạn'}</strong>
          </span>
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-text">Đăng xuất</span>
          </button>
        </div>
      </div>
    )
  }
}
export { HeaderManager };
