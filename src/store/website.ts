import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WebsiteStore = {
  name: string
  // username: string;
  // accessToken: string;
  // refreshToken: string;
  set: (state: Partial<WebsiteStore>) => void;
};

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      name: '',
      set,
    }),
    {
      version: 0.1,
      name: 'activity-editor-website',
    },
  ),
);
