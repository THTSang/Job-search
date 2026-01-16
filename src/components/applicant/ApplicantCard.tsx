import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { JobApplicationInterface, ApplicationStatus } from '../../utils/interface';
import { UpdateApplicationStatusAPI } from '../../api';
import { getUserFriendlyMessage, logError } from '../../utils/errorHandler';
import LetterAvatar from '../common/LetterAvatar';
import '../../styles/pages/ApplicantsPage.css';

interface ApplicantCardProps {
  application: JobApplicationInterface;
  onStatusUpdate?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  PENDING: { label: 'Chờ xử lý', className: 'status-pending' },
  INTERVIEWING: { label: 'Đang phỏng vấn', className: 'status-interviewing' },
  OFFERED: { label: 'Đã chấp nhận', className: 'status-offered' },
  REJECTED: { label: 'Từ chối', className: 'status-rejected' },
  CANCELLED: { label: 'Đã hủy', className: 'status-cancelled' },
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

function ApplicantCard({ application, onStatusUpdate }: ApplicantCardProps) {
  const { id, applicant, status, appliedAt, resumeUrl } = application;
  const navigate = useNavigate();
  const location = useLocation();

  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(status);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING;

  const handleViewCV = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  const handleMessageApplicant = () => {
    // Determine the correct messages route based on current path
    let messagesRoute = '/employer/messages';
    if (location.pathname.startsWith('/admin')) {
      messagesRoute = '/admin/messages';
    }
    
    navigate(messagesRoute, {
      state: {
        recipientId: applicant.id,
        recipientName: applicant.fullName
      }
    });
  };

  const handleStatusChange = async (newStatus: ApplicationStatus, note: string = '') => {
    if (newStatus === currentStatus || isUpdating) return;

    setIsUpdating(true);
    setErrorMessage(null);
    try {
      await UpdateApplicationStatusAPI(id, { status: newStatus, note });
      setCurrentStatus(newStatus);
      onStatusUpdate?.(id, newStatus);
    } catch (error) {
      logError('Update application status', error);
      setErrorMessage(getUserFriendlyMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  const canChangeStatus = currentStatus !== 'OFFERED' && currentStatus !== 'REJECTED' && currentStatus !== 'CANCELLED';

  return (
    <div className={`applicant-card ${isUpdating ? 'applicant-card-updating' : ''}`}>
      {/* Avatar */}
      <div className="applicant-avatar">
        <LetterAvatar 
          name={applicant.fullName} 
          src={applicant.avatarUrl} 
          size={48} 
        />
      </div>

      {/* Info */}
      <div className="applicant-info">
        <h3 className="applicant-name">{applicant.fullName}</h3>
        {applicant.professionalTitle && (
          <p className="applicant-title">{applicant.professionalTitle}</p>
        )}
        <p className="applicant-email">{applicant.email}</p>
        <p className="applicant-date">Ngày nộp: {formatDate(appliedAt)}</p>
      </div>

      {/* Status Badge */}
      <div className="applicant-status">
        <span className={`applicant-status-badge ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Actions */}
      <div className="applicant-actions">
        <button
          className="applicant-action-button action-view"
          onClick={handleViewCV}
          disabled={!resumeUrl || isUpdating}
          title={resumeUrl ? 'Xem CV' : 'Không có CV'}
        >
          <span className="action-icon">📄</span>
          Xem CV
        </button>

        <button
          className="applicant-action-button action-message"
          onClick={handleMessageApplicant}
          disabled={isUpdating}
          title="Nhắn tin cho ứng viên"
        >
          <span className="action-icon">💬</span>
          Nhắn tin
        </button>

        {canChangeStatus && (
          <>
            <button
              className="applicant-action-button action-offer"
              onClick={() => handleStatusChange('OFFERED')}
              disabled={isUpdating}
              title="Chấp nhận ứng viên"
            >
              <span className="action-icon">✓</span>
              Chấp nhận
            </button>

            <button
              className="applicant-action-button action-reject"
              onClick={() => handleStatusChange('REJECTED')}
              disabled={isUpdating}
              title="Từ chối ứng viên"
            >
              <span className="action-icon">✕</span>
              Từ chối
            </button>
          </>
        )}

        {isUpdating && <span className="applicant-updating-text">Đang cập nhật...</span>}
        
        {errorMessage && (
          <span className="applicant-error-text" title={errorMessage}>
            ⚠️ Lỗi
          </span>
        )}
      </div>
    </div>
  );
}

export { ApplicantCard };
