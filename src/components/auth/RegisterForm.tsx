import { useState } from 'react';
import '../../styles/form/RegisterForm.css';
import { useNavigate } from "react-router-dom";
import { SignUpAPI } from '../../api';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('USER');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    setError('');

    // Validate empty fields
    if (!email || !username || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Validate password length (8-100 characters)
    if (password.length < 8 || password.length > 100) {
      setError('Mật khẩu phải có từ 8 đến 100 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      await SignUpAPI(email, username, password, role);

      // Show success notification
      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (err: unknown) {
      // Handle specific error cases
      const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
      const status = errorObj?.response?.status;
      
      if (status === 409) {
        setError('Email này đã được sử dụng. Vui lòng sử dụng email khác.');
      } else if (status === 400) {
        setError('Thông tin không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
      console.error("Register error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && email && username && password && confirmPassword && password === confirmPassword) {
      handleRegister();
    }
  };

  const isFormValid = email && username && password && confirmPassword && 
    password === confirmPassword && validateEmail(email) && password.length >= 8;

  return (
    <div className="auth-form-container">
      {success && (
        <div className='auth-form-success'>
          <div className='auth-form-success-icon'>✓</div>
          <div className='auth-form-success-title'>Đăng ký thành công!</div>
          <div className='auth-form-success-message'>
            Tài khoản của bạn đã được tạo. Hãy đăng nhập lại.
          </div>
        </div>
      )}

      {!success && (
        <>
          {error && <div className='auth-form-error'>{error}</div>}

          <div className='auth-form-field'>
            <label className='auth-form-label'>Họ tên</label>
            <input
              className='auth-form-input'
              type="text"
              placeholder='Nguyễn Văn A'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>

          <div className='auth-form-field'>
            <label className='auth-form-label'>Email</label>
            <input
              className={`auth-form-input ${email && !validateEmail(email) ? 'auth-form-input-error' : ''}`}
              type="email"
              placeholder='email@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
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
                placeholder='*******'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
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
            {password && password.length < 8 && (
              <span className='auth-form-field-error'>Mật khẩu phải có ít nhất 8 ký tự</span>
            )}
          </div>

          <div className='auth-form-field'>
            <label className='auth-form-label'>Xác nhận mật khẩu</label>
            <div className='auth-form-password-wrapper'>
              <input
                className={`auth-form-input ${confirmPassword && password !== confirmPassword ? 'auth-form-input-error' : ''}`}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='*******'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                type="button"
                className='auth-form-password-toggle'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
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
            {confirmPassword && password !== confirmPassword && (
              <span className='auth-form-field-error'>Mật khẩu không khớp</span>
            )}
          </div>

          <div className='auth-form-account-type'>
            <label className='auth-form-account-type-label'>Loại tài khoản</label>
            <div className='auth-form-radio-group'>
              <div className='auth-form-radio-option'>
                <input
                  type="radio"
                  id="jobseeker"
                  name="accountType"
                  value="USER"
                  checked={role === 'USER'}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                />
                <label htmlFor="jobseeker">Người tìm việc</label>
              </div>
              <div className='auth-form-radio-option'>
                <input
                  type="radio"
                  id="recruiter"
                  name="accountType"
                  value="RECRUITER"
                  checked={role === 'RECRUITER'}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                />
                <label htmlFor="recruiter">Nhà tuyển dụng</label>
              </div>
            </div>
          </div>

          <button
            className={`auth-form-submit-button ${isLoading ? 'auth-form-submit-button-loading' : ''}`}
            onClick={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </>
      )}
    </div>
  );
}
export { RegisterForm };
