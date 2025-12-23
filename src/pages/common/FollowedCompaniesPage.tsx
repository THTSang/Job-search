import { useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager.tsx';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager.tsx';
import '../../styles/pages/FollowedCompaniesPage.css'

function FollowedCompaniesPage() {
  const location = useLocation();
  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

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
