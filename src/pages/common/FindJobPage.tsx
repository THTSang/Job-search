import { useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager.tsx';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager.tsx';
import { ExtractFinder } from '../../components/finder/ExtractFinder.tsx';
import { useCredential } from '../../store.ts';

// import '../../styles/pages/FindJobPage.css';

function FindJobPage() {
  // const { userId } = useCredential();
  const location = useLocation();
  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  return (
    <div className='find-job-page-container'>
      <HeaderManager />
      <ExtractFinder />
      <div className='job-find-counting'>
        Tìm thấy 8 công việc
      </div>
    </div>
  );
}
export { FindJobPage };

