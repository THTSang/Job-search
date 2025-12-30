import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager.tsx';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager.tsx';
import { FuzzyFinder } from "../../components/finder/FuzzyFinder.tsx";
import { JobCard } from "../../components/job/jobCard.tsx";
import '../../styles/pages/jobseeker/HomePage.css';
import { jobList } from "../../api";
import type { JobData } from '../../utils/interface';

function HomePage() {
  const [jobArray, setJobArray] = useState<JobData[]>([]);

  const location = useLocation();
  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobList();
        setJobArray(response || []);
        console.log('Jobs fetched:', response);
      } catch (error) {
        console.error('Error fetching job list:', error);
      }
    };
    fetchJobs();
  }, [])

  return (
    <>
      <HeaderManager />
      <div className='slogan-section'>
        <div className='title-big'>
          Tìm công việc mơ ước của bạn
        </div>
        <div className='title-small'>
          Hàng ngàn cơ hội việc làm đang chờ đón bạn
        </div>
      </div>
      <div className='status-section'>
        <div className='current-job-counting'>
          <div className='job-counting-title-section'>
            Công việc
          </div>
        </div>

        <div className='current-company-counting'>
          <div className='company-counting-title-section'>
            Công ty
          </div>
        </div>

        <div className='current-user-counting'>
          <div className='user-counting-title-section'>
            Ứng viên
          </div>
        </div>
      </div>
      <FuzzyFinder />
      <div className='featured-job-section'>
        <div className='featured-job-title'>
          Công việc nổi bật
        </div>
        <div className='featured-job-grid'>
          {jobArray.length > 0 ? (
            jobArray.map((job: JobData) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                salary="Thỏa thuận"
                experience="Không yêu cầu"
                type={job.employmentType}
                postedDate={new Date().toISOString().split('T')[0]}
              />
            ))
          ) : (
            <div className='no-jobs-message'>Đang tải công việc...</div>
          )}
        </div>
      </div>

    </>
  );
}
export { HomePage };
