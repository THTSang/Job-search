import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager';
import { FuzzyFinder } from '../../components/finder/FuzzyFinder';
import { JobCard } from '../../components/job/jobseeker/JobCard';
import PaginationControl from '../../components/common/PaginationControl';
import { SearchJobsAPI, GetGeneralStatsAPI } from '../../api';
import type { JobData, JobSearchRequest, GeneralStatsInterface } from '../../utils/interface';
import '../../styles/pages/jobseeker/HomePage.css';

const PAGE_SIZE = 10;

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString('vi-VN');
};

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  // General stats state
  const [stats, setStats] = useState<GeneralStatsInterface | null>(null);

  // Job list state
  const [jobArray, setJobArray] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search state
  const [searchFilters, setSearchFilters] = useState<JobSearchRequest>({});

  // Fetch general stats
  const fetchStats = useCallback(async () => {
    const response = await GetGeneralStatsAPI();
    if (response) {
      setStats(response);
    }
  }, []);

  // Fetch jobs
  const fetchJobs = useCallback(async (page: number, filters: JobSearchRequest = {}) => {
    setIsLoading(true);
    try {
      const response = await SearchJobsAPI(filters, { page, size: PAGE_SIZE });
      if (response) {
        setJobArray(response.content || []);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setCurrentPage(response.number);
      } else {
        setJobArray([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Error fetching job list:', error);
      setJobArray([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchStats();
    fetchJobs(0, {});
  }, [fetchStats, fetchJobs]);

  // Handle search from FuzzyFinder
  const handleSearch = useCallback(
    (keyword: string, locationCity: string) => {
      const newFilters: JobSearchRequest = {};
      if (keyword) newFilters.keyword = keyword;
      if (locationCity) newFilters.locationCity = locationCity;

      setSearchFilters(newFilters);
      setCurrentPage(0);
      fetchJobs(0, newFilters);
    },
    [fetchJobs]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchJobs(page, searchFilters);
      document.querySelector('.featured-job-section')?.scrollIntoView({ behavior: 'smooth' });
    },
    [fetchJobs, searchFilters]
  );

  // Handle job card click
  const handleJobClick = (jobId: string) => {
    const basePath = isEmployer ? '/employer' : '/jobseeker';
    navigate(`${basePath}/job/${jobId}`);
  };

  // Clear search filters
  const handleClearSearch = () => {
    setSearchFilters({});
    fetchJobs(0, {});
  };

  const hasSearchFilters = Boolean(searchFilters.keyword || searchFilters.locationCity);

  return (
    <>
      <HeaderManager />

      {/* Hero Section */}
      <div className="slogan-section">
        <div className="title-big">Tìm công việc mơ ước của bạn</div>
        <div className="title-small">Hàng ngàn cơ hội việc làm đang chờ đón bạn</div>
      </div>

      {/* Stats Section */}
      <div className="status-section">
        <div className="current-job-counting">
          <div className="job-counting-title-section">
            {formatNumber(stats?.jobCount ?? 0)}
          </div>
          <div className="counting-label">Công việc</div>
        </div>
        <div className="current-company-counting">
          <div className="company-counting-title-section">
            {formatNumber(stats?.companyCount ?? 0)}
          </div>
          <div className="counting-label">Công ty</div>
        </div>
        <div className="current-user-counting">
          <div className="user-counting-title-section">
            {formatNumber(stats?.userCount ?? 0)}
          </div>
          <div className="counting-label">Ứng viên</div>
        </div>
      </div>

      {/* Search */}
      <FuzzyFinder onSearch={handleSearch} isLoading={isLoading} />

      {/* Job Listings */}
      <div className="featured-job-section">
        <div className="featured-job-header">
          <div className="featured-job-title">
            {hasSearchFilters ? `Kết quả tìm kiếm (${totalElements})` : 'Công việc nổi bật'}
          </div>
          {hasSearchFilters && (
            <button className="clear-search-button" onClick={handleClearSearch}>
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="featured-job-grid">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="job-card-skeleton">
                <div className="skeleton-header">
                  <div className="skeleton-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-company"></div>
                  </div>
                  <div className="skeleton-logo"></div>
                </div>
                <div className="skeleton-details">
                  <div className="skeleton-detail"></div>
                  <div className="skeleton-detail"></div>
                </div>
                <div className="skeleton-footer">
                  <div className="skeleton-tag"></div>
                  <div className="skeleton-tag"></div>
                </div>
              </div>
            ))
          ) : jobArray.length > 0 ? (
            jobArray.map((job: JobData) => (
              <JobCard
                key={job.id}
                id={job.id || undefined}
                title={job.title}
                company={job.company}
                location={job.location}
                salaryMin={job.salaryMin}
                salaryMax={job.salaryMax}
                minExperience={job.minExperience}
                type={job.employmentType}
                postedDate={job.createdAt || undefined}
                onClick={handleJobClick}
              />
            ))
          ) : (
            <div className="no-jobs-message">
              {hasSearchFilters
                ? 'Không tìm thấy công việc phù hợp. Hãy thử từ khóa khác.'
                : 'Chưa có công việc nào được đăng.'}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && (
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>
    </>
  );
}

export { HomePage };
