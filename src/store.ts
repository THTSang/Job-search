import { create } from 'zustand';
import type { CurrentPage, Credential } from './utils/interface';

export const useCurrentPage = create<CurrentPage>((set) => ({
  currentPage: '',
  setCurrentPage: (pageName: string) => set(() => ({
    currentPage: pageName,
  })),
}));

export const useCredential = create<Credential>((set) => ({
  isLogin: true,
  setLoginStatus: (status: boolean) => set(() => ({
    isLogin: status,
  })),
}));


