import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserCredential, AuthResponse } from './utils/interface';

export const useUserCredential = create<UserCredential>()(
  persist(
    (set) => ({
      token: '',
      userBasicInfo: null,
      setToken: (newToken: string) => set(() => ({
        token: newToken
      })),
      setUserBasicInfo: (userInfo: AuthResponse | null) => set(() => ({
        userBasicInfo: userInfo
      }))
    }),
    {
      name: 'user-credential',
    }
  )
);
