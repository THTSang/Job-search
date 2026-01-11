// NOTE: Current Page Address
export interface CurrentPage {
  currentPage: string,
  setCurrentPage: (pageName: string) => void
}

// NOTE: USER AUTH KEY  
export interface UserCredential {
  token: string,
  userBasicInfo: AuthResponse | null,
  setToken: (newToken: string) => void
  setUserBasicInfo: (userInfo: AuthResponse) => void
}

// NOTE: AUTH REPONSE 
// REGISTER
export interface AuthResponse {
  id: string,
  email: string,
  name: string,
  role: string
  status: string
}

// LOGIN
export interface AuthToken {
  token: string
}


// NOTE: JOB INFORMATION

// Employment type enum
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

// Job status enum
export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT' | 'EXPIRED';

// Nested: Company info within job
export interface JobCompany {
  id: string | null;
  name: string;
  logoUrl: string;
  website: string;
}

// Nested: Location info within job
export interface JobLocation {
  id: string | null;
  jobId: string;
  city: string;
  address: string;
}

// Nested: Category info within job
export interface JobCategory {
  id: string | null;
  jobId: string;
  name: string;
}

// Job location for POST request (without id and jobId)
export interface JobLocationRequest {
  city: string;
  address: string;
}

// Job category for POST request (without id and jobId)
export interface JobCategoryRequest {
  name: string;
}

// POST request body for creating a job
export interface JobPostRequest {
  title: string;
  companyId: string;
  description: string;
  location: JobLocationRequest;
  category: JobCategoryRequest;
  employmentType: EmploymentType;
  minExperience: number;
  salaryMin: number;
  salaryMax: number;
  deadline: string;           // ISO datetime format
  tags: string[];
  postedByUserId: string;
}

// Job interface (API response)
export interface JobData {
  id: string | null;
  title: string;
  company: JobCompany;
  description: string;
  location: JobLocation;
  employmentType: EmploymentType;
  minExperience: number;
  salaryMin: number;
  salaryMax: number;
  category: JobCategory;
  status: JobStatus;
  deadline: string;           // ISO datetime format
  tags: string[];
  postedByUserId: string;
  createdAt: string | null;   // ISO datetime format
  updatedAt: string | null;   // ISO datetime format
}

// NOTE: USER PROFILE
export interface Skill {
  id: string | null;
  name: string;
  category: string;
}
export interface Experience {
  id: string | null;
  profileId: string;
  companyName: string;
  position: string;
  startDate: string;  // ISO date format
  endDate: string;    // ISO date format
  isCurrent: boolean;
  description: string;
}
export interface Education {
  id: string | null;
  profileId: string;
  institution: string;
  degree: string;
  major: string;
  startDate: string;  // ISO date format
  endDate: string;    // ISO date format
  gpa: number;
}
export interface Project {
  id: string | null;
  profileId: string;
  projectName: string;
  description: string;
  role: string;
  technologies: string[];
  projectUrl: string;
  completionYear: number;
}
export interface UserProfileInterface {
  id: string | null;
  userId: string | null;
  fullName: string;
  professionalTitle: string;
  phoneNumber: string;
  address: string;
  avatarUrl: string;
  summary: string;
  skills: Skill[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  createdAt: string | null;  // ISO datetime format
  updatedAt: string | null;  // ISO datetime format
}

// NOTE: COMPANY INTERFACE
export interface CompanyProfileInterface {
  id: string | null,
  name: string,
  industry: string,
  scale: string,
  address: string,
  logoUrl: string,
  contactEmail: string,
  phone: string,
  website: string,
  description: string,
  recruiterId: string,
  isVerified: boolean,
  createdAt: string | null,
  updatedAt: string | null
}


// NOTE: APPLICATION INTERFACE
// * APPLICATION REQUEST *
export interface ApplicationRequestInterface {
  jobId: string,
  resumeUrl: string,
  coverLetter: string
}

// * APPLICATION RESPONSE *
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface ApplicationResponseInterface {
  id: string;
  job: {
    id: string;
    title: string;
  };
  company: {
    name: string;
    logoUrl: string;
  };
  status: ApplicationStatus;
  appliedAt: string;  // ISO datetime format
}

// NOTE: PAGINATED RESPONSE (Spring Boot Page format)
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;  // current page (0-based)
  first: boolean;
  last: boolean;
  empty: boolean;
}

// NOTE: JOB SEARCH REQUEST (for /api/jobs/search endpoint)
export interface JobSearchRequest {
  keyword?: string;
  locationCity?: string;
  categoryName?: string;
  minSalary?: number;
  maxSalary?: number;
  minExperience?: number;
  jobType?: EmploymentType;
  status?: JobStatus;
}

export interface JobSearchPageable {
  page: number;
  size: number;
  sort?: string[];
}
