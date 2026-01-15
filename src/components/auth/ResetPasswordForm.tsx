import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ForgotPasswordAPI, ResetPasswordAPI } from '../../api';
import '../../styles/form/ResetPasswordForm.css';

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if we have a token in URL (reset password mode)
  const tokenFromUrl = searchParams.get('token');
  const isResetMode = !!tokenFromUrl;

  // Form state
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle forgot password (request reset link)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await ForgotPasswordAPI(email);
      setSuccess(response.message || 'Link đặt lại mật khẩu đã được gửi đến email của bạn');
      setEmail('');
    } catch (err: unknown) {
      console.error('Forgot password error:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset password (set new password)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await ResetPasswordAPI(tokenFromUrl!, newPassword);
      setSuccess(response.message || 'Đặt lại mật khẩu thành công!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.');
    } finally {
      setLoading(false);
    }
  };

  // Render forgot password form (request email)
  if (!isResetMode) {
    return (
      <div className="reset-password-form-container">
        <Link to="/auth" className="reset-password-back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Quay lại đăng nhập
        </Link>
        
        <span className="reset-password-form-title">Quên mật khẩu?</span>
        <span className="reset-password-form-subtitle">
          Nhập email của bạn và chúng tôi sẽ gửi link để đặt lại mật khẩu
        </span>

        <form onSubmit={handleForgotPassword}>
          {error && <div className="reset-password-error">{error}</div>}
          {success && <div className="reset-password-success">{success}</div>}

          <label className="reset-password-form-label">Email</label>
          <input
            type="email"
            className="reset-password-form-input"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <button 
            type="submit" 
            className="reset-password-form-submit-button"
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </button>
        </form>

        <div className="reset-password-form-notation">
          Lưu ý: Nếu email này được đăng ký trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu. 
          Vui lòng kiểm tra cả thư mục spam.
        </div>
      </div>
    );
  }

  // Render reset password form (set new password)
  return (
    <div className="reset-password-form-container">
      <Link to="/auth" className="reset-password-back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Quay lại đăng nhập
      </Link>
      
      <span className="reset-password-form-title">Đặt lại mật khẩu</span>
      <span className="reset-password-form-subtitle">
        Nhập mật khẩu mới cho tài khoản của bạn
      </span>

      <form onSubmit={handleResetPassword}>
        {error && <div className="reset-password-error">{error}</div>}
        {success && <div className="reset-password-success">{success}</div>}

        <label className="reset-password-form-label">Mật khẩu mới</label>
        <input
          type="password"
          className="reset-password-form-input"
          placeholder="Nhập mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading || !!success}
        />

        <label className="reset-password-form-label">Xác nhận mật khẩu</label>
        <input
          type="password"
          className="reset-password-form-input"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading || !!success}
        />
        
        <button 
          type="submit" 
          className="reset-password-form-submit-button"
          disabled={loading || !!success}
        >
          {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </button>
      </form>

      {success && (
        <div className="reset-password-form-notation">
          Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
        </div>
      )}
    </div>
  );
}

export { ResetPasswordForm };
