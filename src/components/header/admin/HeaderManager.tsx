import '../../../styles/header/admin/HeaderManager.css';
import { useUserCredential } from '../../../store';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImage from '../../../assets/logo.jpg';

function HeaderManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userBasicInfo, setToken, setUserBasicInfo } = useUserCredential();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = e.currentTarget.name;
    navigate('/admin/' + name);
  }

  const handleLogoClick = () => {
    navigate('/admin/home');
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
            className={`home-button ${location.pathname === '/admin/home' ? 'home-button-isactive' : ''}`}
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
            className={`home-button ${location.pathname === '/admin/home' ? 'home-button-isactive' : ''}`}
            onClick={handleClick}
            name='home'
          >
            Trang chủ
          </button>

          <button
            className={`users-button ${location.pathname === '/admin/users' ? 'users-button-isactive' : ''}`}
            onClick={handleClick}
            name='users'
          >
            <span className="users-text">Quản lý người dùng</span>
          </button>

          <button
            className={`jobs-button ${location.pathname === '/admin/jobs' ? 'jobs-button-isactive' : ''}`}
            onClick={handleClick}
            name='jobs'
          >
            <span className="jobs-text">Quản lý tin tuyển dụng</span>
          </button>

          <button
            className={`companies-button ${location.pathname === '/admin/companies' ? 'companies-button-isactive' : ''}`}
            onClick={handleClick}
            name='companies'
          >
            <span className="companies-text">Quản lý công ty</span>
          </button>

          <button
            className={`stats-button ${location.pathname === '/admin/stats' ? 'stats-button-isactive' : ''}`}
            onClick={handleClick}
            name='stats'
          >
            <span className="stats-text">Thống kê</span>
          </button>
        </div>

        <div className="header-user-section">
          <span className="header-greeting">
            Xin chào, <strong>{userBasicInfo?.name || 'Quản trị viên'}</strong>
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
