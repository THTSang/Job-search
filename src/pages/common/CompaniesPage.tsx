import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager';
import { GetAllCompaniesAPI, GetCompanyJobsAPI } from '../../api';
import { getUserFriendlyMessage, logError } from '../../utils/errorHandler';
import type { CompanyProfileInterface, JobData } from '../../utils/interface';
import '../../styles/pages/CompaniesPage.css';

// Company card with expandable jobs
interface CompanyWithJobs {
  company: CompanyProfileInterface;
  jobs: JobData[];
  isLoadingJobs: boolean;
  isExpanded: boolean;
  jobsLoaded: boolean;
  totalJobs: number;
}

function CompaniesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;
  const basePath = isEmployer ? '/employer' : '/jobseeker';

  // State
  const [companies, setCompanies] = useState<CompanyWithJobs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const pageSize = 12;

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await GetAllCompaniesAPI({ page: currentPage, size: pageSize });
      if (response) {
        const companiesWithJobs: CompanyWithJobs[] = response.content.map(company => ({
          company,
          jobs: [],
          isLoadingJobs: false,
          isExpanded: false,
          jobsLoaded: false,
          totalJobs: 0
        }));
        setCompanies(companiesWithJobs);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
    } catch (err) {
      logError('Fetch companies', err);
      setError(getUserFriendlyMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Toggle company expansion and load jobs
  const toggleCompanyExpansion = async (companyId: string) => {
    setCompanies(prev => prev.map(item => {
      if (item.company.id === companyId) {
        // If expanding and jobs not loaded, load them
        if (!item.isExpanded && !item.jobsLoaded) {
          loadCompanyJobs(companyId);
        }
        return { ...item, isExpanded: !item.isExpanded };
      }
      return item;
    }));
  };

  // Load jobs for a company
  const loadCompanyJobs = async (companyId: string) => {
    setCompanies(prev => prev.map(item => 
      item.company.id === companyId 
        ? { ...item, isLoadingJobs: true }
        : item
    ));

    try {
      const response = await GetCompanyJobsAPI(companyId, 0, 10);
      if (response) {
        setCompanies(prev => prev.map(item => 
          item.company.id === companyId 
            ? { 
                ...item, 
                jobs: response.content, 
                isLoadingJobs: false, 
                jobsLoaded: true,
                totalJobs: response.totalElements
              }
            : item
        ));
      }
    } catch (err) {
      logError('Load company jobs', err);
      setCompanies(prev => prev.map(item => 
        item.company.id === companyId 
          ? { ...item, isLoadingJobs: false, jobsLoaded: true }
          : item
      ));
    }
  };

  // Filter companies by search
  const filteredCompanies = searchQuery.trim()
    ? companies.filter(item => 
        item.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : companies;

  // Navigate to company detail
  const handleCompanyClick = (companyId: string | null) => {
    if (companyId) {
      navigate(`${basePath}/company/${companyId}`);
    }
  };

  // Navigate to job detail
  const handleJobClick = (jobId: string) => {
    navigate(`${basePath}/job/${jobId}`);
  };

  // Get company initial for avatar
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
  };

  // Format salary
  const formatSalary = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(0)}tr`;
      }
      return amount.toLocaleString('vi-VN');
    };

    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    } else if (max) {
      return `Đến ${formatAmount(max)}`;
    } else if (min) {
      return `Từ ${formatAmount(min)}`;
    }
    return 'Thỏa thuận';
  };

  // Get employment type label
  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'FULL_TIME': 'Toàn thời gian',
      'PART_TIME': 'Bán thời gian',
      'CONTRACT': 'Hợp đồng',
      'INTERNSHIP': 'Thực tập',
      'REMOTE': 'Từ xa'
    };
    return labels[type] || type;
  };

  return (
    <div className="companies-page">
      <HeaderManager />

      <div className="companies-page-container">
        {/* Header */}
        <div className="companies-page-header">
          <h1>Khám phá công ty</h1>
          <p>Tìm hiểu về các công ty và cơ hội việc làm</p>
          <span className="companies-count">{totalElements} công ty</span>
        </div>

        {/* Search */}
        <div className="companies-search-section">
          <div className="companies-search-wrapper">
            <input
              type="text"
              className="companies-search-input"
              placeholder="Tìm kiếm theo tên công ty hoặc ngành nghề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="companies-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="companies-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <h3>Đã xảy ra lỗi</h3>
            <p>{error}</p>
            <button onClick={fetchCompanies}>Thử lại</button>
          </div>
        ) : isLoading ? (
          <div className="companies-loading">
            <div className="loading-spinner"></div>
            <span>Đang tải danh sách công ty...</span>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="companies-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <h3>{searchQuery ? 'Không tìm thấy công ty' : 'Chưa có công ty nào'}</h3>
            <p>{searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Danh sách công ty sẽ xuất hiện ở đây'}</p>
          </div>
        ) : (
          <>
            {/* Companies Grid */}
            <div className="companies-grid">
              {filteredCompanies.map(({ company, jobs, isLoadingJobs, isExpanded, jobsLoaded, totalJobs }) => (
                <div key={company.id} className={`company-card ${isExpanded ? 'expanded' : ''}`}>
                  {/* Company Header */}
                  <div className="company-card-header" onClick={() => handleCompanyClick(company.id)}>
                    <div className="company-logo">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} />
                      ) : (
                        <span>{getInitial(company.name)}</span>
                      )}
                    </div>
                    <div className="company-info">
                      <h3 className="company-name">{company.name}</h3>
                      <span className="company-industry">{company.industry}</span>
                      {company.isVerified && (
                        <span className="company-verified" title="Đã xác minh">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="company-card-details">
                    {company.address && (
                      <div className="company-detail-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{company.address}</span>
                      </div>
                    )}
                    {company.scale && (
                      <div className="company-detail-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span>{company.scale}</span>
                      </div>
                    )}
                  </div>

                  {/* Expand Button */}
                  <button 
                    className="company-expand-button"
                    onClick={() => company.id && toggleCompanyExpansion(company.id)}
                  >
                    <span>
                      {isExpanded ? 'Ẩn việc làm' : 'Xem việc làm'}
                      {jobsLoaded && totalJobs > 0 && ` (${totalJobs})`}
                    </span>
                    <svg 
                      className={`expand-icon ${isExpanded ? 'rotated' : ''}`}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* Jobs List (Expanded) */}
                  {isExpanded && (
                    <div className="company-jobs-section">
                      {isLoadingJobs ? (
                        <div className="company-jobs-loading">
                          <div className="loading-spinner-small"></div>
                          <span>Đang tải...</span>
                        </div>
                      ) : jobs.length === 0 ? (
                        <div className="company-jobs-empty">
                          <span>Chưa có việc làm nào</span>
                        </div>
                      ) : (
                        <div className="company-jobs-list">
                          {jobs.map(job => (
                            <div 
                              key={job.id} 
                              className="company-job-item"
                              onClick={() => job.id && handleJobClick(job.id)}
                            >
                              <div className="job-item-info">
                                <h4 className="job-item-title">{job.title}</h4>
                                <div className="job-item-meta">
                                  <span className="job-item-salary">
                                    {formatSalary(job.salaryMin, job.salaryMax)}
                                  </span>
                                  <span className="job-item-type">
                                    {getEmploymentTypeLabel(job.employmentType)}
                                  </span>
                                  {job.location && (
                                    <span className="job-item-location">
                                      {job.location.city}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className={`job-item-status job-status-${job.status.toLowerCase()}`}>
                                {job.status === 'OPEN' ? 'Đang tuyển' : 'Đã đóng'}
                              </div>
                            </div>
                          ))}
                          {totalJobs > jobs.length && (
                            <button 
                              className="view-all-jobs-button"
                              onClick={() => handleCompanyClick(company.id)}
                            >
                              Xem tất cả {totalJobs} việc làm
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="companies-pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Trước
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { CompaniesPage };
