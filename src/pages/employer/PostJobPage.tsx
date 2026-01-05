import { useState, useEffect } from 'react';
import '../../styles/pages/PostJobPage.css'
import { HeaderManager } from '../../components/header/employer/HeaderManager';
import { useUserCredential } from '../../store';
import type { JobData, JobPostRequest, EmploymentType, JobLocationRequest, JobCategoryRequest, CompanyProfileInterface } from '../../utils/interface';
import { PostJobAPI } from '../../api';
import { GetCompanyAPI } from '../../api/company';

// TODO: UPDATE LOGO COMPANY FOR JOB
//
interface JobFormData {
  title: string;
  description: string;
  location: JobLocationRequest;
  employmentType: EmploymentType | '';
  minExperience: number;
  salaryMin: number;
  salaryMax: number;
  category: JobCategoryRequest;
  deadline: string;
  tags: string[];
}

const emptyFormData: JobFormData = {
  title: '',
  description: '',
  location: {
    city: '',
    address: ''
  },
  employmentType: '',
  minExperience: 0,
  salaryMin: 0,
  salaryMax: 0,
  category: {
    name: ''
  },
  deadline: '',
  tags: []
};

function PostJobPage() {
  const { userBasicInfo } = useUserCredential();

  const [formData, setFormData] = useState<JobFormData>(emptyFormData);
  const [tagInput, setTagInput] = useState('');
  const [postedJobs, setPostedJobs] = useState<JobData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [company, setCompany] = useState<CompanyProfileInterface | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);

  // Fetch user's company on mount
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await GetCompanyAPI();
        setCompany(companyData);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Vui lòng tạo hồ sơ công ty trước khi đăng tin tuyển dụng');
      } finally {
        setIsLoadingCompany(false);
      }
    };
    fetchCompany();
  }, []);

  // Handle simple field changes
  const handleInputChange = (field: keyof JobFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle nested location fields
  const handleLocationChange = (field: keyof JobFormData['location'], value: string) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  // Handle nested category fields
  const handleCategoryChange = (field: keyof JobFormData['category'], value: string) => {
    setFormData(prev => ({
      ...prev,
      category: { ...prev.category, [field]: value }
    }));
  };

  // Tag handlers
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!company?.id) {
      setError('Vui lòng tạo hồ sơ công ty trước khi đăng tin tuyển dụng');
      return;
    }

    if (!formData.title || !formData.description ||
      !formData.location.city || !formData.employmentType) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    if (formData.salaryMin > formData.salaryMax && formData.salaryMax > 0) {
      setError('Mức lương tối thiểu không được lớn hơn mức lương tối đa');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build request body matching API schema
      const jobPostRequest: JobPostRequest = {
        title: formData.title,
        companyId: company.id,
        description: formData.description,
        location: {
          city: formData.location.city,
          address: formData.location.address
        },
        category: {
          name: formData.category.name
        },
        employmentType: formData.employmentType as EmploymentType,
        minExperience: formData.minExperience,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : new Date().toISOString(),
        tags: formData.tags,
        postedByUserId: userBasicInfo?.id || ''
      };

      console.log('Posting job:', jobPostRequest);
      const createdJob = await PostJobAPI(jobPostRequest);

      // Add to local list if successful
      if (createdJob) {
        setPostedJobs(prev => [createdJob, ...prev]);
      }

      // Reset form
      setFormData(emptyFormData);
      setSuccess('Đăng tin tuyển dụng thành công!');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Đăng tin thất bại. Vui lòng thử lại.');
      console.error('Post job error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.description &&
    formData.location.city && formData.employmentType && company?.id;

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return amount.toLocaleString('vi-VN');
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

  if (isLoadingCompany) {
    return (
      <>
        <HeaderManager />
        <div className='post-job-page-container'>
          <div className='post-job-loading'>Đang tải...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderManager />
      <div className='post-job-page-container'>
        <div className='post-job-page-header'>
          <h1 className='post-job-page-title'>Quản lý tin tuyển dụng</h1>
          <p className='post-job-page-subtitle'>Đăng tin và quản lý các vị trí tuyển dụng</p>
        </div>

        <div className='post-job-page-content'>
          {/* Left Section - Job Posting Form */}
          <div className='post-job-form-section'>
            <h2 className='post-job-form-title'>Đăng tin tuyển dụng mới</h2>

            {/* Company Info Display */}
            {company ? (
              <div className='post-job-company-info'>
                <div className='post-job-company-logo'>
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} />
                  ) : (
                    <span>{company.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className='post-job-company-details'>
                  <span className='post-job-company-name'>{company.name}</span>
                  <span className='post-job-company-industry'>{company.industry || 'Chưa cập nhật ngành nghề'}</span>
                </div>
              </div>
            ) : (
              <div className='post-job-no-company'>
                <p>Bạn chưa có hồ sơ công ty.</p>
                <a href='/employer/companyprofile'>Tạo hồ sơ công ty</a>
              </div>
            )}

            {error && <div className='post-job-error'>{error}</div>}
            {success && <div className='post-job-success'>{success}</div>}

            <form className='post-job-form' onSubmit={handleSubmit}>
              {/* Job Title */}
              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Tiêu đề công việc <span className='required'>*</span>
                </label>
                <input
                  type='text'
                  className='post-job-form-input'
                  placeholder='VD: Senior Frontend Developer'
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              {/* Job Description */}
              <div className='post-job-form-section-divider'>
                <h3 className='post-job-form-section-title'>Mô tả công việc</h3>
              </div>

              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Mô tả chi tiết <span className='required'>*</span>
                </label>
                <textarea
                  className='post-job-form-textarea'
                  rows={6}
                  placeholder='Mô tả chi tiết về vị trí tuyển dụng, yêu cầu, trách nhiệm và quyền lợi...'
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* Location Section */}
              <div className='post-job-form-section-divider'>
                <h3 className='post-job-form-section-title'>Địa điểm làm việc</h3>
              </div>

              <div className='post-job-form-row'>
                <div className='post-job-form-field'>
                  <label className='post-job-form-label'>
                    Thành phố <span className='required'>*</span>
                  </label>
                  <input
                    type='text'
                    className='post-job-form-input'
                    placeholder='VD: Hà Nội'
                    value={formData.location.city}
                    onChange={(e) => handleLocationChange('city', e.target.value)}
                  />
                </div>
                <div className='post-job-form-field'>
                  <label className='post-job-form-label'>Địa chỉ cụ thể</label>
                  <input
                    type='text'
                    className='post-job-form-input'
                    placeholder='VD: Tầng 10, Tòa nhà ABC, 123 Đường XYZ'
                    value={formData.location.address}
                    onChange={(e) => handleLocationChange('address', e.target.value)}
                  />
                </div>
              </div>

              {/* Job Details Section */}
              <div className='post-job-form-section-divider'>
                <h3 className='post-job-form-section-title'>Chi tiết công việc</h3>
              </div>

              <div className='post-job-form-row'>
                <div className='post-job-form-field'>
                  <label className='post-job-form-label'>
                    Loại hình công việc <span className='required'>*</span>
                  </label>
                  <select
                    className='post-job-form-select'
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  >
                    <option value=''>Chọn loại hình</option>
                    <option value='FULL_TIME'>Toàn thời gian</option>
                    <option value='PART_TIME'>Bán thời gian</option>
                    <option value='CONTRACT'>Hợp đồng</option>
                    <option value='INTERNSHIP'>Thực tập</option>
                    <option value='REMOTE'>Làm việc từ xa</option>
                  </select>
                </div>

                <div className='post-job-form-field'>
                  <label className='post-job-form-label'>Kinh nghiệm tối thiểu (năm)</label>
                  <input
                    type='number'
                    className='post-job-form-input'
                    placeholder='VD: 2'
                    min='0'
                    value={formData.minExperience || ''}
                    onChange={(e) => handleInputChange('minExperience', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className='post-job-form-field'>
                <label className='post-job-form-label'>Danh mục công việc</label>
                <input
                  type='text'
                  className='post-job-form-input'
                  placeholder='VD: Công nghệ thông tin'
                  value={formData.category.name}
                  onChange={(e) => handleCategoryChange('name', e.target.value)}
                />
              </div>

              {/* Salary Section */}
              <div className='post-job-form-section-divider'>
                <h3 className='post-job-form-section-title'>Mức lương (VNĐ)</h3>
              </div>

              <div className='post-job-form-row'>
                <div className='post-job-form-field'>
                  <label className='post-job-form-label'>Lương tối thiểu</label>
                  <input
                    type='number'
                    className='post-job-form-input'
                    placeholder='VD: 15000000'
                    min='0'
                    value={formData.salaryMin || ''}
                    onChange={(e) => handleInputChange('salaryMin', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className='post-job-form-field'>
                  <label className='post-job-form-label'>Lương tối đa</label>
                  <input
                    type='number'
                    className='post-job-form-input'
                    placeholder='VD: 25000000'
                    min='0'
                    value={formData.salaryMax || ''}
                    onChange={(e) => handleInputChange('salaryMax', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className='post-job-form-field'>
                <label className='post-job-form-label'>Hạn nộp hồ sơ</label>
                <input
                  type='date'
                  className='post-job-form-input'
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className='post-job-form-section-divider'>
                <h3 className='post-job-form-section-title'>Tags / Kỹ năng yêu cầu</h3>
              </div>

              <div className='post-job-form-field'>
                <div className='post-job-tags-input-container'>
                  <input
                    type='text'
                    className='post-job-form-input post-job-tags-input'
                    placeholder='Nhập tag và nhấn Enter (VD: React, TypeScript, Node.js)'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button
                    type='button'
                    className='post-job-add-tag-button'
                    onClick={handleAddTag}
                  >
                    Thêm
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className='post-job-tags-list'>
                    {formData.tags.map((tag, index) => (
                      <span key={index} className='post-job-tag'>
                        {tag}
                        <button
                          type='button'
                          className='post-job-tag-remove'
                          onClick={() => handleRemoveTag(tag)}
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                className='post-job-submit-button'
                disabled={!isFormValid || isSubmitting}
              >
                <span className='post-job-submit-icon'>+</span>
                {isSubmitting ? 'Đang đăng...' : 'Đăng tin tuyển dụng'}
              </button>
            </form>
          </div>

          {/* Right Section - Posted Jobs List */}
          <div className='posted-jobs-section'>
            <h2 className='posted-jobs-title'>
              Tin đã đăng ({postedJobs.length})
            </h2>

            <div className='posted-jobs-list'>
              {postedJobs.length === 0 ? (
                <div className='posted-jobs-empty'>
                  <div className='posted-jobs-empty-icon'>📋</div>
                  <p className='posted-jobs-empty-text'>Chưa có tin tuyển dụng nào</p>
                  <p className='posted-jobs-empty-subtext'>Đăng tin đầu tiên của bạn ngay!</p>
                </div>
              ) : (
                postedJobs.map((job) => (
                  <div key={job.id} className='posted-job-card'>
                    <div className='posted-job-header'>
                      <div className='posted-job-icon'>
                        {job.company.logoUrl ? (
                          <img src={job.company.logoUrl} alt={job.company.name} />
                        ) : (
                          '📋'
                        )}
                      </div>
                      <div className='posted-job-info'>
                        <h3 className='posted-job-title'>{job.title}</h3>
                        <p className='posted-job-company'>{job.company.name}</p>
                        <p className='posted-job-location'>{job.location.city}</p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className='posted-job-details'>
                      <span className='posted-job-detail'>
                        {getEmploymentTypeLabel(job.employmentType)}
                      </span>
                      {job.minExperience > 0 && (
                        <span className='posted-job-detail'>
                          {job.minExperience}+ năm KN
                        </span>
                      )}
                      {(job.salaryMin > 0 || job.salaryMax > 0) && (
                        <span className='posted-job-detail'>
                          {job.salaryMin > 0 && job.salaryMax > 0
                            ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`
                            : job.salaryMax > 0
                              ? `Đến ${formatSalary(job.salaryMax)}`
                              : `Từ ${formatSalary(job.salaryMin)}`
                          }
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {job.tags.length > 0 && (
                      <div className='posted-job-tags'>
                        {job.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className='posted-job-tag-chip'>{tag}</span>
                        ))}
                        {job.tags.length > 3 && (
                          <span className='posted-job-tag-more'>+{job.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    <div className='posted-job-footer'>
                      <span className={`posted-job-status posted-job-status-${job.status.toLowerCase()}`}>
                        {job.status === 'OPEN' ? 'Đang mở' : job.status === 'DRAFT' ? 'Bản nháp' : 'Đã đóng'}
                      </span>
                      {job.deadline && (
                        <span className='posted-job-deadline'>
                          Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export { PostJobPage };
