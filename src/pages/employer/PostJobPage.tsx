import { useState } from 'react';
import '../../styles/pages/PostJobPage.css'
import { HeaderManager } from '../../components/header/employer/HeaderManager';
import { useUserCredential } from '../../store';
import type { JobData } from '../../utils/interface';

function PostJobPage() {
  const { userBasicInfo } = useUserCredential();

  // Form state matching JobData interface
  const [formData, setFormData] = useState<Omit<JobData, 'id' | 'postByUserId'>>({
    title: '',
    company: '',
    description: '',
    location: '',
    employmentType: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [postedJobs, setPostedJobs] = useState<JobData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    if (!formData.title || !formData.company || !formData.description ||
      !formData.location || !formData.employmentType) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData: JobData = {
        id: null,
        ...formData,
        postByUserId: userBasicInfo?.id || ''
      };

      // TODO: Call API to post job
      console.log('Posting job:', jobData);

      // Simulate success - add to local list
      const newJob: JobData = {
        ...jobData,
        id: Date.now().toString() // Temporary ID
      };
      setPostedJobs(prev => [newJob, ...prev]);

      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        location: '',
        employmentType: '',
        tags: []
      });
      setSuccess('Đăng tin tuyển dụng thành công!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Đăng tin thất bại. Vui lòng thử lại.');
      console.error('Post job error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title && formData.company && formData.description &&
    formData.location && formData.employmentType;

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

              {/* Company Name */}
              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Tên công ty <span className='required'>*</span>
                </label>
                <input
                  type='text'
                  className='post-job-form-input'
                  placeholder='VD: Công ty ABC'
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>

              {/* Job Description */}
              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Mô tả công việc <span className='required'>*</span>
                </label>
                <textarea
                  className='post-job-form-textarea'
                  rows={5}
                  placeholder='Mô tả chi tiết về vị trí tuyển dụng, yêu cầu, trách nhiệm và quyền lợi...'
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              {/* Location and Employment Type Row */}
              <div className='post-job-form-row'>
                <div className='post-job-form-field'>
                  <label className='post-job-form-label'>
                    Địa điểm <span className='required'>*</span>
                  </label>
                  <input
                    type='text'
                    className='post-job-form-input'
                    placeholder='VD: Hà Nội'
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>

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
              </div>

              {/* Tags */}
              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Tags / Kỹ năng yêu cầu
                </label>
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
                      <div className='posted-job-icon'>📋</div>
                      <div className='posted-job-info'>
                        <h3 className='posted-job-title'>{job.title}</h3>
                        <p className='posted-job-company'>{job.company}</p>
                        <p className='posted-job-location'>{job.location}</p>
                      </div>
                    </div>
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
                      <span className='posted-job-status posted-job-status-active'>
                        {job.employmentType.replace('_', ' ')}
                      </span>
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
