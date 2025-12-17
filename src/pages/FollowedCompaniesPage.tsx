import React from 'react'
import { HeaderManager } from '../components/header/HeaderManager.tsx'
import '../styles/pages/FollowedCompaniesPage.css'

function FollowedCompaniesPage() {
  return (
    <div className="followed-companies-page-container">
      <HeaderManager />
      <div className='follwed-companies-page-title'>
        Công ty đã theo dõi
      </div>
      <div className='followed-companies-page-subtitle'>
        Theo dõi 3 công ty
      </div>
    </div>
  );
}
export { FollowedCompaniesPage };
