import type { JobData, EmploymentType } from '../../../utils/interface';
import '../../../styles/job/PostedJob.css';

interface PostedJobProps {
  postedJobs: JobData[];
  isLoading?: boolean;
  // Pagination
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

function PostedJob({
  postedJobs,
  isLoading = false,
  currentPage,
  totalPages,
  totalElements,
  onPageChange
}: PostedJobProps) {

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return amount.toLocaleString('vi-VN');
  };

  const getEmploymentTypeLabel = (type: EmploymentType) => {
    const labels: Record<EmploymentType, string> = {
      'FULL_TIME': 'Toàn thời gian',
      'PART_TIME': 'Bán thời gian',
      'CONTRACT': 'Hợp đồng',
      'INTERNSHIP': 'Thực tập',
      'REMOTE': 'Làm việc từ xa'
    };
    return labels[type] || type;
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      if (currentPage > 2) {
        pages.push('...');
      }

      // Show pages around current
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

      // Always show last page
      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  // Calculate display range
  const startItem = totalElements === 0 ? 0 : currentPage * 5 + 1;
  const endItem = Math.min((currentPage + 1) * 5, totalElements);

  return (
    <div className='posted-jobs-section'>
      <h2 className='posted-jobs-title'>
        Tin đã đăng ({totalElements})
      </h2>

      <div className='posted-jobs-list'>
        {isLoading ? (
          // Loading skeleton
          <div className='posted-jobs-loading'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='posted-job-skeleton'>
                <div className='skeleton-header'>
                  <div className='skeleton-icon'></div>
                  <div className='skeleton-info'>
                    <div className='skeleton-title'></div>
                    <div className='skeleton-subtitle'></div>
                  </div>
                </div>
                <div className='skeleton-details'></div>
              </div>
            ))}
          </div>
        ) : postedJobs.length === 0 ? (
          <div className='posted-jobs-empty'>
            <div className='posted-jobs-empty-icon'>📋</div>
            <p className='posted-jobs-empty-text'>Chưa có tin tuyển dụng nào</p>
            <p className='posted-jobs-empty-subtext'>Đăng tin đầu tiên của bạn ngay!</p>
          </div>
        ) : (
          <>
            {postedJobs.map((job) => (
              <div key={job.id} className='posted-job-card'>
                <div className='posted-job-header'>
                  <div className='posted-job-icon'>
                    {job.company.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} />
                    ) : (
                      '📋'
                    )}
                  </div>
                  <div className='posted-job-info'>
                    <h3 className='posted-job-title'>{job.title}</h3>
                    <p className='posted-job-company'>{job.company.name}</p>
                    <p className='posted-job-location'>{job.location.city}</p>
                  </div>
                </div>

                {/* Job Details */}
                <div className='posted-job-details'>
                  <span className='posted-job-detail'>
                    {getEmploymentTypeLabel(job.employmentType)}
                  </span>
                  {job.minExperience > 0 && (
                    <span className='posted-job-detail'>
                      {job.minExperience}+ năm KN
                    </span>
                  )}
                  {(job.salaryMin > 0 || job.salaryMax > 0) && (
                    <span className='posted-job-detail'>
                      {job.salaryMin > 0 && job.salaryMax > 0
                        ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`
                        : job.salaryMax > 0
                          ? `Đến ${formatSalary(job.salaryMax)}`
                          : `Từ ${formatSalary(job.salaryMin)}`
                      }
                    </span>
                  )}
                </div>

                {/* Tags */}
                {job.tags.length > 0 && (
                  <div className='posted-job-tags'>
                    {job.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className='posted-job-tag-chip'>{tag}</span>
                    ))}
                    {job.tags.length > 3 && (
                      <span className='posted-job-tag-more'>+{job.tags.length - 3}</span>
                    )}
                  </div>
                )}

                <div className='posted-job-footer'>
                  <span className={`posted-job-status posted-job-status-${job.status.toLowerCase()}`}>
                    {job.status === 'OPEN' ? 'Đang mở' : job.status === 'DRAFT' ? 'Bản nháp' : 'Đã đóng'}
                  </span>
                  {job.deadline && (
                    <span className='posted-job-deadline'>
                      Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='posted-jobs-pagination'>
                <div className='pagination-controls'>
                  <button
                    className='pagination-button pagination-nav'
                    onClick={handlePrevious}
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
                          onClick={() => onPageChange(page)}
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
                    onClick={handleNext}
                    disabled={currentPage === totalPages - 1}
                  >
                    Sau ▶
                  </button>
                </div>

                <div className='pagination-info'>
                  Hiển thị {startItem}-{endItem} / {totalElements} tin
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export { PostedJob };
