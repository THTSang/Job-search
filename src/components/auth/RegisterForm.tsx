import React from 'react';
import '../../styles/form/RegisterForm.css';

function RegisterForm() {
  return (
    <div className="auth-form-container">
      <div className='auth-form-field'>
        <label className='auth-form-label'>Họ tên</label>
        <input 
          className='auth-form-input'
          type="text"
          placeholder='Nguyễn Văn A'
        />
      </div>

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

      <div className='auth-form-field'>
        <label className='auth-form-label'>Xác nhận mật khẩu</label>
        <input 
          className='auth-form-input'
          type="password"
          placeholder='*******'
        />
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
              defaultChecked
            />
            <label htmlFor="jobseeker">Người tìm việc</label>
          </div>
          <div className='auth-form-radio-option'>
            <input 
              type="radio" 
              id="recruiter" 
              name="accountType" 
              value="recruiter"
            />
            <label htmlFor="recruiter">Nhà tuyển dụng</label>
          </div>
          <div className='auth-form-radio-option'>
            <input 
              type="radio" 
              id="admin" 
              name="accountType" 
              value="admin"
            />
            <label htmlFor="admin">Quản trị viên (Admin)</label>
          </div>
        </div>
      </div>

      <button className='auth-form-submit-button'>
        Đăng ký
      </button>
    </div>
  );
}
export { RegisterForm };
