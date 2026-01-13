import { describe, it, expect, beforeEach } from 'vitest';
import { useSidebarStore } from '@/stores/sidebar-store';

describe('useSidebarStore', () => {
    beforeEach(() => {
        // 每個測試前重置狀態
        localStorage.clear();
    });

    it('應有預設狀態 (展開狀態)', () => {
        const { isCollapsed } = useSidebarStore.getState();
        expect(isCollapsed).toBe(false);
    });

    it('呼叫 toggleSidebar 應可切換收折狀態', () => {
        const { toggleSidebar } = useSidebarStore.getState();

        toggleSidebar();
        expect(useSidebarStore.getState().isCollapsed).toBe(true);

        toggleSidebar();
        expect(useSidebarStore.getState().isCollapsed).toBe(false);
    });

    it('應能將狀態持久化至 localStorage', () => {
        const { toggleSidebar } = useSidebarStore.getState();

        toggleSidebar(); // 切換為 true

        // 模擬重新加載頁面，狀態應從 localStorage 恢復
        // 注意: Zustand persist 是異步的，或者在 jsdom 中需要特殊處理
        // 這裡我們先驗證邏輯
        expect(localStorage.getItem('kernel-sidebar-storage')).toContain('"isCollapsed":true');
    });
});
