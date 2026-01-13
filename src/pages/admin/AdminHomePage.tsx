import { useState, useEffect } from 'react';
import { HeaderManager } from '../../components/header/admin/HeaderManager';
import { GetGeneralStatsAPI } from '../../api';
import type { GeneralStatsInterface } from '../../utils/interface';
import '../../styles/pages/admin/AdminHomePage.css';

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
      <div className="admin-home-container">
        <div className="admin-home-header">
          <h1>Bảng điều khiển quản trị</h1>
          <p>Chào mừng bạn đến với trang quản trị hệ thống</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon user-icon">👥</div>
            <div className="admin-stat-info">
              <h3>Người dùng</h3>
              <p className="admin-stat-value">
                {isLoading ? '...' : stats?.userCount || 0}
              </p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon job-icon">💼</div>
            <div className="admin-stat-info">
              <h3>Tin tuyển dụng</h3>
              <p className="admin-stat-value">
                {isLoading ? '...' : stats?.jobCount || 0}
              </p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon company-icon">🏢</div>
            <div className="admin-stat-info">
              <h3>Công ty</h3>
              <p className="admin-stat-value">
                {isLoading ? '...' : stats?.companyCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-quick-actions">
          <h2>Thao tác nhanh</h2>
          <div className="admin-actions-grid">
            <a href="/admin/users" className="admin-action-card">
              <span className="action-icon">👤</span>
              <span className="action-text">Quản lý người dùng</span>
            </a>
            <a href="/admin/jobs" className="admin-action-card">
              <span className="action-icon">📋</span>
              <span className="action-text">Quản lý tin tuyển dụng</span>
            </a>
            <a href="/admin/companies" className="admin-action-card">
              <span className="action-icon">🏬</span>
              <span className="action-text">Quản lý công ty</span>
            </a>
            <a href="/admin/stats" className="admin-action-card">
              <span className="action-icon">📊</span>
              <span className="action-text">Xem thống kê chi tiết</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export { AdminHomePage };
