import '../../../styles/header/employer/HeaderManager.css';
import { useUserCredential } from '../../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../../../assets/logo.jpg';

function HeaderManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userBasicInfo, setToken, setUserBasicInfo } = useUserCredential();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    navigate('/employer/' + name);
  }

  const handleLogoClick = () => {
    navigate('/employer/home');
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
            className={`home-button ${location.pathname === '/employer/home' ? 'home-button-isactive' : ''}`}
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
            className={`home-button ${location.pathname === '/employer/home' ? 'home-button-isactive' : ''}`}
            onClick={handleClick}
            name='home'
          >
            Trang chủ
          </button>

          <button
            className={`find-job-button ${location.pathname === '/employer/findjob' ? 'find-job-button-isactive' : ''}`}
            onClick={handleClick}
            name='findjob'
          >
            <span className="find-job-text">Tìm việc</span>
          </button>

          <button
            className={`post-job-button ${location.pathname === '/employer/postjob' ? 'post-job-button-isactive' : ''}`}
            name='postjob'
            onClick={handleClick}
          >
            <span className="post-job-text">Đăng tin</span>
          </button>

          <button
            className={`applicant-management-button ${location.pathname === '/employer/applicantmanagement' ? 'applicant-management-button-isactive' : ''}`}
            name='applicantmanagement'
            onClick={handleClick}
          >
            <span className="applicant-management-text">Quản lý ứng viên</span>
          </button>

          <button
            className={`message-button ${location.pathname === '/employer/messages' ? 'message-button-isactive' : ''}`}
            name='messages'
            onClick={handleClick}
          >
            <span className="message-text-button">Tin nhắn</span>
          </button>

          <button
            className={`company-profile-button ${location.pathname === '/employer/companyprofile' ? 'company-profile-button-isactive' : ''}`}
            name='companyprofile'
            onClick={handleClick}
          >
            <span className="company-profile-text">Hồ sơ công ty</span>
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
