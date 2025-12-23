import React from 'react';
import { HeaderManager } from '../../components/header/jobseeker/HeaderManager';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';

function ResetPasswordPage() {
  return (
    <div className='reset-password-page-container'>
      <HeaderManager />
      <ResetPasswordForm />
    </div>
  );
}
export { ResetPasswordPage };
