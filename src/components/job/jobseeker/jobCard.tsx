import '../../../styles/job/jobCard.css';
import type { JobCompany, JobLocation, EmploymentType } from '../../../utils/interface';

interface JobCardProps {
  title: string;
  company: JobCompany | string;
  location: JobLocation | string;
  salaryMin?: number;
  salaryMax?: number;
  minExperience?: number;
  type: EmploymentType | string;
  postedDate?: string;
  companyInitial?: string;
  onClick?: () => void;
}

function JobCard({
  title,
  company,
  location,
  salaryMin = 0,
  salaryMax = 0,
  minExperience = 0,
  type,
  postedDate,
  companyInitial,
  onClick
}: JobCardProps) {
  // Handle both old (string) and new (object) formats
  const companyName = typeof company === 'string' ? company : company.name;
  const locationText = typeof location === 'string' ? location : location.city;
  const initial = companyInitial || companyName.charAt(0).toUpperCase();
  const logoUrl = typeof company === 'object' ? company.logoUrl : '';

  // Format salary
  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return amount.toLocaleString('vi-VN');
  };

  const salaryText = salaryMin > 0 || salaryMax > 0
    ? salaryMin > 0 && salaryMax > 0
      ? `${formatSalary(salaryMin)} - ${formatSalary(salaryMax)}`
      : salaryMax > 0
        ? `Đến ${formatSalary(salaryMax)}`
        : `Từ ${formatSalary(salaryMin)}`
    : 'Thỏa thuận';

  // Format experience
  const experienceText = minExperience > 0
    ? `${minExperience}+ năm kinh nghiệm`
    : 'Không yêu cầu';

  // Format employment type
  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'FULL_TIME': 'Toàn thời gian',
      'PART_TIME': 'Bán thời gian',
      'CONTRACT': 'Hợp đồng',
      'INTERNSHIP': 'Thực tập',
      'REMOTE': 'Làm việc từ xa'
    };
    return labels[type] || type;
  };

  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-card-header">
        <div className="job-card-info">
          <h3 className="job-card-title">{title}</h3>
          <div className="job-card-company">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>{companyName}</span>
          </div>
        </div>
        <div className="job-card-logo">
          {logoUrl ? (
            <img src={logoUrl} alt={companyName} />
          ) : (
            initial
          )}
        </div>
      </div>

      <div className="job-card-details">
        <div className="job-card-detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{locationText}</span>
        </div>

        <div className="job-card-detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>{salaryText}</span>
        </div>

        <div className="job-card-detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{experienceText}</span>
        </div>
      </div>

      <div className="job-card-footer">
        <span className="job-card-tag job-card-tag-type">{getEmploymentTypeLabel(type)}</span>
        {postedDate && (
          <span className="job-card-tag job-card-tag-date">{postedDate}</span>
        )}
      </div>
    </div>
  );
}

export { JobCard };
