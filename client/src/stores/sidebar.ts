import { create } from "zustand";
import type { TSidebar, TSidebarAction } from "../types/sidebar";

export const useSidebarStore = create<TSidebar & TSidebarAction>((set) => ({
  isOpen: false,
  openSidebar: () => set(() => ({ isOpen: true })),
  closeSidebar: () => set(() => ({ isOpen: false })),
}));
