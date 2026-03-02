import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
    persist(
        (set) => ({
            theme: 'light',
            sidebarOpen: true,
            
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'light' ? 'dark' : 'light'
            })),

            toggleSidebar: () => set((state) => ({
                sidebarOpen: !state.sidebarOpen
            })),
            setSidebarOpen: (open) => set({ sidebarOpen: open })
        }),
        {
            name: 'ui-preferences', 
            partialize: (state) => ({ theme: state.theme })
        }
    )
);