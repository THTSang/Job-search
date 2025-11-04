import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // reset password validation methods
    console.log('Reset password submitted:', { email });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <div className="success-icon">✓</div>
            <h1 className="auth-title">Check Your Email</h1>
            <p className="auth-subtitle">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
          </div>

          <div className="reset-info">
            <p className="reset-info-text">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setIsSubmitted(false)}
                className="reset-resend-link"
              >
                try again
              </button>
            </p>
          </div>

          <div className="auth-link">
            <Link to="/login">Back to Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Send Reset Link
          </button>

          <div className="auth-link">
            Remember your password? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export { ResetPasswordForm };
