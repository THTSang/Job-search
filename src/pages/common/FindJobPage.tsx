import { useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager.tsx';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager.tsx';
import { ExtractFinder } from '../../components/finder/ExtractFinder.tsx';

import '../../styles/pages/FindJobPage.css';

function FindJobPage() {
  const location = useLocation();
  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  return (
    <>
      <HeaderManager />
      <ExtractFinder />
      <div className='job-find-counting'>
        Tìm thấy 8 công việc
      </div>
    </>
  );
}
export { FindJobPage };

