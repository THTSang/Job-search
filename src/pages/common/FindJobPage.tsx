import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderManager as JobSeekerHeader } from '../../components/header/jobseeker/HeaderManager.tsx';
import { HeaderManager as EmployerHeader } from '../../components/header/employer/HeaderManager.tsx';
import { ExtractFinder } from '../../components/finder/ExtractFinder.tsx';
import { JobCard } from '../../components/job/jobseeker/JobCard.tsx';
import { SearchJobsAPI } from '../../api';
import type { JobData, JobSearchRequest } from '../../utils/interface';
import '../../styles/pages/FindJobPage.css';

const PAGE_SIZE = 12;

function FindJobPage() {
  // Job list state
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Search filters state
  const [searchFilters, setSearchFilters] = useState<JobSearchRequest>({});

  const location = useLocation();
  const isEmployer = location.pathname.startsWith('/employer');
  const HeaderManager = isEmployer ? EmployerHeader : JobSeekerHeader;

  // Fetch jobs function
  const fetchJobs = useCallback(async (page: number, filters: JobSearchRequest = {}) => {
    setIsLoading(true);
    try {
      const response = await SearchJobsAPI(filters, { 
        page, 
        size: PAGE_SIZE,
        sort: ['createdAt,desc'] // Sort by newest first
      });
      if (response) {
        setJobs(response.content || []);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setCurrentPage(response.number);
      } else {
        setJobs([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchJobs(0, {});
  }, [fetchJobs]);

  // Handle search from ExtractFinder
  const handleSearch = useCallback((filters: JobSearchRequest) => {
    setSearchFilters(filters);
    setCurrentPage(0);
    fetchJobs(0, filters);
  }, [fetchJobs]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchJobs(page, searchFilters);
    // Scroll to top of results
    document.querySelector('.job-results-section')?.scrollIntoView({ behavior: 'smooth' });
  }, [fetchJobs, searchFilters]);

  // Handle job card click
  const handleJobClick = (jobId: string) => {
    console.log('Job clicked:', jobId);
    // TODO: Navigate to job detail page
  };

  // Generate page numbers for pagination
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

  // Calculate display range
  const startItem = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const endItem = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  // Check if any filters are active
  const hasActiveFilters = Object.keys(searchFilters).length > 0;

  return (
    <div className='find-job-page-container'>
      <HeaderManager />
      
      <ExtractFinder onSearch={handleSearch} isLoading={isLoading} />

      <div className='job-results-section'>
        <div className='job-results-header'>
          <div className='job-find-counting'>
            {isLoading ? (
              'Đang tìm kiếm...'
            ) : (
              <>
                Tìm thấy <strong>{totalElements}</strong> công việc
                {hasActiveFilters && ' phù hợp'}
              </>
            )}
          </div>
        </div>

        <div className='job-results-grid'>
          {isLoading ? (
            // Loading skeleton
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className='job-card-skeleton'>
                  <div className='skeleton-header'>
                    <div className='skeleton-info'>
                      <div className='skeleton-title'></div>
                      <div className='skeleton-company'></div>
                    </div>
                    <div className='skeleton-logo'></div>
                  </div>
                  <div className='skeleton-details'>
                    <div className='skeleton-detail'></div>
                    <div className='skeleton-detail'></div>
                  </div>
                  <div className='skeleton-footer'>
                    <div className='skeleton-tag'></div>
                    <div className='skeleton-tag'></div>
                  </div>
                </div>
              ))}
            </>
          ) : jobs.length > 0 ? (
            jobs.map((job: JobData) => (
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
            <div className='no-jobs-message'>
              {hasActiveFilters
                ? 'Không tìm thấy công việc phù hợp với bộ lọc. Hãy thử điều chỉnh tiêu chí tìm kiếm.'
                : 'Chưa có công việc nào được đăng.'
              }
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className='jobs-pagination'>
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
              Hiển thị {startItem}-{endItem} / {totalElements} công việc
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { FindJobPage };
