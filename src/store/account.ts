import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccountStore = {
  username: string;
  accessToken: string;
  refreshToken: string;
  set: (state: Partial<AccountStore>) => void;
};

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
      username: '',
      accessToken: '',
      refreshToken: '',
      set,
    }),
    {
      version: 0.1,
      name: 'activity-editor-account',
    },
  ),
);
