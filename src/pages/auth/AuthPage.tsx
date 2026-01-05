import { useState } from 'react';
import { HeaderManager } from '../../components/header/jobseeker/HeaderManager';
import { LoginForm, RegisterForm } from '../../components/auth';
import '../../styles/pages/AuthPage.css';

function AuthPage() {
  const [auth, setAuth] = useState<'login' | 'register'>('login');
  return (
    <>
      <HeaderManager />
      <div className='auth-form-page-section'>
        <div className='auth-form-wrapper'>
          <div className='auth-form-header'>
            Chào mừng đến JobPortal
          </div>
          <div className="auth-form-subheader">
            Đăng nhập hoặc tạo tài khoản mới
          </div>
          <div className='auth-form-toggle-container'>
            <button
              className={`auth-form-toggle-button ${auth === 'login' ? 'active' : ''}`}
              onClick={() => setAuth('login')}
            >
              Đăng nhập
            </button>
            <button
              className={`auth-form-toggle-button ${auth === 'register' ? 'active' : ''}`}
              onClick={() => setAuth('register')}
            >
              Đăng ký
            </button>
          </div>
          {auth === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </>
  );
}
export { AuthPage };

