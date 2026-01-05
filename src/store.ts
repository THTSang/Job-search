import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrentPage, UserCredential, AuthResponse } from './utils/interface';


export const useCurrentPage = create<CurrentPage>((set) => ({
  currentPage: '',
  setCurrentPage: (pageName: string) => set(() => ({
    currentPage: pageName,
  })),
}));

export const useUserCredential = create<UserCredential>()(
  persist(
    (set) => ({
      token: '',
      userBasicInfo: null,
      setToken: (newToken: string) => set(() => ({
        token: newToken
      })),
      setUserBasicInfo: (userInfo: AuthResponse) => set(() => ({
        userBasicInfo: userInfo
      }))
    }),
    {
      name: 'user-credential', // Key name in localStorage
    }
  )
);
