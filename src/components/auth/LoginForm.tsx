import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/form/LoginForm.css';

function LoginForm() {
  return (
    <div className="auth-form-container">
      <div className='auth-form-field'>
        <label className='auth-form-label'>Email</label>
        <input
          className='auth-form-input'
          type="email"
          placeholder='email@example.com'
        />
      </div>

      <div className='auth-form-field'>
        <label className='auth-form-label'>Mật khẩu</label>
        <input
          className='auth-form-input'
          type="password"
          placeholder='*******'
        />
      </div>

      <div className="auth-forgot-password-link">
        <Link to="/reset">Quên mật khẩu?</Link>
      </div>

      <button className='auth-form-submit-button'>
        Đăng nhập
      </button>

      {/* <div className="auth-form-footer"> */}
      {/*   Chưa có tài khoản? <Link to="/">Đăng ký ngay</Link> */}
      {/* </div> */}
    </div>
  );
}
export { LoginForm };
