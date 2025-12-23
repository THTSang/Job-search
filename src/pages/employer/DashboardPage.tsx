import { HeaderManager } from '../../components/header/employer/HeaderManager.tsx';
import '../../styles/pages/DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page-container">
      <HeaderManager />

      <div className="dashboard-page-content">
        <div className="dashboard-page-header">
          <h1 className="dashboard-page-title">Tổng quan</h1>
          <p className="dashboard-page-subtitle">Thống kê hoạt động tuyển dụng của bạn</p>
        </div>

        {/* Statistics Cards */}
        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon dashboard-stat-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-label">Tin tuyển dụng</div>
              <div className="dashboard-stat-value">24</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon dashboard-stat-icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-label">Ứng viên mới</div>
              <div className="dashboard-stat-value">156</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon dashboard-stat-icon-yellow">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-label">Đã duyệt</div>
              <div className="dashboard-stat-value">89</div>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon dashboard-stat-icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-label">Lịch phỏng vấn</div>
              <div className="dashboard-stat-value">12</div>
            </div>
          </div>
        </div>

        {/* Recent Applications and Active Jobs */}
        <div className="dashboard-content-grid">
          {/* Recent Applications */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Ứng viên gần đây</h2>
              <a href="#" className="dashboard-section-link">Xem tất cả</a>
            </div>
            <div className="dashboard-applications-list">
              <div className="dashboard-application-item">
                <div className="dashboard-application-avatar dashboard-avatar-purple">NV</div>
                <div className="dashboard-application-info">
                  <div className="dashboard-application-name">Nguyễn Văn A</div>
                  <div className="dashboard-application-job">Frontend Developer</div>
                </div>
                <span className="dashboard-application-badge dashboard-badge-new">Mới</span>
              </div>

              <div className="dashboard-application-item">
                <div className="dashboard-application-avatar dashboard-avatar-blue">TM</div>
                <div className="dashboard-application-info">
                  <div className="dashboard-application-name">Trần Minh B</div>
                  <div className="dashboard-application-job">Backend Developer</div>
                </div>
                <span className="dashboard-application-badge dashboard-badge-review">Đang xem xét</span>
              </div>

              <div className="dashboard-application-item">
                <div className="dashboard-application-avatar dashboard-avatar-green">LH</div>
                <div className="dashboard-application-info">
                  <div className="dashboard-application-name">Lê Hoàng C</div>
                  <div className="dashboard-application-job">UI/UX Designer</div>
                </div>
                <span className="dashboard-application-badge dashboard-badge-interview">Phỏng vấn</span>
              </div>

              <div className="dashboard-application-item">
                <div className="dashboard-application-avatar dashboard-avatar-orange">PD</div>
                <div className="dashboard-application-info">
                  <div className="dashboard-application-name">Phạm Duy D</div>
                  <div className="dashboard-application-job">Project Manager</div>
                </div>
                <span className="dashboard-application-badge dashboard-badge-new">Mới</span>
              </div>

              <div className="dashboard-application-item">
                <div className="dashboard-application-avatar dashboard-avatar-pink">NH</div>
                <div className="dashboard-application-info">
                  <div className="dashboard-application-name">Ngô Hải E</div>
                  <div className="dashboard-application-job">DevOps Engineer</div>
                </div>
                <span className="dashboard-application-badge dashboard-badge-review">Đang xem xét</span>
              </div>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2 className="dashboard-section-title">Tin tuyển dụng đang hoạt động</h2>
              <a href="#" className="dashboard-section-link">Xem tất cả</a>
            </div>
            <div className="dashboard-jobs-list">
              <div className="dashboard-job-item">
                <div className="dashboard-job-header">
                  <h3 className="dashboard-job-title">Frontend Developer</h3>
                  <span className="dashboard-job-status dashboard-status-active">Đang tuyển</span>
                </div>
                <div className="dashboard-job-stats">
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    45 ứng viên
                  </span>
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    7 ngày trước
                  </span>
                </div>
              </div>

              <div className="dashboard-job-item">
                <div className="dashboard-job-header">
                  <h3 className="dashboard-job-title">Backend Developer</h3>
                  <span className="dashboard-job-status dashboard-status-active">Đang tuyển</span>
                </div>
                <div className="dashboard-job-stats">
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    32 ứng viên
                  </span>
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    5 ngày trước
                  </span>
                </div>
              </div>

              <div className="dashboard-job-item">
                <div className="dashboard-job-header">
                  <h3 className="dashboard-job-title">UI/UX Designer</h3>
                  <span className="dashboard-job-status dashboard-status-active">Đang tuyển</span>
                </div>
                <div className="dashboard-job-stats">
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    28 ứng viên
                  </span>
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    3 ngày trước
                  </span>
                </div>
              </div>

              <div className="dashboard-job-item">
                <div className="dashboard-job-header">
                  <h3 className="dashboard-job-title">DevOps Engineer</h3>
                  <span className="dashboard-job-status dashboard-status-closed">Đã đóng</span>
                </div>
                <div className="dashboard-job-stats">
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    67 ứng viên
                  </span>
                  <span className="dashboard-job-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    14 ngày trước
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardPage };
