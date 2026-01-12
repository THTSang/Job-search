import type { JobApplicationInterface, ApplicationStatus } from '../../utils/interface';
import '../../styles/pages/ApplicantsPage.css';

interface ApplicantCardProps {
  application: JobApplicationInterface;
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  'PENDING': { label: 'Chờ xử lý', className: 'status-pending' },
  'REVIEWED': { label: 'Đã xem', className: 'status-reviewing' },
  'SHORTLISTED': { label: 'Trong danh sách', className: 'status-shortlisted' },
  'REJECTED': { label: 'Từ chối', className: 'status-rejected' },
  'ACCEPTED': { label: 'Chấp nhận', className: 'status-accepted' }
};

function ApplicantCard({ application }: ApplicantCardProps) {
  const { applicant, status, appliedAt, resumeUrl } = application;
  
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG['PENDING'];
  
  const getAvatarInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleViewCV = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <div className='applicant-card'>
      <div className='applicant-avatar'>
        {applicant.avatarUrl ? (
          <img src={applicant.avatarUrl} alt={applicant.fullName} />
        ) : (
          getAvatarInitial(applicant.fullName)
        )}
      </div>

      <div className='applicant-info'>
        <h3 className='applicant-name'>{applicant.fullName}</h3>
        {applicant.professionalTitle && (
          <p className='applicant-title'>{applicant.professionalTitle}</p>
        )}
        <p className='applicant-email'>{applicant.email}</p>
        <p className='applicant-date'>Ngày nộp: {formatDate(appliedAt)}</p>
      </div>

      <div className='applicant-status'>
        <span className={`applicant-status-badge ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className='applicant-actions'>
        <button 
          className='applicant-action-button action-view'
          onClick={handleViewCV}
          disabled={!resumeUrl}
        >
          <span className='action-icon'>👁</span>
          Xem CV
        </button>
        <button className='applicant-action-button action-message'>
          <span className='action-icon'>💬</span>
          Nhắn tin
        </button>
      </div>
    </div>
  );
}

export { ApplicantCard };
