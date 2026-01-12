import { useState, useEffect } from 'react';
import type { JobData, JobApplicationInterface } from '../../utils/interface';
import { GetJobApplicationsAPI } from '../../api';
import { ApplicantCard } from './ApplicantCard';
import '../../styles/pages/ApplicantsPage.css';

interface JobApplicantsListProps {
  job: JobData;
  isExpanded: boolean;
  onToggle: () => void;
}

function JobApplicantsList({ job, isExpanded, onToggle }: JobApplicantsListProps) {
  const [applications, setApplications] = useState<JobApplicationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isExpanded && !hasLoaded && job.id) {
      fetchApplications();
    }
  }, [isExpanded, hasLoaded, job.id]);

  const fetchApplications = async () => {
    if (!job.id) return;
    
    setIsLoading(true);
    try {
      const response = await GetJobApplicationsAPI(job.id, { page: 0, size: 50 });
      if (response) {
        setApplications(response.content);
        setTotalApplicants(response.totalElements);
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === 'OPEN') return 'Đang mở';
    if (status === 'CLOSED') return 'Đã đóng';
    if (status === 'DRAFT') return 'Bản nháp';
    return status;
  };

  return (
    <div className='job-applicants-container'>
      <div 
        className={`job-applicants-header ${isExpanded ? 'job-applicants-header-expanded' : ''}`}
        onClick={onToggle}
      >
        <div className='job-applicants-header-left'>
          <div className='job-applicants-icon'>
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} />
            ) : (
              '📋'
            )}
          </div>
          <div className='job-applicants-info'>
            <h3 className='job-applicants-title'>{job.title}</h3>
            <p className='job-applicants-meta'>
              {job.location?.city} • {getStatusLabel(job.status)}
            </p>
          </div>
        </div>
        <div className='job-applicants-header-right'>
          <span className='job-applicants-count'>
            {hasLoaded ? totalApplicants : '...'} ứng viên
          </span>
          <span className={`job-applicants-toggle ${isExpanded ? 'job-applicants-toggle-expanded' : ''}`}>
            ▼
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className='job-applicants-content'>
          {isLoading ? (
            <div className='job-applicants-loading'>
              <span>Đang tải danh sách ứng viên...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className='job-applicants-empty'>
              <span>Chưa có ứng viên nào ứng tuyển vị trí này</span>
            </div>
          ) : (
            <div className='job-applicants-list'>
              {applications.map((application) => (
                <ApplicantCard 
                  key={application.id} 
                  application={application} 
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { JobApplicantsList };
