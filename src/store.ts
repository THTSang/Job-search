import { create } from 'zustand';
import type { CurrentPage, Credential, AuthResponse } from './utils/interface';

export const useCurrentPage = create<CurrentPage>((set) => ({
  currentPage: '',
  setCurrentPage: (pageName: string) => set(() => ({
    currentPage: pageName,
  })),
}));

export const useCredential = create<Credential>((set) => ({
  isLogin: true,
  userProfile: null,
  setLoginStatus: (status: boolean) => set(() => ({
    isLogin: status,
  })),

  setUserProfile: (info: AuthResponse | null) => set(() => ({
    userProfile: info,
  })),
}));


