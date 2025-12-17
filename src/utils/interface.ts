export interface CurrentPage {
  currentPage: string,
  setCurrentPage: (pageName: string) => void
}

export interface Credential {
  isLogin: boolean,
  setLoginStatus: (status: boolean) => void
}
