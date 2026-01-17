import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LetterAvatar from '../../components/common/LetterAvatar';
import { GetCompanyByIdAPI } from '../../api';
import type { CompanyProfileInterface } from '../../utils/interface';
import '../../styles/pages/CompanyProfilePage.css';

function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [company, setCompany] = useState<CompanyProfileInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) {
        setError('Không tìm thấy ID công ty');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await GetCompanyByIdAPI(companyId);
        if (response) {
          setCompany(response);
        } else {
          setError('Không tìm thấy công ty');
        }
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Không thể tải thông tin công ty');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="profile-page-container">
        <HeaderManager />
        <div className="profile-page-content">
          <LoadingSpinner fullPage message="Đang tải thông tin công ty..." />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="profile-page-container">
        <HeaderManager />
        <div className="profile-page-content">
          <div className="company-detail-error">
            <div className="error-icon">!</div>
            <h2>Không tìm thấy công ty</h2>
            <p>{error || 'Công ty này không tồn tại hoặc đã bị xóa.'}</p>
            <button className="back-button" onClick={handleBack}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <HeaderManager />

      <div className="profile-page-content">
        {/* Back Button */}
        <button className="company-detail-back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Quay lại
        </button>

        {/* Company Banner and Logo Section */}
        <div className="profile-company-banner-section">
          <div className="profile-company-banner">
            {/* Banner background */}
          </div>
          <div className="profile-company-logo-wrapper">
            <div className="profile-company-logo">
              <LetterAvatar 
                name={company.name} 
                src={company.logoUrl} 
                size={100} 
                variant="rounded" 
              />
            </div>
            <div className="company-profile-info-header">
              <h1 className="company-profile-name">{company.name}</h1>
              <p className="company-profile-industry">
                {company.industry || 'Chưa cập nhật ngành nghề'}
                {company.scale && ` - ${company.scale} nhân viên`}
              </p>
              {company.isVerified && (
                <div className="profile-verified-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Đã xác thực
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Quick Access */}
        <div className="profile-section">
          <h2 className="profile-section-title">Thông tin liên hệ</h2>
          <div className="profile-info-grid">
            {company.website && (
              <div className="profile-info-item">
                <label className="profile-info-label">Website</label>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="profile-info-link">
                  {company.website}
                </a>
              </div>
            )}

            {company.contactEmail && (
              <div className="profile-info-item">
                <label className="profile-info-label">Email</label>
                <div className="profile-info-value">{company.contactEmail}</div>
              </div>
            )}

            {company.phone && (
              <div className="profile-info-item">
                <label className="profile-info-label">Số điện thoại</label>
                <div className="profile-info-value">{company.phone}</div>
              </div>
            )}

            {company.address && (
              <div className="profile-info-item">
                <label className="profile-info-label">Địa chỉ</label>
                <div className="profile-info-value">{company.address}</div>
              </div>
            )}

            {!company.website && !company.contactEmail && !company.phone && !company.address && (
              <div className="profile-info-item">
                <p className="profile-placeholder">Chưa cập nhật thông tin liên hệ</p>
              </div>
            )}
          </div>
        </div>

        {/* Company Description Section */}
        <div className="profile-section">
          <h2 className="profile-section-title">Giới thiệu công ty</h2>
          <div className="profile-description">
            {company.description ? (
              company.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p className="profile-placeholder">Chưa cập nhật mô tả công ty</p>
            )}
          </div>
        </div>

        {/* Company Info Section */}
        <div className="profile-section">
          <h2 className="profile-section-title">Thông tin chi tiết</h2>
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <label className="profile-info-label">Ngành nghề</label>
              <div className="profile-info-value">{company.industry || 'Chưa cập nhật'}</div>
            </div>

            <div className="profile-info-item">
              <label className="profile-info-label">Quy mô</label>
              <div className="profile-info-value">{company.scale || 'Chưa cập nhật'}</div>
            </div>

            {company.createdAt && (
              <div className="profile-info-item">
                <label className="profile-info-label">Ngày tham gia</label>
                <div className="profile-info-value">
                  {new Date(company.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { CompanyDetailPage };
