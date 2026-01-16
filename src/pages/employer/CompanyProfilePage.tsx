import { useState, useEffect } from 'react';
import { HeaderManager } from '../../components/header/employer/HeaderManager';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useUserCredential } from '../../store';
import type { CompanyProfileInterface } from '../../utils/interface';
import '../../styles/pages/CompanyProfilePage.css';
import { GetCompanyAPI, PostCompanyAPI, PutCompanyAPI } from '../../api/company';

// TODO: ADD COMPANY IMAGE PROFILE
const emptyCompanyProfile: CompanyProfileInterface = {
  id: null,
  name: '',
  industry: '',
  scale: '',
  address: '',
  logoUrl: '',
  contactEmail: '',
  phone: '',
  website: '',
  description: '',
  recruiterId: '',
  isVerified: false,
  createdAt: null,
  updatedAt: null
};

function CompanyProfilePage() {
  const { userBasicInfo } = useUserCredential();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileInterface>(emptyCompanyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<CompanyProfileInterface>(emptyCompanyProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch company profile on mount
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      setIsLoading(true);
      try {
        const data = await GetCompanyAPI();
        if (data) setCompanyProfile(data);

        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching company profile:', err);
        setIsLoading(false);
      }
    };

    fetchCompanyProfile();
  }, []);

  const handlePutAndPostCompany = async (profileToSave: CompanyProfileInterface) => {
    try {
      let savedProfile: CompanyProfileInterface | null;
      if (companyProfile.id === null) {
        savedProfile = await PostCompanyAPI(profileToSave);
      } else {
        savedProfile = await PutCompanyAPI(profileToSave);
      }
      return savedProfile;
    } catch (error) {
      console.error('Error: Saving company', error);
      throw error;
    }
  }
  const handleOpenEditModal = () => {
    setEditFormData({ ...companyProfile });
    setIsEditModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setError('');
  };

  const handleInputChange = (field: keyof CompanyProfileInterface, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!editFormData.name) {
      setError('Vui lòng nhập tên công ty');
      return;
    }

    setIsSaving(true);

    try {
      const profileToSave: CompanyProfileInterface = {
        ...editFormData,
        recruiterId: userBasicInfo?.id || ''
      };

      const savedProfile = await handlePutAndPostCompany(profileToSave);
      console.log('Saved company profile:', savedProfile);

      // Update local state with the saved profile (includes server-generated ID)
      if (savedProfile) {
        setCompanyProfile(savedProfile);
      } else {
        setCompanyProfile(profileToSave);
      }
      setSuccess('Cập nhật thông tin công ty thành công!');

      // Close modal after a short delay
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
      console.error('Error saving company profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const hasProfile = companyProfile.name !== '';

  if (isLoading) {
    return (
      <div className="profile-page-container">
        <HeaderManager />
        <div className="profile-page-content">
          <LoadingSpinner fullPage message="Đang tải..." />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <HeaderManager />

      <div className="profile-page-content">
        <div className="profile-page-header">
          <h1 className="profile-page-title">Hồ sơ công ty</h1>
          <p className="profile-page-subtitle">Quản lý thông tin và hồ sơ công ty của bạn</p>
        </div>

        {/* Company Banner and Logo Section */}
        <div className="profile-company-banner-section">
          <div className="profile-company-banner">
            {/* Banner background */}
          </div>
          <div className="profile-company-logo-wrapper">
            <div className="profile-company-logo">
              {companyProfile.logoUrl ? (
                <img src={companyProfile.logoUrl} alt="Company logo" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              )}
            </div>
            {companyProfile.isVerified ? (
              <span className="profile-verified-badge">Đã xác minh</span>
            ) : (
              <span className="profile-unverified-badge">Chưa xác minh</span>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!hasProfile && (
          <div className="profile-empty-state">
            <div className="profile-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="profile-empty-title">Chưa có thông tin công ty</h3>
            <p className="profile-empty-text">Hãy thêm thông tin công ty để thu hút ứng viên tiềm năng</p>
            <button className="profile-add-button" onClick={handleOpenEditModal}>
              + Thêm thông tin công ty
            </button>
          </div>
        )}

        {/* Basic Information Section */}
        {hasProfile && (
          <>
            <div className="profile-section">
              <div className="profile-section-header">
                <h2 className="profile-section-title">Thông tin cơ bản</h2>
                <button className="profile-edit-button" onClick={handleOpenEditModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Chỉnh sửa
                </button>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <label className="profile-info-label">Tên công ty</label>
                  <div className="profile-info-value">
                    {companyProfile.name || <span className="profile-placeholder">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="profile-info-item">
                  <label className="profile-info-label">Ngành nghề</label>
                  <div className="profile-info-value">
                    {companyProfile.industry || <span className="profile-placeholder">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="profile-info-item">
                  <label className="profile-info-label">Quy mô</label>
                  <div className="profile-info-value">
                    {companyProfile.scale || <span className="profile-placeholder">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="profile-info-item">
                  <label className="profile-info-label">Website</label>
                  {companyProfile.website ? (
                    <a href={companyProfile.website} target="_blank" rel="noopener noreferrer" className="profile-info-link">
                      {companyProfile.website}
                    </a>
                  ) : (
                    <div className="profile-info-value">
                      <span className="profile-placeholder">Chưa cập nhật</span>
                    </div>
                  )}
                </div>

                <div className="profile-info-item">
                  <label className="profile-info-label">Email</label>
                  <div className="profile-info-value">
                    {companyProfile.contactEmail || <span className="profile-placeholder">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="profile-info-item">
                  <label className="profile-info-label">Số điện thoại</label>
                  <div className="profile-info-value">
                    {companyProfile.phone || <span className="profile-placeholder">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="profile-info-item profile-info-full-width">
                  <label className="profile-info-label">Địa chỉ</label>
                  <div className="profile-info-value">
                    {companyProfile.address || <span className="profile-placeholder">Chưa cập nhật</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Description Section */}
            <div className="profile-section">
              <div className="profile-section-header">
                <h2 className="profile-section-title">Giới thiệu công ty</h2>
                <button className="profile-edit-button" onClick={handleOpenEditModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Chỉnh sửa
                </button>
              </div>

              <div className="profile-description">
                {companyProfile.description ? (
                  <p>{companyProfile.description}</p>
                ) : (
                  <p className="profile-placeholder">Chưa có mô tả về công ty. Hãy thêm mô tả để giới thiệu công ty với ứng viên.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="profile-modal-overlay" onClick={handleCloseEditModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2 className="profile-modal-title">Chỉnh sửa thông tin công ty</h2>
              <button className="profile-modal-close" onClick={handleCloseEditModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="profile-modal-body">
              {error && <div className="profile-modal-error">{error}</div>}
              {success && <div className="profile-modal-success">{success}</div>}

              <div className="profile-modal-form">
                {/* Company Name */}
                <div className="profile-modal-field">
                  <label className="profile-modal-label">
                    Tên công ty <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="profile-modal-input"
                    placeholder="VD: Công ty TNHH ABC"
                    value={editFormData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                {/* Industry and Scale Row */}
                <div className="profile-modal-row">
                  <div className="profile-modal-field">
                    <label className="profile-modal-label">Ngành nghề</label>
                    <input
                      type="text"
                      className="profile-modal-input"
                      placeholder="VD: Công nghệ thông tin"
                      value={editFormData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                    />
                  </div>

                  <div className="profile-modal-field">
                    <label className="profile-modal-label">Quy mô</label>
                    <select
                      className="profile-modal-select"
                      value={editFormData.scale}
                      onChange={(e) => handleInputChange('scale', e.target.value)}
                    >
                      <option value="">Chọn quy mô</option>
                      <option value="1-10">1-10 nhân viên</option>
                      <option value="11-50">11-50 nhân viên</option>
                      <option value="51-200">51-200 nhân viên</option>
                      <option value="201-500">201-500 nhân viên</option>
                      <option value="501-1000">501-1000 nhân viên</option>
                      <option value="1000+">Trên 1000 nhân viên</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="profile-modal-field">
                  <label className="profile-modal-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="profile-modal-input"
                    placeholder="VD: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh"
                    value={editFormData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                {/* Contact Email and Phone Row */}
                <div className="profile-modal-row">
                  <div className="profile-modal-field">
                    <label className="profile-modal-label">Email liên hệ</label>
                    <input
                      type="email"
                      className="profile-modal-input"
                      placeholder="VD: contact@company.com"
                      value={editFormData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>

                  <div className="profile-modal-field">
                    <label className="profile-modal-label">Số điện thoại</label>
                    <input
                      type="tel"
                      className="profile-modal-input"
                      placeholder="VD: +84 123 456 789"
                      value={editFormData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                {/* Website and Logo URL Row */}
                <div className="profile-modal-row">
                  <div className="profile-modal-field">
                    <label className="profile-modal-label">Website</label>
                    <input
                      type="url"
                      className="profile-modal-input"
                      placeholder="VD: https://company.com"
                      value={editFormData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>

                  <div className="profile-modal-field">
                    <label className="profile-modal-label">URL Logo</label>
                    <input
                      type="url"
                      className="profile-modal-input"
                      placeholder="VD: https://company.com/logo.png"
                      value={editFormData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="profile-modal-field">
                  <label className="profile-modal-label">Giới thiệu công ty</label>
                  <textarea
                    className="profile-modal-textarea"
                    rows={5}
                    placeholder="Mô tả về công ty, sứ mệnh, tầm nhìn..."
                    value={editFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button
                className="profile-modal-cancel-button"
                onClick={handleCloseEditModal}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                className="profile-modal-save-button"
                onClick={handleSaveProfile}
                disabled={isSaving || !editFormData.name}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { CompanyProfilePage };
