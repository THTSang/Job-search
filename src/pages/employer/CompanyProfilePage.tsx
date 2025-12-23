import { HeaderManager } from '../../components/header/employer/HeaderManager';
import '../../styles/pages/CompanyProfilePage.css';

function CompanyProfilePage() {
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
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </div>
            <button className="profile-change-logo-button">Đổi logo</button>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Thông tin cơ bản</h2>
            <button className="profile-edit-button">
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
              <div className="profile-info-value">Công ty TNHH ABC</div>
            </div>

            <div className="profile-info-item">
              <label className="profile-info-label">Ngành nghề</label>
              <div className="profile-info-value">Công nghệ thông tin</div>
            </div>

            <div className="profile-info-item">
              <label className="profile-info-label">Quy mô</label>
              <div className="profile-info-value">100-500 nhân viên</div>
            </div>

            <div className="profile-info-item">
              <label className="profile-info-label">Website</label>
              <a href="#" className="profile-info-link">https://abc.com.vn</a>
            </div>

            <div className="profile-info-item">
              <label className="profile-info-label">Email</label>
              <div className="profile-info-value">contact@abc.com.vn</div>
            </div>

            <div className="profile-info-item">
              <label className="profile-info-label">Số điện thoại</label>
              <div className="profile-info-value">+84 123 456 789</div>
            </div>

            <div className="profile-info-item profile-info-full-width">
              <label className="profile-info-label">Địa chỉ</label>
              <div className="profile-info-value">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</div>
            </div>
          </div>
        </div>

        {/* Company Description Section */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Giới thiệu công ty</h2>
            <button className="profile-edit-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Chỉnh sửa
            </button>
          </div>

          <div className="profile-description">
            <p>
              Chúng tôi là một công ty công nghệ hàng đầu chuyên cung cấp các giải pháp phần mềm và dịch vụ tư vấn công nghệ thông tin.
              Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao nhất cho khách hàng.
            </p>
            <p>
              Sứ mệnh của chúng tôi là tạo ra các giải pháp công nghệ sáng tạo giúp doanh nghiệp phát triển bền vững trong kỷ nguyên số.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Phúc lợi</h2>
            <button className="profile-edit-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Chỉnh sửa
            </button>
          </div>

          <div className="profile-benefits-grid">
            <div className="profile-benefit-item">
              <div className="profile-benefit-icon profile-benefit-icon-blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="profile-benefit-text">Bảo hiểm sức khỏe</div>
            </div>

            <div className="profile-benefit-item">
              <div className="profile-benefit-icon profile-benefit-icon-green">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className="profile-benefit-text">Thưởng hiệu suất</div>
            </div>

            <div className="profile-benefit-item">
              <div className="profile-benefit-icon profile-benefit-icon-purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="profile-benefit-text">Tăng lương hàng năm</div>
            </div>

            <div className="profile-benefit-item">
              <div className="profile-benefit-icon profile-benefit-icon-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="profile-benefit-text">Đào tạo & phát triển</div>
            </div>

            <div className="profile-benefit-item">
              <div className="profile-benefit-icon profile-benefit-icon-pink">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="profile-benefit-text">Làm việc từ xa</div>
            </div>

            <div className="profile-benefit-item">
              <div className="profile-benefit-icon profile-benefit-icon-teal">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="profile-benefit-text">Nghỉ phép có lương</div>
            </div>
          </div>
        </div>

        {/* Company Images Section */}
        <div className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Hình ảnh văn phòng</h2>
            <button className="profile-edit-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Chỉnh sửa
            </button>
          </div>

          <div className="profile-images-grid">
            <div className="profile-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Thêm ảnh</span>
            </div>
            <div className="profile-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Thêm ảnh</span>
            </div>
            <div className="profile-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Thêm ảnh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CompanyProfilePage };
