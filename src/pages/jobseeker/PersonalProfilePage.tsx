import { useState } from 'react';
import { HeaderManager } from '../../components/header/jobseeker/HeaderManager.tsx';
import '../../styles/pages/PersonalProfilePage.css';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  introduction: string;
}

function PersonalProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Nguyen Van A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    location: 'Ha Noi, Viet Nam',
    jobTitle: 'Frontend Developer',
    introduction: 'Frontend Developer voi 3 nam kinh nghiem phat trien ung dung web su dung React, TypeScript va cac cong nghe hien dai. Dam me tao ra nhung giao dien nguoi dung dep mat va hieu qua.'
  });

  const [editFormData, setEditFormData] = useState<ProfileData>(profileData);

  const handleOpenEditModal = () => {
    setEditFormData(profileData);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = () => {
    setProfileData(editFormData);
    setIsEditModalOpen(false);
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className='personal-profile-page'>
      <HeaderManager />

      <div className='personal-profile-container'>
        {/* Page Header */}
        <div className='personal-profile-page-title-section'>
          <h1 className='personal-profile-page-title'>Ho so ca nhan</h1>
          <button className='personal-profile-page-title-config' onClick={handleOpenEditModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Chinh sua ho so
          </button>
        </div>

        {/* Profile Card */}
        <div className='personal-profile-card'>
          <div className='personal-profile-avatar'>{profileData.name.charAt(0).toUpperCase()}</div>
          <div className='personal-profile-info'>
            <h2 className='personal-profile-name'>{profileData.name}</h2>
            <div className='personal-profile-job-title'>{profileData.jobTitle}</div>
            <div className='personal-profile-contact'>
              <span className='personal-profile-contact-item'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {profileData.email}
              </span>
              <span className='personal-profile-contact-item'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {profileData.phone}
              </span>
              <span className='personal-profile-contact-item'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profileData.location}
              </span>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className='personal-profile-section'>
          <h3 className='personal-profile-section-title'>Gioi thieu ban than</h3>
          <p className='personal-profile-section-content'>
            {profileData.introduction}
          </p>
        </div>

        {/* Experience Section */}
        <div className='personal-profile-section'>
          <h3 className='personal-profile-section-title'>Kinh nghiem lam viec</h3>

          <div className='personal-profile-experience-list'>
            <div className='personal-profile-experience-item'>
              <div className='personal-profile-experience-icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className='personal-profile-experience-content'>
                <h4 className='personal-profile-experience-title'>Senior Frontend Developer</h4>
                <div className='personal-profile-experience-company'>Tech Company A</div>
                <div className='personal-profile-experience-period'>2023 - Hien tai</div>
                <p className='personal-profile-experience-description'>
                  Phat trien va duy tri cac ung dung web su dung React, TypeScript, va Next.js
                </p>
              </div>
            </div>

            <div className='personal-profile-experience-item'>
              <div className='personal-profile-experience-icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className='personal-profile-experience-content'>
                <h4 className='personal-profile-experience-title'>Frontend Developer</h4>
                <div className='personal-profile-experience-company'>Startup B</div>
                <div className='personal-profile-experience-period'>2021 - 2023</div>
                <p className='personal-profile-experience-description'>
                  Xay dung giao dien nguoi dung cho san pham SaaS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Education and Skills Section */}
        <div className='personal-profile-two-columns'>
          {/* Education */}
          <div className='personal-profile-section'>
            <h3 className='personal-profile-section-title'>Hoc van</h3>
            <div className='personal-profile-education'>
              <div className='personal-profile-education-degree'>Cu nhan Cong nghe thong tin</div>
              <div className='personal-profile-education-school'>Dai hoc Bach Khoa Ha Noi</div>
              <div className='personal-profile-education-period'>2017 - 2021</div>
            </div>
          </div>

          {/* Skills */}
          <div className='personal-profile-section'>
            <h3 className='personal-profile-section-title'>Ky nang</h3>
            <div className='personal-profile-skills'>
              <span className='personal-profile-skill-tag'>React</span>
              <span className='personal-profile-skill-tag'>TypeScript</span>
              <span className='personal-profile-skill-tag'>JavaScript</span>
              <span className='personal-profile-skill-tag'>HTML/CSS</span>
              <span className='personal-profile-skill-tag'>Tailwind CSS</span>
              <span className='personal-profile-skill-tag'>Next.js</span>
              <span className='personal-profile-skill-tag'>Redux</span>
              <span className='personal-profile-skill-tag'>Git</span>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className='personal-profile-section'>
          <h3 className='personal-profile-section-title'>Du an</h3>

          <div className='personal-profile-projects-list'>
            <div className='personal-profile-project-item'>
              <h4 className='personal-profile-project-title'>E-commerce Platform</h4>
              <p className='personal-profile-project-description'>
                Phat trien nen tang thuong mai dien tu voi React va Node.js
              </p>
              <div className='personal-profile-project-tech'>
                <span className='personal-profile-project-tech-label'>Cong nghe:</span>
                <span className='personal-profile-skill-tag'>React</span>
                <span className='personal-profile-skill-tag'>Node.js</span>
                <span className='personal-profile-skill-tag'>MongoDB</span>
                <span className='personal-profile-skill-tag'>Tailwind CSS</span>
              </div>
              <div className='personal-profile-project-year'>2023</div>
            </div>

            <div className='personal-profile-project-item'>
              <h4 className='personal-profile-project-title'>Admin Dashboard</h4>
              <p className='personal-profile-project-description'>
                Xay dung dashboard quan tri cho he thong CRM
              </p>
              <div className='personal-profile-project-tech'>
                <span className='personal-profile-project-tech-label'>Cong nghe:</span>
                <span className='personal-profile-skill-tag'>React</span>
                <span className='personal-profile-skill-tag'>TypeScript</span>
                <span className='personal-profile-skill-tag'>Chart.js</span>
                <span className='personal-profile-skill-tag'>Material-UI</span>
              </div>
              <div className='personal-profile-project-year'>2022</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className='personal-profile-modal-overlay' onClick={handleCloseEditModal}>
          <div className='personal-profile-modal' onClick={(e) => e.stopPropagation()}>
            <div className='personal-profile-modal-header'>
              <h2 className='personal-profile-modal-title'>Chinh sua ho so</h2>
              <button className='personal-profile-modal-close' onClick={handleCloseEditModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className='personal-profile-modal-body'>
              <div className='personal-profile-modal-field'>
                <label className='personal-profile-modal-label'>Ho ten</label>
                <input
                  type='text'
                  className='personal-profile-modal-input'
                  value={editFormData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='Nhap ho ten'
                />
              </div>

              <div className='personal-profile-modal-field'>
                <label className='personal-profile-modal-label'>
                  Email
                  <span className='personal-profile-modal-label-note'>(Khong the thay doi)</span>
                </label>
                <input
                  type='email'
                  className='personal-profile-modal-input personal-profile-modal-input-disabled'
                  value={editFormData.email}
                  disabled
                />
              </div>

              <div className='personal-profile-modal-field'>
                <label className='personal-profile-modal-label'>So dien thoai</label>
                <input
                  type='tel'
                  className='personal-profile-modal-input'
                  value={editFormData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder='Nhap so dien thoai'
                />
              </div>

              <div className='personal-profile-modal-field'>
                <label className='personal-profile-modal-label'>Dia chi</label>
                <input
                  type='text'
                  className='personal-profile-modal-input'
                  value={editFormData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder='Nhap dia chi'
                />
              </div>

              <div className='personal-profile-modal-field'>
                <label className='personal-profile-modal-label'>Chuc danh</label>
                <input
                  type='text'
                  className='personal-profile-modal-input'
                  value={editFormData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder='VD: Frontend Developer'
                />
              </div>

              <div className='personal-profile-modal-field'>
                <label className='personal-profile-modal-label'>Gioi thieu ban than</label>
                <textarea
                  className='personal-profile-modal-textarea'
                  value={editFormData.introduction}
                  onChange={(e) => handleInputChange('introduction', e.target.value)}
                  placeholder='Viet vai dong gioi thieu ve ban than...'
                  rows={4}
                />
              </div>
            </div>

            <div className='personal-profile-modal-footer'>
              <button className='personal-profile-modal-btn-cancel' onClick={handleCloseEditModal}>
                Huy
              </button>
              <button className='personal-profile-modal-btn-save' onClick={handleSaveProfile}>
                Luu thay doi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { PersonalProfilePage };
