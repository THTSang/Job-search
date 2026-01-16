import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LetterAvatar from '../../components/common/LetterAvatar';
import { GetJobByIdAPI, ApplyJobAPI, CheckApplicationAPI } from '../../api';
import type { JobData, EmploymentType, ApplicationRequestInterface, ApplicationCheckResponse, ApplicationStatus } from '../../utils/interface';
import { createErrorHandler, logError } from '../../utils/errorHandler';
import '../../styles/pages/JobDetailPage.css';

// Custom error handler for apply job with specific messages
const handleApplyError = createErrorHandler({
  409: 'Bạn đã ứng tuyển công việc này rồi',
  401: 'Vui lòng đăng nhập để ứng tuyển',
  403: 'Bạn không có quyền ứng tuyển công việc này',
});

type ApplyStatus = 'idle' | 'loading' | 'success' | 'error';

function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [job, setJob] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>('idle');
  const [applyError, setApplyError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    resumeUrl: '',
    coverLetter: ''
  });

  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  // Application status state
  const [applicationInfo, setApplicationInfo] = useState<ApplicationCheckResponse | null>(null);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);

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
        logError('Fetch job details', err);
        setError('Không thể tải thông tin công việc. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    const checkApplicationStatus = async () => {
      if (!jobId || isEmployer) return;
      
      try {
        setIsCheckingApplication(true);
        const response = await CheckApplicationAPI(jobId);
        if (response) {
          setApplicationInfo(response);
        }
      } catch (err) {
        logError('Check application status', err);
        // Silent fail - don't show error to user, just assume not applied
      } finally {
        setIsCheckingApplication(false);
      }
    };

    fetchJob();
    checkApplicationStatus();
  }, [jobId, isEmployer]);

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

  const getApplicationStatusLabel = (status: ApplicationStatus): string => {
    const labels: Record<ApplicationStatus, string> = {
      'PENDING': 'Chờ xem xét',
      'INTERVIEWING': 'Đang phỏng vấn',
      'OFFERED': 'Đã chấp nhận',
      'REJECTED': 'Không phù hợp',
      'CANCELLED': 'Đã hủy'
    };
    return labels[status] || status;
  };

  const formatApplicationDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCompanyClick = () => {
    if (job?.company.id) {
      const basePath = isEmployer ? '/employer' : '/jobseeker';
      navigate(`${basePath}/company/${job.company.id}`);
    }
  };

  // Apply modal handlers
  const openApplyModal = () => {
    setShowApplyModal(true);
    setApplyStatus('idle');
    setApplyError(null);
    setFormData({ resumeUrl: '', coverLetter: '' });
  };

  const closeApplyModal = () => {
    if (applyStatus !== 'loading') {
      setShowApplyModal(false);
      setApplyStatus('idle');
      setApplyError(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobId) {
      setApplyError('Không tìm thấy thông tin công việc');
      return;
    }

    if (!formData.resumeUrl.trim()) {
      setApplyError('Vui lòng nhập link CV của bạn');
      return;
    }

    setApplyStatus('loading');
    setApplyError(null);

    try {
      const applicationData: ApplicationRequestInterface = {
        jobId,
        resumeUrl: formData.resumeUrl.trim(),
        coverLetter: formData.coverLetter.trim()
      };

      await ApplyJobAPI(applicationData);
      setApplyStatus('success');
      // Update applicationInfo to reflect successful application
      setApplicationInfo({
        hasApplied: true,
        applicationId: null,
        status: 'PENDING',
        appliedAt: new Date().toISOString()
      });
    } catch (err: unknown) {
      setApplyStatus('error');
      logError('Apply job', err);
      
      // Use custom error handler for user-friendly messages
      setApplyError(handleApplyError(err));
    }
  };

  // Handle click outside modal to close
  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeApplyModal();
    }
  };

  if (isLoading) {
    return (
      <div className="job-detail-page">
        <HeaderManager />
        <div className="job-detail-container">
          <LoadingSpinner fullPage message="Đang tải thông tin công việc..." />
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
                <LetterAvatar 
                  name={job.company.name} 
                  src={job.company.logoUrl} 
                  size={56} 
                  variant="rounded" 
                />
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
                  <LetterAvatar 
                    name={job.company.name} 
                    src={job.company.logoUrl} 
                    size={48} 
                    variant="rounded" 
                  />
                </div>
                <h3>{job.company.name}</h3>
              </div>
              {job.company.id && (
                <button 
                  className="view-company-button"
                  onClick={handleCompanyClick}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  Xem công ty
                </button>
              )}
            </div>

            {/* Apply Button or Applied Status */}
            {!isEmployer && job.status === 'OPEN' && (
              isCheckingApplication ? (
                <div className="applied-status applied-status-loading">
                  <span className="apply-loading-spinner"></span>
                  Đang kiểm tra...
                </div>
              ) : applicationInfo?.hasApplied ? (
                <div className="applied-status-card">
                  <div className="applied-status-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Đã ứng tuyển</span>
                  </div>
                  <div className="applied-status-details">
                    {applicationInfo.appliedAt && (
                      <div className="applied-status-date">
                        Ngày ứng tuyển: {formatApplicationDate(applicationInfo.appliedAt)}
                      </div>
                    )}
                    {applicationInfo.status && (
                      <div className={`applied-status-badge applied-status-${applicationInfo.status.toLowerCase()}`}>
                        {getApplicationStatusLabel(applicationInfo.status)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button className="apply-button" onClick={openApplyModal}>
                  Ứng tuyển ngay
                </button>
              )
            )}

            {/* Job Status */}
            <div className={`job-status job-status-${job.status.toLowerCase()}`}>
              {job.status === 'OPEN' ? 'Đang tuyển' : job.status === 'CLOSED' ? 'Đã đóng' : job.status}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="apply-modal-backdrop" onClick={handleModalBackdropClick}>
          <div className="apply-modal">
            <div className="apply-modal-header">
              <h2>Ứng tuyển vị trí</h2>
              <button 
                className="apply-modal-close" 
                onClick={closeApplyModal}
                disabled={applyStatus === 'loading'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="apply-modal-job-info">
              <div className="apply-job-logo">
                <LetterAvatar 
                  name={job.company.name} 
                  src={job.company.logoUrl} 
                  size={48} 
                  variant="rounded" 
                />
              </div>
              <div className="apply-job-details">
                <h3>{job.title}</h3>
                <p>{job.company.name}</p>
              </div>
            </div>

            {applyStatus === 'success' ? (
              <div className="apply-success">
                <div className="apply-success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Ứng tuyển thành công!</h3>
                <p>Hồ sơ của bạn đã được gửi đến nhà tuyển dụng. Chúng tôi sẽ thông báo khi có phản hồi.</p>
                <button className="apply-success-button" onClick={closeApplyModal}>
                  Đóng
                </button>
              </div>
            ) : (
              <form className="apply-form" onSubmit={handleApplySubmit}>
                <div className="apply-form-group">
                  <label htmlFor="resumeUrl">
                    Link CV của bạn <span className="required">*</span>
                  </label>
                  <input
                    type="url"
                    id="resumeUrl"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/your-cv.pdf"
                    disabled={applyStatus === 'loading'}
                    required
                  />
                  <span className="apply-form-hint">
                    Hỗ trợ link từ Google Drive, Dropbox hoặc các dịch vụ lưu trữ khác
                  </span>
                </div>

                <div className="apply-form-group">
                  <label htmlFor="coverLetter">
                    Thư giới thiệu (không bắt buộc)
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn phù hợp với vị trí này..."
                    rows={5}
                    disabled={applyStatus === 'loading'}
                  />
                </div>

                {applyError && (
                  <div className="apply-error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {applyError}
                  </div>
                )}

                <div className="apply-form-actions">
                  <button 
                    type="button" 
                    className="apply-cancel-button"
                    onClick={closeApplyModal}
                    disabled={applyStatus === 'loading'}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="apply-submit-button"
                    disabled={applyStatus === 'loading'}
                  >
                    {applyStatus === 'loading' ? (
                      <>
                        <span className="apply-loading-spinner"></span>
                        Đang gửi...
                      </>
                    ) : (
                      'Gửi hồ sơ'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { JobDetailPage };
