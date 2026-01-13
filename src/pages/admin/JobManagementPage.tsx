import { useState, useEffect, useCallback } from 'react';
import { HeaderManager } from '../../components/header/admin/HeaderManager';
import { SearchJobsAPI, DeleteJobAPI, UpdateJobAPI } from '../../api';
import { getUserFriendlyMessage, logError } from '../../utils/errorHandler';
import type { JobData, JobStatus } from '../../utils/interface';
import '../../styles/pages/admin/JobManagementPage.css';

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  OPEN: { label: 'Đang mở', className: 'status-open' },
  CLOSED: { label: 'Đã đóng', className: 'status-closed' },
  DRAFT: { label: 'Bản nháp', className: 'status-draft' },
  EXPIRED: { label: 'Hết hạn', className: 'status-expired' },
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Toàn thời gian',
  PART_TIME: 'Bán thời gian',
  CONTRACT: 'Hợp đồng',
  INTERNSHIP: 'Thực tập',
  REMOTE: 'Từ xa',
};

function JobManagementPage() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | ''>('');

  const pageSize = 10;

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const searchRequest: Record<string, string> = {};
      if (searchKeyword.trim()) {
        searchRequest.keyword = searchKeyword.trim();
      }
      if (filterStatus) {
        searchRequest.status = filterStatus;
      }

      const response = await SearchJobsAPI(searchRequest, { 
        page: currentPage, 
        size: pageSize,
        sort: ['createdAt,desc']
      });
      if (response) {
        setJobs(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
    } catch (error) {
      logError('Fetch jobs', error);
      setErrorMessage(getUserFriendlyMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchKeyword, filterStatus]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchJobs();
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus, job: JobData) => {
    setUpdatingJobId(jobId);
    try {
      await UpdateJobAPI(jobId, {
        title: job.title,
        description: job.description,
        location: {
          city: job.location.city,
          address: job.location.address
        },
        category: {
          name: job.category.name
        },
        employmentType: job.employmentType,
        minExperience: job.minExperience,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        status: newStatus,
        deadline: job.deadline,
        tags: job.tags || []
      });
      setJobs(prev =>
        prev.map(j =>
          j.id === jobId ? { ...j, status: newStatus } : j
        )
      );
    } catch (error) {
      logError('Update job status', error);
      alert(getUserFriendlyMessage(error));
    } finally {
      setUpdatingJobId(null);
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tin tuyển dụng "${jobTitle}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setUpdatingJobId(jobId);
    try {
      await DeleteJobAPI(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
      setTotalElements(prev => prev - 1);
    } catch (error) {
      logError('Delete job', error);
      alert(getUserFriendlyMessage(error));
    } finally {
      setUpdatingJobId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatSalary = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'Thỏa thuận';
    if (min === 0) return `Tới ${(max / 1000000).toFixed(0)}M`;
    if (max === 0) return `Từ ${(min / 1000000).toFixed(0)}M`;
    return `${(min / 1000000).toFixed(0)}M - ${(max / 1000000).toFixed(0)}M`;
  };

  return (
    <>
      <HeaderManager />
      <div className="job-management-container">
        <div className="job-management-header">
          <h1>Quản lý tin tuyển dụng</h1>
          <p>Tổng cộng {totalElements} tin tuyển dụng trong hệ thống</p>
        </div>

        {/* Search and Filter */}
        <form className="job-management-filters" onSubmit={handleSearch}>
          <div className="filter-row">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tiêu đề, công ty..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as JobStatus | '');
                setCurrentPage(0);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="OPEN">Đang mở</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="EXPIRED">Hết hạn</option>
            </select>
            <button type="submit" className="search-btn">
              Tìm kiếm
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="job-management-error">
            <span>{errorMessage}</span>
            <button onClick={fetchJobs}>Thử lại</button>
          </div>
        )}

        {isLoading ? (
          <div className="job-management-loading">
            <span>Đang tải danh sách tin tuyển dụng...</span>
          </div>
        ) : (
          <>
            <div className="job-table-container">
              <table className="job-table">
                <thead>
                  <tr>
                    <th>Tiêu đề</th>
                    <th>Công ty</th>
                    <th>Địa điểm</th>
                    <th>Loại hình</th>
                    <th>Mức lương</th>
                    <th>Trạng thái</th>
                    <th>Ngày đăng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="no-data">
                        Không có tin tuyển dụng nào
                      </td>
                    </tr>
                  ) : (
                    jobs.map(job => {
                      const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.OPEN;
                      const isUpdating = updatingJobId === job.id;

                      return (
                        <tr key={job.id} className={isUpdating ? 'row-updating' : ''}>
                          <td>
                            <div className="job-title-cell">
                              <span className="job-title">{job.title}</span>
                            </div>
                          </td>
                          <td>
                            <div className="company-cell">
                              {job.company?.logoUrl ? (
                                <img 
                                  src={job.company.logoUrl} 
                                  alt={job.company.name}
                                  className="company-logo"
                                />
                              ) : (
                                <div className="company-logo-placeholder">
                                  {job.company?.name?.charAt(0) || '?'}
                                </div>
                              )}
                              <span className="company-name">{job.company?.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td>{job.location?.city || 'N/A'}</td>
                          <td>{EMPLOYMENT_TYPE_LABELS[job.employmentType] || job.employmentType}</td>
                          <td>{formatSalary(job.salaryMin, job.salaryMax)}</td>
                          <td>
                            <span className={`status-badge ${statusConfig.className}`}>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td>{formatDate(job.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              {job.status === 'OPEN' && (
                                <button
                                  className="action-btn btn-close"
                                  onClick={() => handleStatusChange(job.id!, 'CLOSED', job)}
                                  disabled={isUpdating}
                                  title="Đóng tin"
                                >
                                  Đóng
                                </button>
                              )}
                              {job.status === 'CLOSED' && (
                                <button
                                  className="action-btn btn-open"
                                  onClick={() => handleStatusChange(job.id!, 'OPEN', job)}
                                  disabled={isUpdating}
                                  title="Mở lại"
                                >
                                  Mở lại
                                </button>
                              )}
                              <button
                                className="action-btn btn-delete"
                                onClick={() => handleDeleteJob(job.id!, job.title)}
                                disabled={isUpdating}
                                title="Xóa"
                              >
                                Xóa
                              </button>
                              {isUpdating && <span className="updating-text">Đang xử lý...</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Trước
                </button>
                <span className="pagination-info">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export { JobManagementPage };
