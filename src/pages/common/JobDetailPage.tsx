import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager';
import { GetJobByIdAPI } from '../../api';
import type { JobData, EmploymentType } from '../../utils/interface';
import '../../styles/pages/JobDetailPage.css';

function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [job, setJob] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setError('Job ID not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await GetJobByIdAPI(jobId);
        if (response) {
          setJob(response);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  const getSalaryDisplay = () => {
    if (!job) return 'Thỏa thuận';
    if (job.salaryMin && job.salaryMax) {
      return `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`;
    } else if (job.salaryMax) {
      return `Đến ${formatSalary(job.salaryMax)}`;
    } else if (job.salaryMin) {
      return `Từ ${formatSalary(job.salaryMin)}`;
    }
    return 'Thỏa thuận';
  };

  const getEmploymentTypeLabel = (type: EmploymentType) => {
    const labels: Record<EmploymentType, string> = {
      'FULL_TIME': 'Toàn thời gian',
      'PART_TIME': 'Bán thời gian',
      'CONTRACT': 'Hợp đồng',
      'INTERNSHIP': 'Thực tập',
      'REMOTE': 'Làm việc từ xa'
    };
    return labels[type] || type;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompanyInitial = () => {
    return job?.company.name ? job.company.name.charAt(0).toUpperCase() : 'C';
  };

  if (isLoading) {
    return (
      <div className="job-detail-page">
        <HeaderManager />
        <div className="job-detail-container">
          <div className="job-detail-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin công việc...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-page">
        <HeaderManager />
        <div className="job-detail-container">
          <div className="job-detail-error">
            <div className="error-icon">!</div>
            <h2>Không tìm thấy công việc</h2>
            <p>{error || 'Công việc này không tồn tại hoặc đã bị xóa.'}</p>
            <button className="back-button" onClick={handleBack}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <HeaderManager />
      
      <div className="job-detail-container">
        {/* Back Button */}
        <button className="back-nav-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Quay lại
        </button>

        {/* Main Content */}
        <div className="job-detail-content">
          {/* Left Column - Job Info */}
          <div className="job-detail-main">
            {/* Job Header */}
            <div className="job-detail-header">
              <div className="job-header-info">
                <h1 className="job-title">{job.title}</h1>
                <div className="job-company-name">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  <span>{job.company.name}</span>
                </div>
              </div>
              <div className="job-header-logo">
                {job.company.logoUrl ? (
                  <img src={job.company.logoUrl} alt={job.company.name} />
                ) : (
                  <span>{getCompanyInitial()}</span>
                )}
              </div>
            </div>

            {/* Job Meta */}
            <div className="job-meta-grid">
              <div className="job-meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <span className="meta-label">Địa điểm</span>
                  <span className="meta-value">{job.location.city}{job.location.address ? `, ${job.location.address}` : ''}</span>
                </div>
              </div>

              <div className="job-meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <div>
                  <span className="meta-label">Mức lương</span>
                  <span className="meta-value">{getSalaryDisplay()}</span>
                </div>
              </div>

              <div className="job-meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <div>
                  <span className="meta-label">Loại hình</span>
                  <span className="meta-value">{getEmploymentTypeLabel(job.employmentType)}</span>
                </div>
              </div>

              <div className="job-meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <span className="meta-label">Kinh nghiệm</span>
                  <span className="meta-value">{job.minExperience > 0 ? `${job.minExperience}+ năm` : 'Không yêu cầu'}</span>
                </div>
              </div>

              {job.category && (
                <div className="job-meta-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <div>
                    <span className="meta-label">Ngành nghề</span>
                    <span className="meta-value">{job.category.name}</span>
                  </div>
                </div>
              )}

              {job.deadline && (
                <div className="job-meta-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                  <div>
                    <span className="meta-label">Hạn nộp</span>
                    <span className="meta-value">{formatDate(job.deadline)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="job-tags-section">
                <h3>Kỹ năng yêu cầu</h3>
                <div className="job-tags">
                  {job.tags.map((tag, index) => (
                    <span key={index} className="job-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="job-description-section">
              <h3>Mô tả công việc</h3>
              <div className="job-description">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Posted Date */}
            <div className="job-posted-info">
              <span>Đăng ngày: {formatDate(job.createdAt)}</span>
              {job.updatedAt && job.updatedAt !== job.createdAt && (
                <span> | Cập nhật: {formatDate(job.updatedAt)}</span>
              )}
            </div>
          </div>

          {/* Right Column - Company & Apply */}
          <div className="job-detail-sidebar">
            {/* Company Card */}
            <div className="company-card">
              <div className="company-card-header">
                <div className="company-logo">
                  {job.company.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} />
                  ) : (
                    <span>{getCompanyInitial()}</span>
                  )}
                </div>
                <h3>{job.company.name}</h3>
              </div>
              {job.company.website && (
                <a 
                  href={job.company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="company-website"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  Xem website
                </a>
              )}
            </div>

            {/* Apply Button */}
            {!isEmployer && (
              <button className="apply-button">
                Ứng tuyển ngay
              </button>
            )}

            {/* Job Status */}
            <div className={`job-status job-status-${job.status.toLowerCase()}`}>
              {job.status === 'OPEN' ? 'Đang tuyển' : job.status === 'CLOSED' ? 'Đã đóng' : job.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { JobDetailPage };
