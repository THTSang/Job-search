import '../../styles/pages/PostJobPage.css'
import { HeaderManager } from '../../components/header/employer/HeaderManager';

function PostJobPage() {
  return (
    <div className='post-job-page-container'>
      <HeaderManager />
      <div className='post-job-page-header'>
        <h1 className='post-job-page-title'>Quản lý tin tuyển dụng</h1>
        <p className='post-job-page-subtitle'>Đăng tin và quản lý các vị trí tuyển dụng</p>
      </div>

      <div className='post-job-page-content'>
        {/* Left Section - Job Posting Form */}
        <div className='post-job-form-section'>
          <h2 className='post-job-form-title'>Đăng tin tuyển dụng mới</h2>

          <form className='post-job-form'>
            {/* Job Title */}
            <div className='post-job-form-field'>
              <label className='post-job-form-label'>
                Tiêu đề công việc <span className='required'>*</span>
              </label>
              <input
                type='text'
                className='post-job-form-input'
                placeholder='VD: Senior Frontend Developer'
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
                placeholder='Mô tả chi tiết về vị trí tuyển dụng...'
              />
            </div>

            {/* Job Requirements */}
            <div className='post-job-form-field'>
              <label className='post-job-form-label'>
                Yêu cầu công việc <span className='required'>*</span>
              </label>
              <textarea
                className='post-job-form-textarea'
                rows={5}
                placeholder='Liệt kê các yêu cầu (mỗi yêu cầu một dòng)'
              />
            </div>

            {/* Job Responsibilities */}
            <div className='post-job-form-field'>
              <label className='post-job-form-label'>
                Trách nhiệm công việc
              </label>
              <textarea
                className='post-job-form-textarea'
                rows={4}
                placeholder='Liệt kê các trách nhiệm (mỗi trách nhiệm một dòng)'
              />
            </div>

            {/* Benefits */}
            <div className='post-job-form-field'>
              <label className='post-job-form-label'>
                Quyền lợi
              </label>
              <textarea
                className='post-job-form-textarea'
                rows={4}
                placeholder='Liệt kê các quyền lợi (mỗi quyền lợi một dòng)'
              />
            </div>

            {/* Location and Salary Row */}
            <div className='post-job-form-row'>
              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Địa điểm <span className='required'>*</span>
                </label>
                <input
                  type='text'
                  className='post-job-form-input'
                  placeholder='VD: Hà Nội'
                />
              </div>

              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Mức lương <span className='required'>*</span>
                </label>
                <input
                  type='text'
                  className='post-job-form-input'
                  placeholder='VD: 20-30 triệu VNĐ'
                />
              </div>
            </div>

            {/* Industry and Job Type Row */}
            <div className='post-job-form-row'>
              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Ngành nghề <span className='required'>*</span>
                </label>
                <select className='post-job-form-select'>
                  <option value=''>Chọn ngành nghề</option>
                  <option value='it'>Công nghệ thông tin</option>
                  <option value='marketing'>Marketing</option>
                  <option value='design'>Thiết kế</option>
                  <option value='sales'>Kinh doanh</option>
                </select>
              </div>

              <div className='post-job-form-field'>
                <label className='post-job-form-label'>
                  Loại hình công việc <span className='required'>*</span>
                </label>
                <select className='post-job-form-select'>
                  <option value=''>Chọn loại hình</option>
                  <option value='fulltime'>Toàn thời gian</option>
                  <option value='parttime'>Bán thời gian</option>
                  <option value='contract'>Hợp đồng</option>
                  <option value='intern'>Thực tập</option>
                </select>
              </div>
            </div>

            {/* Experience */}
            <div className='post-job-form-field'>
              <label className='post-job-form-label'>
                Kinh nghiệm <span className='required'>*</span>
              </label>
              <select className='post-job-form-select'>
                <option value=''>Chọn kinh nghiệm</option>
                <option value='0-1'>0-1 năm</option>
                <option value='1-3'>1-3 năm</option>
                <option value='3-5'>3-5 năm</option>
                <option value='5+'>Trên 5 năm</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type='submit' className='post-job-submit-button'>
              <span className='post-job-submit-icon'>+</span>
              Đăng tin tuyển dụng
            </button>
          </form>
        </div>

        {/* Right Section - Posted Jobs List */}
        <div className='posted-jobs-section'>
          <h2 className='posted-jobs-title'>Tin đã đăng (2)</h2>

          <div className='posted-jobs-list'>
            {/* Job Card 1 */}
            <div className='posted-job-card'>
              <div className='posted-job-header'>
                <div className='posted-job-icon'>📋</div>
                <div className='posted-job-info'>
                  <h3 className='posted-job-title'>Senior Backend Developer</h3>
                  <p className='posted-job-location'>Hà Nội</p>
                </div>
              </div>
              <div className='posted-job-footer'>
                <span className='posted-job-status posted-job-status-active'>Đang mở</span>
                <span className='posted-job-date'>2025-01-10</span>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className='posted-job-card'>
              <div className='posted-job-header'>
                <div className='posted-job-icon'>📋</div>
                <div className='posted-job-info'>
                  <h3 className='posted-job-title'>Product Designer</h3>
                  <p className='posted-job-location'>TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div className='posted-job-footer'>
                <span className='posted-job-status posted-job-status-active'>Đang mở</span>
                <span className='posted-job-date'>2025-01-08</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { PostJobPage };
