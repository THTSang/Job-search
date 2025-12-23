import '../../styles/pages/CreateCompany.css'
import { HeaderManager } from '../../components/header/employer/HeaderManager';

function CreateCompanyPage() {

  return (
    <div className='create-company-page-container'>
      <HeaderManager />
      <div className='create-company-page-header'>
        <h1 className='create-company-page-title'>Tạo hồ sơ công ty</h1>
        <p className='create-company-page-subtitle'>Điền thông tin để tạo hồ sơ công ty và bắt đầu tuyển dụng</p>
      </div>

      <div className='create-company-page-form'>
        {/* Section 1: Basic Information */}
        <div className='create-company-form-section'>
          <h2 className='form-section-title'>Thông tin cơ bản</h2>

          {/* Company Name */}
          <div className='form-field'>
            <label className='form-label'>
              Tên công ty <span className='required'>*</span>
            </label>
            <input
              type='text'
              className='form-input'
              placeholder='VD: FPT Software'
            />
          </div>

          {/* Industry and Company Size Row */}
          <div className='form-row'>
            <div className='form-field'>
              <label className='form-label'>
                Ngành nghề <span className='required'>*</span>
              </label>
              <select className='form-select'>
                <option value=''>Chọn ngành nghề</option>
                <option value='it'>Công nghệ thông tin</option>
                <option value='finance'>Tài chính</option>
                <option value='education'>Giáo dục</option>
                <option value='healthcare'>Y tế</option>
              </select>
            </div>

            <div className='form-field'>
              <label className='form-label'>
                Quy mô công ty <span className='required'>*</span>
              </label>
              <select className='form-select'>
                <option value=''>Chọn quy mô</option>
                <option value='1-10'>1-10 nhân viên</option>
                <option value='11-50'>11-50 nhân viên</option>
                <option value='51-200'>51-200 nhân viên</option>
                <option value='201-500'>201-500 nhân viên</option>
                <option value='500+'>500+ nhân viên</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className='form-field'>
            <label className='form-label'>
              Địa chỉ <span className='required'>*</span>
            </label>
            <input
              type='text'
              className='form-input'
              placeholder='VD: Tầng 5, Tòa nhà ABC, Hà Nội'
            />
          </div>

          {/* Company Logo */}
          <div className='form-field'>
            <label className='form-label'>Logo công ty</label>
            <div className='file-upload-area'>
              <div className='file-upload-icon'>📤</div>
              <p className='file-upload-text'>
                Kéo thả ảnh hoặc <span className='file-upload-link'>chọn file</span>
              </p>
              <p className='file-upload-hint'>PNG, JPG (Tối đa 2MB)</p>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className='create-company-form-section'>
          <h2 className='form-section-title'>Thông tin liên hệ</h2>

          {/* Email and Phone Row */}
          <div className='form-row'>
            <div className='form-field'>
              <label className='form-label'>
                Email liên hệ <span className='required'>*</span>
              </label>
              <input
                type='email'
                className='form-input'
                placeholder='contact@company.com'
              />
            </div>

            <div className='form-field'>
              <label className='form-label'>
                Số điện thoại <span className='required'>*</span>
              </label>
              <input
                type='tel'
                className='form-input'
                placeholder='024 1234 5678'
              />
            </div>
          </div>

          {/* Website */}
          <div className='form-field'>
            <label className='form-label'>Website</label>
            <input
              type='url'
              className='form-input'
              placeholder='https://company.com'
            />
          </div>
        </div>

        {/* Section 3: Company Description */}
        <div className='create-company-form-section'>
          <h2 className='form-section-title'>Giới thiệu công ty</h2>

          <div className='form-field'>
            <label className='form-label'>
              Mô tả <span className='required'>*</span>
            </label>
            <textarea
              className='form-textarea'
              rows={8}
              placeholder='Giới thiệu về công ty, văn hóa, sản phẩm/dịch vụ...'
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='form-actions'>
          <button type='submit' className='submit-button'>
            <span className='submit-icon'>📋</span>
            Tạo công ty
          </button>
          <button type='button' className='cancel-button'>
            Hủy
          </button>
        </div>
      </div>

    </div>
  );
}
export { CreateCompanyPage };
