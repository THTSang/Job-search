import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/form/LoginForm.css';
import { LoginAPI, BasicUserInfoAPI } from '../../api';
import { useUserCredential } from '../../store';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      setUserBasicInfo(userBasicInfo);
      // Navigate based on role
      const roles = userBasicInfo.role;
      if (roles === 'USER') {
        navigate('/jobseeker/home');
      } else if (roles === 'EMPLOYER') {
        navigate('/employer/home');
      } else if (roles === 'ADMIN') {
        navigate('/admin/home');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(email);
      console.log(password);
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
          <span className='auth-form-field-error'>Email khong hop le</span>
        )}
      </div>

      <div className='auth-form-field'>
        <label className='auth-form-label'>Mật khẩu</label>
        <input
          className='auth-form-input'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='*******'
          disabled={isLoading}
        />
      </div>

      <div className="auth-forgot-password-link">
        <Link to="/reset">Quên mật khẩu?</Link>
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
