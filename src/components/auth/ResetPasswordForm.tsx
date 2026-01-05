
import { Link } from 'react-router-dom';
import '../../styles/form/ResetPasswordForm.css';

function ResetPasswordForm() {
  return (
    <div className="reset-password-form-container">
      <Link to="/auth">Quay lại đăng nhập</Link>
      <span className="reset-password-form-title">Quên mật khẩu?</span>
      <span className="reset-passwrod-form-subtitle">Nhập email của bạn và chúng tôi sẽ gửi link để đặt lại mật khẩu</span>
      <span className="reset-password-form-label">Email</span>
      <input
        className="reset-password-form-input"
        placeholder="email@example.com"
      />
      <button className="reset-password-form-submit-button">Gửi link đặt lại mật khẩu</button>
      <div className='reset-password-form-notation'>
        Lưu ý: Nếu email này được đăng ký trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu. Vui lòng kiểm tra cả thư mục spam.
      </div>
    </div>
  );
}
export { ResetPasswordForm };
