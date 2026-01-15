import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { VerifyEmailAPI } from '../../api';
import '../../styles/pages/VerifyEmailPage.css';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token xác thực không hợp lệ. Vui lòng kiểm tra lại link trong email.');
        return;
      }

      try {
        const response = await VerifyEmailAPI(token);
        setStatus('success');
        setMessage(response.message || 'Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } catch (err: unknown) {
        console.error('Email verification failed:', err);
        const error = err as { response?: { data?: { message?: string } } };
        setStatus('error');
        setMessage(error.response?.data?.message || 'Xác thực thất bại. Token không hợp lệ hoặc đã hết hạn.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        {status === 'loading' && (
          <>
            <div className="verify-email-icon loading">
              <div className="loading-spinner"></div>
            </div>
            <h1 className="verify-email-title">Đang xác thực...</h1>
            <p className="verify-email-message">Vui lòng đợi trong giây lát</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="verify-email-icon success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="verify-email-title">Xác thực thành công!</h1>
            <p className="verify-email-message">{message}</p>
            <p className="verify-email-redirect">
              Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
            </p>
            <Link to="/auth" className="verify-email-button">
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="verify-email-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1 className="verify-email-title">Xác thực thất bại</h1>
            <p className="verify-email-message">{message}</p>
            <div className="verify-email-actions">
              <Link to="/auth" className="verify-email-button">
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { VerifyEmailPage };
