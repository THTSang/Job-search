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
export interface JobData {
  id: string | null,
  title: string,
  company: string,
  description: string,
  location: string,
  employmentType: string,
  tags: string[],
  postByUserId: string
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
