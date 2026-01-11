import type { JobCompany, JobLocation, EmploymentType } from '../../../utils/interface';
import '../../../styles/job/jobCard.css';

interface JobCardProps {
  id?: string;
  title: string;
  company: JobCompany;
  location: JobLocation;
  salaryMin?: number;
  salaryMax?: number;
  minExperience?: number;
  type: EmploymentType;
  postedDate?: string;
  onClick?: (id: string) => void;
}

function JobCard({
  id,
  title,
  company,
  location,
  salaryMin,
  salaryMax,
  minExperience,
  type,
  postedDate,
  onClick
}: JobCardProps) {

  const formatSalary = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return amount.toLocaleString('vi-VN');
  };

  const getSalaryDisplay = () => {
    if (salaryMin && salaryMax) {
      return `${formatSalary(salaryMin)} - ${formatSalary(salaryMax)}`;
    } else if (salaryMax) {
      return `Đến ${formatSalary(salaryMax)}`;
    } else if (salaryMin) {
      return `Từ ${formatSalary(salaryMin)}`;
    }
    return 'Thỏa thuận';
  };

  const getEmploymentTypeLabel = (employmentType: EmploymentType) => {
    const labels: Record<EmploymentType, string> = {
      'FULL_TIME': 'Toàn thời gian',
      'PART_TIME': 'Bán thời gian',
      'CONTRACT': 'Hợp đồng',
      'INTERNSHIP': 'Thực tập',
      'REMOTE': 'Làm việc từ xa'
    };
    return labels[employmentType] || employmentType;
  };

  const formatPostedDate = (dateStr?: string) => {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getCompanyInitial = () => {
    return company.name ? company.name.charAt(0).toUpperCase() : 'C';
  };

  const handleClick = () => {
    if (onClick && id) {
      onClick(id);
    }
  };

  return (
    <div className='job-card' onClick={handleClick}>
      <div className='job-card-header'>
        <div className='job-card-info'>
          <h3 className='job-card-title'>{title}</h3>
          <div className='job-card-company'>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span>{company.name}</span>
          </div>
        </div>
        <div className='job-card-logo'>
          {company.logoUrl ? (
            <img 
              src={company.logoUrl} 
              alt={company.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
            />
          ) : (
            getCompanyInitial()
          )}
        </div>
      </div>

      <div className='job-card-details'>
        {/* Location */}
        <div className='job-card-detail-item'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{location.city}{location.address ? `, ${location.address}` : ''}</span>
        </div>

        {/* Salary */}
        <div className='job-card-detail-item'>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span>{getSalaryDisplay()}</span>
        </div>

        {/* Experience */}
        {minExperience !== undefined && minExperience > 0 && (
          <div className='job-card-detail-item'>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{minExperience}+ năm kinh nghiệm</span>
          </div>
        )}
      </div>

      <div className='job-card-footer'>
        <span className='job-card-tag job-card-tag-type'>
          {getEmploymentTypeLabel(type)}
        </span>
        {postedDate && (
          <span className='job-card-tag job-card-tag-date'>
            {formatPostedDate(postedDate)}
          </span>
        )}
      </div>
    </div>
  );
}

export { JobCard };
