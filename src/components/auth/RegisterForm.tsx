import { useState } from 'react';
import '../../styles/form/RegisterForm.css';
import { useNavigate } from "react-router-dom";

// BUG: REGENERATE WHEN SAME EMAIL ADDRESS  
function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');

    // Validate empty fields
    if (!email || !username || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      // Navigate based on role
      if (role === 'jobseeker') {
        navigate('/jobseeker/home');
      } else if (role === 'recruiter') {
        navigate('/employer/home');
      } else {
        navigate('/admin/home');
      }
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      console.error("Register error:", err);
    }
  }

  return (
    <div className="auth-form-container">
      {error && <div className='auth-form-error'>{error}</div>}

      <div className='auth-form-field'>
        <label className='auth-form-label'>Họ tên</label>
        <input
          className='auth-form-input'
          type="text"
          placeholder='Nguyễn Văn A'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className='auth-form-field'>
        <label className='auth-form-label'>Email</label>
        <input
          className='auth-form-input'
          type="email"
          placeholder='email@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='auth-form-field'>
        <label className='auth-form-label'>Mật khẩu</label>
        <input
          className='auth-form-input'
          type="password"
          placeholder='*******'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className='auth-form-field'>
        <label className='auth-form-label'>Xác nhận mật khẩu</label>
        <input
          className={`auth-form-input ${confirmPassword && password !== confirmPassword ? 'auth-form-input-error' : ''}`}
          type="password"
          placeholder='*******'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
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
              value="jobseeker"
              checked={role === 'jobseeker'}
              onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="jobseeker">Người tìm việc</label>
          </div>
          <div className='auth-form-radio-option'>
            <input
              type="radio"
              id="recruiter"
              name="accountType"
              value="recruiter"
              checked={role === 'recruiter'}
              onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="recruiter">Nhà tuyển dụng</label>
          </div>
          <div className='auth-form-radio-option'>
            <input
              type="radio"
              id="admin"
              name="accountType"
              value="admin"
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            <label htmlFor="admin">Quản trị viên (Admin)</label>
          </div>
        </div>
      </div>

      <button
        className='auth-form-submit-button'
        onClick={handleRegister}
        disabled={!email || !username || !password || !confirmPassword || password !== confirmPassword}
      >
        Đăng ký
      </button>
    </div>
  );
}
export { RegisterForm };
