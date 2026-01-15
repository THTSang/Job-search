import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/form/LoginForm.css';
import { LoginAPI, BasicUserInfoAPI } from '../../api';
import { useUserCredential } from '../../store';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBannedPopup, setShowBannedPopup] = useState(false);
  const { setToken, setUserBasicInfo } = useUserCredential();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setError('');

    // Validate empty fields
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      const response = await LoginAPI(email, password);
      setToken(response.token);
      const userBasicInfo = await BasicUserInfoAPI();
      
      // Check if user is banned
      if (userBasicInfo.status === 'BANNED') {
        // Clear token and show banned popup
        setToken('');
        setUserBasicInfo(null);
        setShowBannedPopup(true);
        return;
      }
      
      setUserBasicInfo(userBasicInfo);
      // Navigate based on role
      const roles = userBasicInfo.role;
      if (roles === 'USER') {
        navigate('/jobseeker/home');
      } else if (roles === 'RECRUITER') {
        navigate('/employer/home');
      } else if (roles === 'ADMIN') {
        navigate('/admin/home');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại Email và mật khẩu');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && email && password) {
      handleLogin();
    }
  };

  const isFormValid = email && password && validateEmail(email);

  return (
    <div className="auth-form-container">
      {/* Banned User Popup */}
      {showBannedPopup && (
        <div className="banned-popup-overlay" onClick={() => setShowBannedPopup(false)}>
          <div className="banned-popup" onClick={(e) => e.stopPropagation()}>
            <div className="banned-popup-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </div>
            <h3 className="banned-popup-title">Tài khoản đã bị khóa</h3>
            <p className="banned-popup-message">
              Tài khoản của bạn đã bị khóa do vi phạm quy định của hệ thống. 
              Vui lòng liên hệ quản trị viên để biết thêm chi tiết.
            </p>
            <button 
              className="banned-popup-btn"
              onClick={() => setShowBannedPopup(false)}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {error && <div className='auth-form-error'>{error}</div>}

      <div className='auth-form-field'>
        <label className='auth-form-label'>Email</label>
        <input
          className={`auth-form-input ${email && !validateEmail(email) ? 'auth-form-input-error' : ''}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='email@example.com'
          disabled={isLoading}
        />
        {email && !validateEmail(email) && (
          <span className='auth-form-field-error'>Email không hợp lệ</span>
        )}
      </div>

      <div className='auth-form-field'>
        <label className='auth-form-label'>Mật khẩu</label>
        <div className='auth-form-password-wrapper'>
          <input
            className='auth-form-input'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='*******'
            disabled={isLoading}
          />
          <button
            type="button"
            className='auth-form-password-toggle'
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="auth-forgot-password-link">
        <Link to="/reset-password">Quên mật khẩu?</Link>
      </div>

      <button
        className={`auth-form-submit-button ${isLoading ? 'auth-form-submit-button-loading' : ''}`}
        onClick={handleLogin}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </div>
  );
}

export { LoginForm };
