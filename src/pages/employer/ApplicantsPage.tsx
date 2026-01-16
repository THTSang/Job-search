import { useState, useEffect, useCallback } from 'react';
import '../../styles/pages/ApplicantsPage.css';
import { HeaderManager } from '../../components/header/employer/HeaderManager';
import { JobApplicantsList } from '../../components/applicant/JobApplicantsList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { GetCompanyAPI, GetCompanyJobsAPI } from '../../api';
import type { JobData, CompanyProfileInterface } from '../../utils/interface';

function ApplicantsPage() {
  const [company, setCompany] = useState<CompanyProfileInterface | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedJobIds, setExpandedJobIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const fetchCompanyAndJobs = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const companyData = await GetCompanyAPI();
      setCompany(companyData);

      if (companyData?.id) {
        const jobsResponse = await GetCompanyJobsAPI(companyData.id, 0, 50);
        if (jobsResponse) {
          setJobs(jobsResponse.content);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyAndJobs();
  }, [fetchCompanyAndJobs]);

  const handleToggleJob = (jobId: string | null) => {
    if (!jobId) return;

    setExpandedJobIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <>
        <HeaderManager />
        <div className="applicants-page-container">
          <LoadingSpinner fullPage message="Đang tải..." />
        </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <HeaderManager />
        <div className="applicants-page-container">
          <div className="applicants-page-error">
            <span>{error}</span>
            <button onClick={fetchCompanyAndJobs}>Thử lại</button>
          </div>
        </div>
      </>
    );
  }

  // Render no company state
  if (!company) {
    return (
      <>
        <HeaderManager />
        <div className="applicants-page-container">
          <div className="applicants-page-no-company">
            <h2>Chưa có hồ sơ công ty</h2>
            <p>Vui lòng tạo hồ sơ công ty trước khi quản lý ứng viên.</p>
            <a href="/employer/createcompany">Tạo hồ sơ công ty</a>
          </div>
        </div>
      </>
    );
  }

  // Render main content
  return (
    <>
      <HeaderManager />
      <div className="applicants-page-container">
        <div className="applicants-page-header">
          <h1 className="applicants-page-title">Quản lý ứng viên</h1>
          <p className="applicants-page-subtitle">
            {jobs.length} vị trí tuyển dụng • Nhấn vào từng vị trí để xem danh sách ứng viên
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="applicants-page-empty">
            <div className="applicants-page-empty-icon">📋</div>
            <h2>Chưa có tin tuyển dụng</h2>
            <p>Hãy đăng tin tuyển dụng để bắt đầu nhận đơn ứng tuyển.</p>
            <a href="/employer/postjob" className="applicants-page-post-job-link">
              Đăng tin tuyển dụng
            </a>
          </div>
        ) : (
          <div className="applicants-page-jobs-list">
            {jobs.map((job) => (
              <JobApplicantsList
                key={job.id}
                job={job}
                isExpanded={expandedJobIds.has(job.id || '')}
                onToggle={() => handleToggleJob(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export { ApplicantsPage };
