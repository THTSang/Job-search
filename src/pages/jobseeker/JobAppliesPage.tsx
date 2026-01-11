import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderManager } from '../../components/header/jobseeker/HeaderManager';
import { GetMyApplicationsAPI, GetApplicationStatsAPI } from '../../api';
import type { 
  ApplicationResponseInterface, 
  ApplicationStatsInterface,
  ApplicationStatus 
} from '../../utils/interface';
import '../../styles/pages/JobAppliesPage.css';

const PAGE_SIZE = 10;

function JobAppliesPage() {
  const navigate = useNavigate();

  // Applications list state
  const [applications, setApplications] = useState<ApplicationResponseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stats state
  const [stats, setStats] = useState<ApplicationStatsInterface>({
    total: 0,
    pending: 0,
    interviewing: 0,
    offered: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch applications
  const fetchApplications = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await GetMyApplicationsAPI({
        page,
        size: PAGE_SIZE,
        sort: ['appliedAt,desc']
      });
      if (response) {
        setApplications(response.content || []);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setCurrentPage(response.number);
      } else {
        setApplications([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await GetApplicationStatsAPI();
      if (response) {
        setStats(response);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchApplications(0);
    fetchStats();
  }, [fetchApplications, fetchStats]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchApplications(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to job detail
  const handleViewJob = (jobId: string) => {
    navigate(`/jobseeker/job/${jobId}`);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get relative time
  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  };

  // Get status label and class
  const getStatusInfo = (status: ApplicationStatus): { label: string; className: string } => {
    const statusMap: Record<ApplicationStatus, { label: string; className: string }> = {
      'PENDING': { label: 'Đang chờ', className: 'waiting' },
      'REVIEWED': { label: 'Đã xem', className: 'reviewed' },
      'SHORTLISTED': { label: 'Phỏng vấn', className: 'interview' },
      'REJECTED': { label: 'Từ chối', className: 'rejected' },
      'ACCEPTED': { label: 'Đã nhận', className: 'accepted' }
    };
    return statusMap[status] || { label: status, className: 'waiting' };
  };

  // Get company initial
  const getCompanyInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
  };

  // Generate page numbers
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);
      if (currentPage > 2) {
        pages.push('...');
      }
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1);
      }
    }
    return pages;
  };

  const startItem = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const endItem = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="job-applies-page-container">
      <HeaderManager />
      
      <span className='job-applies-page-title'>Quản lý đơn ứng tuyển</span>
      <span className='job-applies-page-subtitle'>Xem và quản lý các đơn ứng tuyển của bạn tại đây</span>
      
      {/* Stats Counter */}
      <div className='job-applies-page-counter'>
        <div className='job-applies-page-total-counting'>
          <div className='job-applies-page-counting-value'>
            {statsLoading ? '-' : stats.total}
          </div>
          <div className='job-applies-page-counting-title'>
            Tổng đơn
          </div>
        </div>

        <div className='job-applies-page-waiting-counting'>
          <div className='job-applies-page-waiting-value'>
            {statsLoading ? '-' : stats.pending}
          </div>
          <div className='job-applies-page-counting-title'>
            Đang chờ
          </div>
        </div>

        <div className='job-applies-page-interview-counting'>
          <div className='job-applies-page-interview-value'>
            {statsLoading ? '-' : stats.interviewing}
          </div>
          <div className='job-applies-page-counting-title'>
            Phỏng vấn
          </div>
        </div>

        <div className='job-applies-page-recieved-counting'>
          <div className='job-applies-page-recieved-value'>
            {statsLoading ? '-' : stats.offered}
          </div>
          <div className='job-applies-page-counting-title'>
            Đã nhận
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className='job-applies-list-container'>
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='job-application-card skeleton'>
                <div className='job-application-logo skeleton-logo'></div>
                <div className='job-application-content'>
                  <div className='skeleton-title'></div>
                  <div className='skeleton-company'></div>
                  <div className='skeleton-meta'></div>
                </div>
                <div className='skeleton-status'></div>
              </div>
            ))}
          </>
        ) : applications.length > 0 ? (
          <>
            {applications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              return (
                <div key={application.id} className='job-application-card'>
                  <div className='job-application-logo'>
                    {application.company.logoUrl ? (
                      <img 
                        src={application.company.logoUrl} 
                        alt={application.company.name} 
                      />
                    ) : (
                      <span>{getCompanyInitial(application.company.name)}</span>
                    )}
                  </div>
                  
                  <div className='job-application-content'>
                    <h3 className='job-application-title'>{application.job.title}</h3>
                    <p className='job-application-company'>{application.company.name}</p>
                    <div className='job-application-meta'>
                      <span className='job-application-date' title={formatDate(application.appliedAt)}>
                        {getRelativeTime(application.appliedAt)}
                      </span>
                    </div>
                  </div>

                  <div className={`job-application-status ${statusInfo.className}`}>
                    {statusInfo.label}
                  </div>

                  <div className='job-application-actions'>
                    <button 
                      className='job-application-view-button'
                      onClick={() => handleViewJob(application.job.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Xem việc làm
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='job-applies-pagination'>
                <div className='pagination-controls'>
                  <button
                    className='pagination-button pagination-nav'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    ◀ Trước
                  </button>

                  <div className='pagination-pages'>
                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          className={`pagination-button pagination-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page + 1}
                        </button>
                      ) : (
                        <span key={index} className='pagination-ellipsis'>{page}</span>
                      )
                    ))}
                  </div>

                  <button
                    className='pagination-button pagination-nav'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    Sau ▶
                  </button>
                </div>

                <div className='pagination-info'>
                  Hiển thị {startItem}-{endItem} / {totalElements} đơn ứng tuyển
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='job-applies-empty'>
            <div className='job-applies-empty-icon'>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Chưa có đơn ứng tuyển nào</h3>
            <p>Bắt đầu tìm kiếm và ứng tuyển các công việc phù hợp với bạn</p>
            <button 
              className='job-applies-empty-button'
              onClick={() => navigate('/jobseeker/findjob')}
            >
              Tìm việc ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { JobAppliesPage };
