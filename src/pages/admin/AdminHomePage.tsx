import { useState, useEffect } from 'react';
import { HeaderManager } from '../../components/header/admin/HeaderManager';
import { GetGeneralStatsAPI } from '../../api';
import type { GeneralStatsInterface } from '../../utils/interface';
import '../../styles/pages/admin/AdminHomePage.css';

// Helper function to format large numbers (same as HomePage)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString('vi-VN');
};

function AdminHomePage() {
  const [stats, setStats] = useState<GeneralStatsInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await GetGeneralStatsAPI();
        setStats(response);
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <HeaderManager />
      
      {/* Hero Section */}
      <div className="admin-hero-section">
        <div className="admin-hero-title">Bảng điều khiển quản trị</div>
        <div className="admin-hero-subtitle">Quản lý và giám sát hệ thống tuyển dụng</div>
      </div>

      {/* Stats Section - Same style as HomePage */}
      <div className="admin-status-section">
        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {isLoading ? '...' : formatNumber(stats?.jobCount ?? 0)}
          </div>
          <div className="admin-stat-label">Tin tuyển dụng</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {isLoading ? '...' : formatNumber(stats?.companyCount ?? 0)}
          </div>
          <div className="admin-stat-label">Công ty</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {isLoading ? '...' : formatNumber(stats?.userCount ?? 0)}
          </div>
          <div className="admin-stat-label">Người dùng</div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="admin-actions-section">
        <h2 className="admin-actions-title">Thao tác nhanh</h2>
        <div className="admin-actions-grid">
          <a href="/admin/users" className="admin-action-card">
            <div className="admin-action-icon admin-action-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="admin-action-content">
              <span className="admin-action-text">Quản lý người dùng</span>
              <span className="admin-action-desc">Xem, cấm, xóa tài khoản</span>
            </div>
          </a>
          <a href="/admin/jobs" className="admin-action-card">
            <div className="admin-action-icon admin-action-icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="admin-action-content">
              <span className="admin-action-text">Quản lý tin tuyển dụng</span>
              <span className="admin-action-desc">Duyệt, đóng, xóa tin</span>
            </div>
          </a>
          <a href="/admin/companies" className="admin-action-card">
            <div className="admin-action-icon admin-action-icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="admin-action-content">
              <span className="admin-action-text">Quản lý công ty</span>
              <span className="admin-action-desc">Xác minh, xem hồ sơ</span>
            </div>
          </a>
          <a href="/admin/stats" className="admin-action-card">
            <div className="admin-action-icon admin-action-icon-orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div className="admin-action-content">
              <span className="admin-action-text">Xem thống kê</span>
              <span className="admin-action-desc">Báo cáo chi tiết</span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}

export { AdminHomePage };
