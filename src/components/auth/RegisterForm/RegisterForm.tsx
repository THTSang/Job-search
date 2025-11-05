import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from './RegisterFormMethod';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const availableRoles = ['Job Seeker', 'Employer', 'Recruiter', 'HR Manager', 'Career Advisor'];

  const handleAddRole = (role: string) => {
    if (role && !roles.includes(role)) {
      setRoles([...roles, role]);
      setRoleInput('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles(roles.filter(role => role !== roleToRemove));
  };

  const handleRoleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedInput = roleInput.trim();
      if (trimmedInput) {
        handleAddRole(trimmedInput);
      }
    } else if (e.key === 'Backspace' && !roleInput && roles.length > 0) {
      setRoles(roles.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (roles.length === 0) {
      setError('Please select at least one role');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await registerUser({
        email,
        name,
        password,
        roles,
      });

      console.log('Registration successful:', userData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us and start your job search journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

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
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="roles" className="form-label">
              Roles
            </label>
            <div className="roles-input-wrapper">
              {roles.length > 0 && (
                <div className="roles-tags">
                  {roles.map((role, index) => (
                    <span key={`${role}-${index}`} className="role-tag">
                      <span className="role-tag-text">{role}</span>
                      <button
                        type="button"
                        className="role-remove"
                        onClick={() => handleRemoveRole(role)}
                        aria-label={`Remove ${role}`}
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                id="roles"
                type="text"
                className="form-input role-input"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={handleRoleInputKeyDown}
                placeholder={roles.length === 0 ? "Type a role and press Enter" : "Add another role..."}
                list="role-suggestions"
                disabled={isLoading}
              />
              <datalist id="role-suggestions">
                {availableRoles.map((role) => (
                  <option key={role} value={role} />
                ))}
              </datalist>
            </div>
            {availableRoles.filter((role) => !roles.includes(role)).length > 0 && (
              <div className="role-suggestions">
                <span className="role-suggestions-label">Quick add:</span>
                {availableRoles
                  .filter((role) => !roles.includes(role))
                  .map((role) => (
                    <button
                      key={role}
                      type="button"
                      className="role-suggestion-btn"
                      onClick={() => handleAddRole(role)}
                      disabled={isLoading}
                    >
                      {role}
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export { RegisterForm };
