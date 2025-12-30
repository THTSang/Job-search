import '../../styles/job/jobCard.css';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  type: string;
  postedDate: string;
  companyInitial?: string;
  onClick?: () => void;
}

function JobCard({
  title,
  company,
  location,
  salary,
  experience,
  type,
  postedDate,
  companyInitial,
  onClick
}: JobCardProps) {
  const initial = companyInitial || company.charAt(0).toUpperCase();

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
            <span>{company}</span>
          </div>
        </div>
        <div className="job-card-logo">
          {initial}
        </div>
      </div>

      <div className="job-card-details">
        <div className="job-card-detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{location}</span>
        </div>

        <div className="job-card-detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>{salary}</span>
        </div>

        <div className="job-card-detail-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{experience}</span>
        </div>
      </div>

      <div className="job-card-footer">
        <span className="job-card-tag job-card-tag-type">{type}</span>
        <span className="job-card-tag job-card-tag-date">{postedDate}</span>
      </div>
    </div>
  );
}

export { JobCard };
