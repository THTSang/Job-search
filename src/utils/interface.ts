export interface CurrentPage {
  currentPage: string,
  setCurrentPage: (pageName: string) => void
}

export interface Credential {
  isLogin: boolean,
  userProfile: AuthResponse | null,
  setLoginStatus: (status: boolean) => void
  setUserProfile: (info: AuthResponse | null) => void
}

export interface AuthResponse {
  id: string,
  email: string,
  name: string,
  role: string[]
}

export interface JobData {
  id: string,
  title: string,
  company: string,
  description: string,
  location: string,
  employmentType: string,
  tags: string[],
  postByUserId: string
}


