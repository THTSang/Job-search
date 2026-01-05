import { useState, useEffect } from 'react';
import { HeaderManager } from '../../components/header/jobseeker/HeaderManager.tsx';
import '../../styles/pages/PersonalProfilePage.css';
import type { UserProfileInterface, Skill, Experience, Education, Project } from '../../utils/interface';
import { PutProfileAPI, PostProfileAPI, GetProfileAPI } from '../../api'

// TODO: ADD USER PROFILE IMAGE
// Helper function to format date period
const formatPeriod = (startDate: string, endDate: string, isCurrent?: boolean): string => {
  const start = startDate ? new Date(startDate).getFullYear() : '';
  const end = isCurrent ? 'Hiện tại' : (endDate ? new Date(endDate).getFullYear() : '');
  return `${start} - ${end}`;
};

// Generate unique ID for new items
const generateId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Modal tab types
type ModalTab = 'basic' | 'experience' | 'education' | 'skills' | 'projects';

function PersonalProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('basic');

  // Main profile state using UserProfileInterface
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

  // Edit form states
  const [editBasicInfo, setEditBasicInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    professionalTitle: '',
    summary: ''
  });

  const [editExperiences, setEditExperiences] = useState<Experience[]>([]);
  const [editEducations, setEditEducations] = useState<Education[]>([]);
  const [editSkills, setEditSkills] = useState<Skill[]>([]);
  const [editProjects, setEditProjects] = useState<Project[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('TECHNICAL');

  // API handlers
  const handlePostProfile = async () => {
    try {
      await PostProfileAPI(profileData);
    } catch (error) {
      console.error('Error: Post profile failed', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await GetProfileAPI()
        setProfileData(response);
      } catch (error) {
        console.error('Error: Fetching user profile failed', error);
      }
    }
    fetchUserProfile()
  }, [])

  const handleChangeProfile = async (updatedProfile: UserProfileInterface) => {
    try {
      await PutProfileAPI(updatedProfile);
    } catch (error) {
      console.error('Error: Change profile failed', error);
      handlePostProfile();
    }
  }

  // Modal handlers
  const handleOpenEditModal = () => {
    setEditBasicInfo({
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      address: profileData.address,
      professionalTitle: profileData.professionalTitle,
      summary: profileData.summary
    });
    setEditExperiences([...profileData.experiences]);
    setEditEducations([...profileData.educations]);
    setEditSkills([...profileData.skills]);
    setEditProjects([...profileData.projects]);
    setActiveTab('basic');
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setNewSkillName('');
    setNewSkillCategory('TECHNICAL');
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profileData,
      ...editBasicInfo,
      experiences: editExperiences,
      educations: editEducations,
      skills: editSkills,
      projects: editProjects
    };
    setProfileData(updatedProfile);
    setIsEditModalOpen(false);
    handleChangeProfile(updatedProfile);
  };

  // Basic info handlers
  const handleBasicInfoChange = (field: keyof typeof editBasicInfo, value: string) => {
    setEditBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      profileId: profileData.id || '',
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    setEditExperiences([...editExperiences, newExp]);
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    const updated = [...editExperiences];
    updated[index] = { ...updated[index], [field]: value };
    setEditExperiences(updated);
  };

  const handleDeleteExperience = (index: number) => {
    setEditExperiences(editExperiences.filter((_, i) => i !== index));
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      profileId: profileData.id || '',
      institution: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      gpa: 0
    };
    setEditEducations([...editEducations, newEdu]);
  };

  const handleUpdateEducation = (index: number, field: keyof Education, value: string | number) => {
    const updated = [...editEducations];
    updated[index] = { ...updated[index], [field]: value };
    setEditEducations(updated);
  };

  const handleDeleteEducation = (index: number) => {
    setEditEducations(editEducations.filter((_, i) => i !== index));
  };

  // Skills handlers
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: generateId(),
      name: newSkillName.trim(),
      category: newSkillCategory
    };
    setEditSkills([...editSkills, newSkill]);
    setNewSkillName('');
  };

  const handleDeleteSkill = (index: number) => {
    setEditSkills(editSkills.filter((_, i) => i !== index));
  };

  // Project handlers
  const handleAddProject = () => {
    const newProject: Project = {
      id: generateId(),
      profileId: profileData.id || '',
      projectName: '',
      description: '',
      role: '',
      technologies: [],
      projectUrl: '',
      completionYear: new Date().getFullYear()
    };
    setEditProjects([...editProjects, newProject]);
  };

  const handleUpdateProject = (index: number, field: keyof Project, value: string | number | string[]) => {
    const updated = [...editProjects];
    updated[index] = { ...updated[index], [field]: value };
    setEditProjects(updated);
  };

  const handleDeleteProject = (index: number) => {
    setEditProjects(editProjects.filter((_, i) => i !== index));
  };

  const handleProjectTechChange = (index: number, techString: string) => {
    const technologies = techString.split(',').map(t => t.trim()).filter(t => t);
    handleUpdateProject(index, 'technologies', technologies);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className='personal-profile-modal-tab-content'>
            <div className='personal-profile-modal-field'>
              <label className='personal-profile-modal-label'>Họ tên</label>
              <input
                type='text'
                className='personal-profile-modal-input'
                value={editBasicInfo.fullName}
                onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                placeholder='Nhập họ tên'
              />
            </div>
            <div className='personal-profile-modal-field'>
              <label className='personal-profile-modal-label'>Số điện thoại</label>
              <input
                type='tel'
                className='personal-profile-modal-input'
                value={editBasicInfo.phoneNumber}
                onChange={(e) => handleBasicInfoChange('phoneNumber', e.target.value)}
                placeholder='Nhập số điện thoại'
              />
            </div>
            <div className='personal-profile-modal-field'>
              <label className='personal-profile-modal-label'>Địa chỉ</label>
              <input
                type='text'
                className='personal-profile-modal-input'
                value={editBasicInfo.address}
                onChange={(e) => handleBasicInfoChange('address', e.target.value)}
                placeholder='Nhập địa chỉ'
              />
            </div>
            <div className='personal-profile-modal-field'>
              <label className='personal-profile-modal-label'>Chức danh</label>
              <input
                type='text'
                className='personal-profile-modal-input'
                value={editBasicInfo.professionalTitle}
                onChange={(e) => handleBasicInfoChange('professionalTitle', e.target.value)}
                placeholder='VD: Frontend Developer'
              />
            </div>
            <div className='personal-profile-modal-field'>
              <label className='personal-profile-modal-label'>Giới thiệu bản thân</label>
              <textarea
                className='personal-profile-modal-textarea'
                value={editBasicInfo.summary}
                onChange={(e) => handleBasicInfoChange('summary', e.target.value)}
                placeholder='Viết vài dòng giới thiệu về bản thân...'
                rows={4}
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className='personal-profile-modal-tab-content'>
            <button className='personal-profile-modal-add-btn' onClick={handleAddExperience}>
              + Thêm kinh nghiệm
            </button>
            {editExperiences.map((exp, index) => (
              <div key={exp.id || index} className='personal-profile-modal-item-card'>
                <button
                  className='personal-profile-modal-delete-btn'
                  onClick={() => handleDeleteExperience(index)}
                >
                  ×
                </button>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Vị trí</label>
                  <input
                    type='text'
                    className='personal-profile-modal-input'
                    value={exp.position}
                    onChange={(e) => handleUpdateExperience(index, 'position', e.target.value)}
                    placeholder='VD: Frontend Developer'
                  />
                </div>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Công ty</label>
                  <input
                    type='text'
                    className='personal-profile-modal-input'
                    value={exp.companyName}
                    onChange={(e) => handleUpdateExperience(index, 'companyName', e.target.value)}
                    placeholder='Tên công ty'
                  />
                </div>
                <div className='personal-profile-modal-row'>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Ngày bắt đầu</label>
                    <input
                      type='date'
                      className='personal-profile-modal-input'
                      value={exp.startDate}
                      onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Ngày kết thúc</label>
                    <input
                      type='date'
                      className='personal-profile-modal-input'
                      value={exp.endDate}
                      onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                      disabled={exp.isCurrent}
                    />
                  </div>
                </div>
                <div className='personal-profile-modal-field personal-profile-modal-checkbox'>
                  <input
                    type='checkbox'
                    id={`current-${index}`}
                    checked={exp.isCurrent}
                    onChange={(e) => handleUpdateExperience(index, 'isCurrent', e.target.checked)}
                  />
                  <label htmlFor={`current-${index}`}>Đang làm việc tại đây</label>
                </div>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Mô tả công việc</label>
                  <textarea
                    className='personal-profile-modal-textarea'
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                    placeholder='Mô tả công việc và thành tựu...'
                    rows={3}
                  />
                </div>
              </div>
            ))}
            {editExperiences.length === 0 && (
              <div className='personal-profile-modal-empty'>
                Chưa có kinh nghiệm làm việc. Nhấn "Thêm kinh nghiệm" để bắt đầu.
              </div>
            )}
          </div>
        );

      case 'education':
        return (
          <div className='personal-profile-modal-tab-content'>
            <button className='personal-profile-modal-add-btn' onClick={handleAddEducation}>
              + Thêm học vấn
            </button>
            {editEducations.map((edu, index) => (
              <div key={edu.id || index} className='personal-profile-modal-item-card'>
                <button
                  className='personal-profile-modal-delete-btn'
                  onClick={() => handleDeleteEducation(index)}
                >
                  ×
                </button>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Trường học</label>
                  <input
                    type='text'
                    className='personal-profile-modal-input'
                    value={edu.institution}
                    onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                    placeholder='Tên trường'
                  />
                </div>
                <div className='personal-profile-modal-row'>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Bằng cấp</label>
                    <input
                      type='text'
                      className='personal-profile-modal-input'
                      value={edu.degree}
                      onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                      placeholder='VD: Cử nhân'
                    />
                  </div>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Chuyên ngành</label>
                    <input
                      type='text'
                      className='personal-profile-modal-input'
                      value={edu.major}
                      onChange={(e) => handleUpdateEducation(index, 'major', e.target.value)}
                      placeholder='VD: Công nghệ thông tin'
                    />
                  </div>
                </div>
                <div className='personal-profile-modal-row'>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Ngày bắt đầu</label>
                    <input
                      type='date'
                      className='personal-profile-modal-input'
                      value={edu.startDate}
                      onChange={(e) => handleUpdateEducation(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Ngày tốt nghiệp</label>
                    <input
                      type='date'
                      className='personal-profile-modal-input'
                      value={edu.endDate}
                      onChange={(e) => handleUpdateEducation(index, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>GPA</label>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    max='4'
                    className='personal-profile-modal-input'
                    value={edu.gpa || ''}
                    onChange={(e) => handleUpdateEducation(index, 'gpa', parseFloat(e.target.value) || 0)}
                    placeholder='VD: 3.5'
                  />
                </div>
              </div>
            ))}
            {editEducations.length === 0 && (
              <div className='personal-profile-modal-empty'>
                Chưa có thông tin học vấn. Nhấn "Thêm học vấn" để bắt đầu.
              </div>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className='personal-profile-modal-tab-content'>
            <div className='personal-profile-modal-skill-input-group'>
              <input
                type='text'
                className='personal-profile-modal-input'
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder='Nhập tên kỹ năng'
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <select
                className='personal-profile-modal-select'
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
              >
                <option value="TECHNICAL">Kỹ năng kỹ thuật</option>
                <option value="SOFT">Kỹ năng mềm</option>
                <option value="LANGUAGE">Ngôn ngữ</option>
                <option value="OTHER">Khác</option>
              </select>
              <button className='personal-profile-modal-add-skill-btn' onClick={handleAddSkill}>
                Thêm
              </button>
            </div>
            <div className='personal-profile-modal-skills-list'>
              {editSkills.map((skill, index) => (
                <div key={skill.id || index} className='personal-profile-modal-skill-item'>
                  <span className='personal-profile-modal-skill-name'>{skill.name}</span>
                  <span className='personal-profile-modal-skill-category'>
                    {skill.category === 'TECHNICAL' ? 'Kỹ thuật' :
                      skill.category === 'SOFT' ? 'Mềm' :
                        skill.category === 'LANGUAGE' ? 'Ngôn ngữ' : 'Khác'}
                  </span>
                  <button
                    className='personal-profile-modal-skill-delete'
                    onClick={() => handleDeleteSkill(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {editSkills.length === 0 && (
              <div className='personal-profile-modal-empty'>
                Chưa có kỹ năng. Nhập tên kỹ năng và nhấn "Thêm" để bắt đầu.
              </div>
            )}
          </div>
        );

      case 'projects':
        return (
          <div className='personal-profile-modal-tab-content'>
            <button className='personal-profile-modal-add-btn' onClick={handleAddProject}>
              + Thêm dự án
            </button>
            {editProjects.map((project, index) => (
              <div key={project.id || index} className='personal-profile-modal-item-card'>
                <button
                  className='personal-profile-modal-delete-btn'
                  onClick={() => handleDeleteProject(index)}
                >
                  ×
                </button>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Tên dự án</label>
                  <input
                    type='text'
                    className='personal-profile-modal-input'
                    value={project.projectName}
                    onChange={(e) => handleUpdateProject(index, 'projectName', e.target.value)}
                    placeholder='Tên dự án'
                  />
                </div>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Mô tả</label>
                  <textarea
                    className='personal-profile-modal-textarea'
                    value={project.description}
                    onChange={(e) => handleUpdateProject(index, 'description', e.target.value)}
                    placeholder='Mô tả dự án...'
                    rows={3}
                  />
                </div>
                <div className='personal-profile-modal-row'>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Vai trò</label>
                    <input
                      type='text'
                      className='personal-profile-modal-input'
                      value={project.role}
                      onChange={(e) => handleUpdateProject(index, 'role', e.target.value)}
                      placeholder='VD: Team Leader'
                    />
                  </div>
                  <div className='personal-profile-modal-field'>
                    <label className='personal-profile-modal-label'>Năm hoàn thành</label>
                    <input
                      type='number'
                      className='personal-profile-modal-input'
                      value={project.completionYear}
                      onChange={(e) => handleUpdateProject(index, 'completionYear', parseInt(e.target.value) || 0)}
                      placeholder='VD: 2024'
                    />
                  </div>
                </div>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Công nghệ sử dụng</label>
                  <input
                    type='text'
                    className='personal-profile-modal-input'
                    value={project.technologies.join(', ')}
                    onChange={(e) => handleProjectTechChange(index, e.target.value)}
                    placeholder='React, TypeScript, Node.js (phân cách bằng dấu phẩy)'
                  />
                </div>
                <div className='personal-profile-modal-field'>
                  <label className='personal-profile-modal-label'>Link dự án</label>
                  <input
                    type='url'
                    className='personal-profile-modal-input'
                    value={project.projectUrl}
                    onChange={(e) => handleUpdateProject(index, 'projectUrl', e.target.value)}
                    placeholder='https://github.com/...'
                  />
                </div>
              </div>
            ))}
            {editProjects.length === 0 && (
              <div className='personal-profile-modal-empty'>
                Chưa có dự án. Nhấn "Thêm dự án" để bắt đầu.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='personal-profile-page'>
      <HeaderManager />

      <div className='personal-profile-container'>
        {/* Page Header */}
        <div className='personal-profile-page-title-section'>
          <h1 className='personal-profile-page-title'>Hồ sơ cá nhân</h1>
          <button className='personal-profile-page-title-config' onClick={handleOpenEditModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Chỉnh sửa hồ sơ
          </button>
        </div>

        {/* Profile Card */}
        <div className='personal-profile-card'>
          <div className='personal-profile-avatar'>
            {profileData.avatarUrl ? (
              <img src={profileData.avatarUrl} alt={profileData.fullName} />
            ) : (
              profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : '?'
            )}
          </div>
          <div className='personal-profile-info'>
            <h2 className='personal-profile-name'>
              {profileData.fullName.trim() || <span className='placeholder-text'>Chưa cập nhật họ tên</span>}
            </h2>
            <div className='personal-profile-job-title'>
              {profileData.professionalTitle.trim() || <span className='placeholder-text'>Chưa cập nhật chức danh</span>}
            </div>
            <div className='personal-profile-contact'>
              <span className='personal-profile-contact-item'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {profileData.phoneNumber.trim() || <span className='placeholder-text'>Chưa cập nhật SĐT</span>}
              </span>
              <span className='personal-profile-contact-item'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {profileData.address.trim() || <span className='placeholder-text'>Chưa cập nhật địa chỉ</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className='personal-profile-section'>
          <h3 className='personal-profile-section-title'>Giới thiệu bản thân</h3>
          <p className='personal-profile-section-content'>
            {profileData.summary.trim() || <span className='placeholder-text'>Chưa có giới thiệu. Nhấn "Chỉnh sửa hồ sơ" để thêm.</span>}
          </p>
        </div>

        {/* Experience Section */}
        <div className='personal-profile-section'>
          <h3 className='personal-profile-section-title'>Kinh nghiệm làm việc</h3>

          <div className='personal-profile-experience-list'>
            {profileData.experiences.length === 0 ? (
              <div className='personal-profile-empty-state'>
                <span className='placeholder-text'>Chưa có kinh nghiệm làm việc. Nhấn "Chỉnh sửa hồ sơ" để thêm.</span>
              </div>
            ) : (
              profileData.experiences.map((exp: Experience) => (
                <div key={exp.id} className='personal-profile-experience-item'>
                  <div className='personal-profile-experience-icon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className='personal-profile-experience-content'>
                    <h4 className='personal-profile-experience-title'>{exp.position}</h4>
                    <div className='personal-profile-experience-company'>{exp.companyName}</div>
                    <div className='personal-profile-experience-period'>
                      {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                    </div>
                    <p className='personal-profile-experience-description'>{exp.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Education and Skills Section */}
        <div className='personal-profile-two-columns'>
          {/* Education */}
          <div className='personal-profile-section'>
            <h3 className='personal-profile-section-title'>Học vấn</h3>
            {profileData.educations.length === 0 ? (
              <div className='personal-profile-empty-state'>
                <span className='placeholder-text'>Chưa có thông tin học vấn. Nhấn "Chỉnh sửa hồ sơ" để thêm.</span>
              </div>
            ) : (
              profileData.educations.map((edu: Education) => (
                <div key={edu.id} className='personal-profile-education'>
                  <div className='personal-profile-education-degree'>{edu.degree} - {edu.major}</div>
                  <div className='personal-profile-education-school'>{edu.institution}</div>
                  <div className='personal-profile-education-period'>
                    {formatPeriod(edu.startDate, edu.endDate)}
                  </div>
                  {edu.gpa > 0 && (
                    <div className='personal-profile-education-gpa'>GPA: {edu.gpa}</div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Skills */}
          <div className='personal-profile-section'>
            <h3 className='personal-profile-section-title'>Kỹ năng</h3>
            <div className='personal-profile-skills'>
              {profileData.skills.length === 0 ? (
                <span className='placeholder-text'>Chưa có kỹ năng. Nhấn "Chỉnh sửa hồ sơ" để thêm.</span>
              ) : (
                profileData.skills.map((skill: Skill) => (
                  <span key={skill.id || skill.name} className='personal-profile-skill-tag'>{skill.name}</span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className='personal-profile-section'>
          <h3 className='personal-profile-section-title'>Dự án</h3>

          <div className='personal-profile-projects-list'>
            {profileData.projects.length === 0 ? (
              <div className='personal-profile-empty-state'>
                <span className='placeholder-text'>Chưa có dự án. Nhấn "Chỉnh sửa hồ sơ" để thêm.</span>
              </div>
            ) : (
              profileData.projects.map((project: Project) => (
                <div key={project.id} className='personal-profile-project-item'>
                  <h4 className='personal-profile-project-title'>{project.projectName}</h4>
                  <p className='personal-profile-project-description'>{project.description}</p>
                  {project.role && (
                    <div className='personal-profile-project-role'>
                      <span className='personal-profile-project-role-label'>Vai trò:</span> {project.role}
                    </div>
                  )}
                  <div className='personal-profile-project-tech'>
                    <span className='personal-profile-project-tech-label'>Công nghệ:</span>
                    {project.technologies.map((tech, index) => (
                      <span key={index} className='personal-profile-skill-tag'>{tech}</span>
                    ))}
                  </div>
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className='personal-profile-project-link'>
                      Xem dự án
                    </a>
                  )}
                  <div className='personal-profile-project-year'>{project.completionYear}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className='personal-profile-modal-overlay' onClick={handleCloseEditModal}>
          <div className='personal-profile-modal personal-profile-modal-large' onClick={(e) => e.stopPropagation()}>
            <div className='personal-profile-modal-header'>
              <h2 className='personal-profile-modal-title'>Chỉnh sửa hồ sơ</h2>
              <button className='personal-profile-modal-close' onClick={handleCloseEditModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className='personal-profile-modal-tabs'>
              <button
                className={`personal-profile-modal-tab ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Thông tin cơ bản
              </button>
              <button
                className={`personal-profile-modal-tab ${activeTab === 'experience' ? 'active' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                Kinh nghiệm
              </button>
              <button
                className={`personal-profile-modal-tab ${activeTab === 'education' ? 'active' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Học vấn
              </button>
              <button
                className={`personal-profile-modal-tab ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                Kỹ năng
              </button>
              <button
                className={`personal-profile-modal-tab ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                Dự án
              </button>
            </div>

            <div className='personal-profile-modal-body'>
              {renderTabContent()}
            </div>

            <div className='personal-profile-modal-footer'>
              <button className='personal-profile-modal-btn-cancel' onClick={handleCloseEditModal}>
                Hủy
              </button>
              <button className='personal-profile-modal-btn-save' onClick={handleSaveProfile}>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { PersonalProfilePage };
