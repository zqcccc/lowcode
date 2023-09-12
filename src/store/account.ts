import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccountStore = {
  username: string;
  accessToken: string;
  refreshToken: string;
  userInfo: null | {
    username: string;
    roles: string[]
    permissions: string[]
  }
  set: (state: Partial<AccountStore>) => void;
  empty: () => void
};

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      username: '',
      accessToken: '',
      refreshToken: '',
      userInfo: null,
      set,
      empty() {
        set({
          username: '',
          accessToken: '',
          refreshToken: '',
        });
      },
    }),
    {
      version: 0.1,
      name: 'activity-editor-account',
    },
  ),
);
