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
  setUserBasicInfo: (userInfo: AuthResponse | null) => void
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

// PUT request body for updating a job
export interface JobUpdateRequest {
  title: string;
  description: string;
  location: JobLocationRequest;
  category: JobCategoryRequest;
  employmentType: EmploymentType;
  minExperience: number;
  salaryMin: number;
  salaryMax: number;
  status: JobStatus;
  deadline: string;           // ISO datetime format
  tags: string[];
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
export type ApplicationStatus = 'PENDING' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED' | 'CANCELLED';

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

// * JOB APPLICANT (for employer view) *
export interface JobApplicantInfo {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  professionalTitle: string;
}

export interface JobApplicationInterface {
  id: string;
  applicant: JobApplicantInfo;
  status: ApplicationStatus;
  appliedAt: string;  // ISO datetime format
  resumeUrl: string;
  coverLetter: string;
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

// * APPLICATION STATS RESPONSE *
export interface ApplicationStatsInterface {
  total: number;
  pending: number;
  interviewing: number;
  offered: number;
}

// * CHECK APPLICATION STATUS RESPONSE *
export interface ApplicationCheckResponse {
  hasApplied: boolean;
  applicationId: string | null;
  status: ApplicationStatus | null;
  appliedAt: string | null;  // ISO datetime format
}

// * UPDATE APPLICATION STATUS REQUEST *
export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  note?: string;
}

// * GENERAL STATS RESPONSE *
export interface GeneralStatsInterface {
  userCount: number;
  jobCount: number;
  companyCount: number;
}

// NOTE: ADMIN INTERFACES
// * User Status for Admin *
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

// * User Role *
export type UserRole = 'USER' | 'RECRUITER' | 'ADMIN';

// * Admin User Interface (for user management) *
export interface AdminUserInterface {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}

// * Update User Status Request *
export interface UpdateUserStatusRequest {
  status: UserStatus;
}

// NOTE: AI EVALUATION INTERFACES
// * Prompt Info (usage tracking) *
export interface AIPromptInfo {
  used: number;
  remaining: number;
  max: number;
}

// * AI Evaluate Response (for chat and job match) *
export interface AIEvaluateResponse {
  success: boolean;
  data?: {
    response: string;  // Markdown format
    promptInfo: AIPromptInfo;
    sessionId?: string;
  };
  code?: string;  // Error code like 'PROMPT_LIMIT_REACHED'
  message?: string;
  promptInfo?: AIPromptInfo;  // Also at top level for error responses
}

// * AI Upload Response (after CV upload) *
export interface AIUploadResponse {
  success: boolean;
  data?: {
    sessionId: string;
    response: string;  // Initial AI response
    promptInfo: AIPromptInfo;
  };
  code?: string;
  message?: string;
}

// * Chat Message (for history) *
export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

// * AI Chat History Response *
export interface AIChatHistoryResponse {
  success: boolean;
  data?: {
    messages: AIChatMessage[];
    promptInfo: AIPromptInfo;
  };
  code?: string;
  message?: string;
}

// * AI Session *
export interface AISession {
  sessionId: string;
  createdAt: string;
  lastMessageAt?: string;
}

// * AI Session List Response *
export interface AISessionListResponse {
  success: boolean;
  data?: {
    sessions: AISession[];
  };
  code?: string;
  message?: string;
}

// NOTE: REAL-TIME CHAT INTERFACES
// * Start Chat Request *
export interface ChatStartRequest {
  recipientId: string;
}

// * Start Chat Response *
export interface ChatStartResponse {
  chatId: string;
  partnerId: string;
  partnerName: string;
}

// * Chat Message (from API) *
export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;  // ISO datetime format
}

// * Chat Conversation (for conversation list) *
export interface ChatConversation {
  chatId: string;
  partnerId: string;
  partnerName: string;
  lastMessage: string;
  lastMessageAt: string;  // ISO datetime format
  isRead: boolean;
}

// * WebSocket Chat Message (for real-time) *
export interface WsChatMessage {
  senderId: string;
  recipientId: string;
  content: string;
  timestamp?: string;
}

// * Chat User Search Result (for finding users to chat with) *
export interface ChatUserSearchResult {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

