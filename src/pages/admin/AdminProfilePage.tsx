import { useState, useEffect } from 'react';
import { HeaderManager } from '../../components/header/admin/HeaderManager';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import LetterAvatar from '../../components/common/LetterAvatar';
import '../../styles/pages/admin/AdminProfilePage.css';
import type { UserProfileInterface } from '../../utils/interface';
import { PutProfileAPI, PostProfileAPI, GetProfileAPI } from '../../api';
import { useUserCredential } from '../../store';

function AdminProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Get user info from store
  const { userBasicInfo, setUserBasicInfo } = useUserCredential();
  const userEmail = userBasicInfo?.email || '';
  
  // Loading states
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Main profile state (simplified for admin)
  const [profileData, setProfileData] = useState<UserProfileInterface>({
    id: null,
    userId: null,
    fullName: '',
    professionalTitle: '',
    phoneNumber: '',
    address: '',
    avatarUrl: '',
    summary: '',
    skills: [],
    experiences: [],
    educations: [],
    projects: [],
    createdAt: null,
    updatedAt: null
  });

  // Edit form states (only basic info for admin)
  const [editBasicInfo, setEditBasicInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: ''
  });

  // API handlers
  const handlePostProfile = async (profile: UserProfileInterface) => {
    try {
      await PostProfileAPI(profile);
    } catch (error) {
      console.error('Error: Post profile failed', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsPageLoading(true);
        const response = await GetProfileAPI();
        setProfileData(response);
        
        // Sync profile fullName to store for header greeting
        if (response.fullName && response.fullName.trim() && userBasicInfo) {
          const trimmedName = response.fullName.trim();
          if (trimmedName !== userBasicInfo.name) {
            setUserBasicInfo({
              ...userBasicInfo,
              name: trimmedName
            });
          }
        }
      } catch (error) {
        console.error('Error: Fetching user profile failed', error);
      } finally {
        setIsPageLoading(false);
      }
    }
    fetchUserProfile();
  }, []);

  const handleChangeProfile = async (updatedProfile: UserProfileInterface) => {
    try {
      await PutProfileAPI(updatedProfile);
    } catch (error) {
      console.error('Error: Change profile failed, trying POST', error);
      await handlePostProfile(updatedProfile);
    }
  }

  // Modal handlers
  const handleOpenEditModal = () => {
    setEditBasicInfo({
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      address: profileData.address
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    if (isSaving) return;
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...profileData,
        ...editBasicInfo
      };
      await handleChangeProfile(updatedProfile);
      setProfileData(updatedProfile);
      
      // Update the user's display name in the store (for header greeting)
      if (userBasicInfo && editBasicInfo.fullName.trim()) {
        setUserBasicInfo({
          ...userBasicInfo,
          name: editBasicInfo.fullName.trim()
        });
      }
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Basic info handlers
  const handleBasicInfoChange = (field: keyof typeof editBasicInfo, value: string) => {
    setEditBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  // Show loading state while fetching profile
  if (isPageLoading) {
    return (
      <div className='admin-profile-page'>
        <HeaderManager />
        <LoadingSpinner fullPage message="Đang tải hồ sơ..." />
      </div>
    );
  }

  return (
    <div className='admin-profile-page'>
      <HeaderManager />

      <div className='admin-profile-container'>
        {/* Page Header */}
        <div className='admin-profile-page-title-section'>
          <h1 className='admin-profile-page-title'>Hồ sơ quản trị viên</h1>
          <button className='admin-profile-edit-btn' onClick={handleOpenEditModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Chỉnh sửa
          </button>
        </div>

        {/* Profile Card */}
        <div className='admin-profile-card'>
          <div className='admin-profile-avatar'>
            <LetterAvatar name={profileData.fullName || 'A'} size={80} />
          </div>
          <div className='admin-profile-info'>
            <h2 className='admin-profile-name'>
              {profileData.fullName.trim() || <span className='placeholder-text'>Chưa cập nhật họ tên</span>}
            </h2>
            <div className='admin-profile-role'>Quản trị viên</div>
            <div className='admin-profile-contact'>
              {userEmail && (
                <span className='admin-profile-contact-item'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {userEmail}
                </span>
              )}
              <span className='admin-profile-contact-item'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {profileData.phoneNumber.trim() || <span className='placeholder-text'>Chưa cập nhật SĐT</span>}
              </span>
              <span className='admin-profile-contact-item'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profileData.address.trim() || <span className='placeholder-text'>Chưa cập nhật địa chỉ</span>}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className='admin-profile-modal-overlay' onClick={isSaving ? undefined : handleCloseEditModal}>
          <div className='admin-profile-modal' onClick={(e) => e.stopPropagation()}>
            <div className='admin-profile-modal-header'>
              <h2 className='admin-profile-modal-title'>Chỉnh sửa hồ sơ</h2>
              <button 
                className='admin-profile-modal-close' 
                onClick={handleCloseEditModal}
                disabled={isSaving}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className='admin-profile-modal-body'>
              <div className='admin-profile-modal-field'>
                <label className='admin-profile-modal-label'>Họ tên</label>
                <input
                  type='text'
                  className='admin-profile-modal-input'
                  value={editBasicInfo.fullName}
                  onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                  placeholder='Nhập họ tên'
                />
              </div>
              <div className='admin-profile-modal-field'>
                <label className='admin-profile-modal-label'>Số điện thoại</label>
                <input
                  type='tel'
                  className='admin-profile-modal-input'
                  value={editBasicInfo.phoneNumber}
                  onChange={(e) => handleBasicInfoChange('phoneNumber', e.target.value)}
                  placeholder='Nhập số điện thoại'
                />
              </div>
              <div className='admin-profile-modal-field'>
                <label className='admin-profile-modal-label'>Địa chỉ</label>
                <input
                  type='text'
                  className='admin-profile-modal-input'
                  value={editBasicInfo.address}
                  onChange={(e) => handleBasicInfoChange('address', e.target.value)}
                  placeholder='Nhập địa chỉ'
                />
              </div>
            </div>

            <div className='admin-profile-modal-footer'>
              <button 
                className='admin-profile-modal-btn-cancel' 
                onClick={handleCloseEditModal}
                disabled={isSaving}
              >
                Hủy
              </button>
              <button 
                className='admin-profile-modal-btn-save' 
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className='admin-profile-btn-spinner'></span>
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { AdminProfilePage };
