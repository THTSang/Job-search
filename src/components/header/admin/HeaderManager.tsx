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
      <div className="admin-header-container-guest">
        <div className="admin-header-logo" onClick={handleLogoClick}>
          <img src={logoImage} alt="Logo" />
        </div>
        <div className="admin-header-nav-buttons">
          <button
            className={`admin-nav-button ${location.pathname === '/admin/home' ? 'admin-nav-button-active' : ''}`}
            name='home'
            onClick={handleClick}
          >
            Trang chủ
          </button>

          <button 
            className="admin-login-button"
            onClick={() => navigate('/auth')}
          >
            <span>Đăng nhập</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='admin-header-container-user'>
      <div className="admin-header-logo" onClick={handleLogoClick}>
        <img src={logoImage} alt="Logo" />
        <span className="admin-badge">ADMIN</span>
      </div>
      
      <div className="admin-header-nav-buttons">
        <button
          className={`admin-nav-button ${location.pathname === '/admin/home' ? 'admin-nav-button-active' : ''}`}
          onClick={handleClick}
          name='home'
        >
          Trang chủ
        </button>

        <button
          className={`admin-nav-button ${location.pathname === '/admin/users' ? 'admin-nav-button-active' : ''}`}
          onClick={handleClick}
          name='users'
        >
          Quản lý người dùng
        </button>

        <button
          className={`admin-nav-button ${location.pathname === '/admin/jobs' ? 'admin-nav-button-active' : ''}`}
          onClick={handleClick}
          name='jobs'
        >
          Quản lý tin tuyển dụng
        </button>

        <button
          className={`admin-nav-button ${location.pathname === '/admin/companies' ? 'admin-nav-button-active' : ''}`}
          onClick={handleClick}
          name='companies'
        >
          Quản lý công ty
        </button>

        <button
          className={`admin-nav-button ${location.pathname === '/admin/stats' ? 'admin-nav-button-active' : ''}`}
          onClick={handleClick}
          name='stats'
        >
          Thống kê
        </button>
      </div>

      <div className="admin-header-user-section">
        <span className="admin-header-greeting">
          Xin chào, <strong>{userBasicInfo?.name || 'Quản trị viên'}</strong>
        </span>
        <button className="admin-logout-button" onClick={handleLogout}>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export { HeaderManager };
