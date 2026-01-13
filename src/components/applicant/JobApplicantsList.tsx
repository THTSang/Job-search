import { useState, useEffect, useCallback } from 'react';
import type { JobData, JobApplicationInterface, ApplicationStatus } from '../../utils/interface';
import { GetJobApplicationsAPI } from '../../api';
import { getUserFriendlyMessage, logError } from '../../utils/errorHandler';
import { ApplicantCard } from './ApplicantCard';
import '../../styles/pages/ApplicantsPage.css';

interface JobApplicantsListProps {
  job: JobData;
  isExpanded: boolean;
  onToggle: () => void;
}

const JOB_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Đang mở',
  CLOSED: 'Đã đóng',
  DRAFT: 'Bản nháp',
};

function JobApplicantsList({ job, isExpanded, onToggle }: JobApplicantsListProps) {
  const [applications, setApplications] = useState<JobApplicationInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!job.id) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await GetJobApplicationsAPI(job.id, { page: 0, size: 50 });
      if (response) {
        setApplications(response.content);
        setTotalApplicants(response.totalElements);
        setHasLoaded(true);
      }
    } catch (error) {
      logError('Fetch job applications', error);
      setErrorMessage(getUserFriendlyMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [job.id]);

  useEffect(() => {
    if (isExpanded && !hasLoaded && job.id) {
      fetchApplications();
    }
  }, [isExpanded, hasLoaded, job.id, fetchApplications]);

  const handleStatusUpdate = (applicationId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
    );
  };

  const getStatusLabel = (status: string): string => {
    return JOB_STATUS_LABELS[status] || status;
  };

  return (
    <div className="job-applicants-container">
      {/* Header */}
      <div
        className={`job-applicants-header ${isExpanded ? 'job-applicants-header-expanded' : ''}`}
        onClick={onToggle}
      >
        <div className="job-applicants-header-left">
          <div className="job-applicants-icon">
            {job.company?.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} />
            ) : (
              '📋'
            )}
          </div>
          <div className="job-applicants-info">
            <h3 className="job-applicants-title">{job.title}</h3>
            <p className="job-applicants-meta">
              {job.location?.city} • {getStatusLabel(job.status)}
            </p>
          </div>
        </div>

        <div className="job-applicants-header-right">
          <span className="job-applicants-count">
            {hasLoaded ? totalApplicants : '...'} ứng viên
          </span>
          <span
            className={`job-applicants-toggle ${isExpanded ? 'job-applicants-toggle-expanded' : ''}`}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="job-applicants-content">
          {isLoading ? (
            <div className="job-applicants-loading">
              <span>Đang tải danh sách ứng viên...</span>
            </div>
          ) : errorMessage ? (
            <div className="job-applicants-error">
              <span>⚠️ {errorMessage}</span>
              <button onClick={fetchApplications} className="retry-button">
                Thử lại
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="job-applicants-empty">
              <span>Chưa có ứng viên nào ứng tuyển vị trí này</span>
            </div>
          ) : (
            <div className="job-applicants-list">
              {applications.map((application) => (
                <ApplicantCard
                  key={application.id}
                  application={application}
                  onStatusUpdate={handleStatusUpdate}
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
