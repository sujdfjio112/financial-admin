<template>
  <aside class="app-sidebar" role="navigation" aria-label="Main sidebar">
    <div class="sidebar-header">
      <div class="logo-container">
        <div class="logo-icon"><BeakerIcon class="h-5 w-5" /></div>
        <h2 class="logo-text">Dashboard Pro</h2>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="section">
        <div class="section-title">MAIN</div>
        <ul class="nav-list">
          <sidebar-item v-for="item in mainList" :key="item.id" :item="item" :level="0" />
        </ul>
      </div>

      <div class="section help-section">
        <div class="section-title">HELP</div>
        <ul class="nav-list">
          <li v-for="h in helpList" :key="h.id">
            <sidebar-item :item="h" :level="0" />
          </li>
        </ul>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="avatar">JD</div>
        <div class="user-info">
          <div class="user-name">John Doe</div>
          <div class="user-role">Administrator</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import SidebarItem from '@/components//SidebarItem/SidebarItem.vue';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  InboxIcon,
  PhotoIcon,
  TableCellsIcon,
  AcademicCapIcon,
  BanknotesIcon,
  BeakerIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline';
import { MenuItem } from '@/types/menu';

// 原始数据（你可以直接替换、扩展）
const sidebarList = reactive<MenuItem[]>([
  {
    id: 1,
    title: 'dashboard',
    path: '/dashboard',
    icon: ChartBarIcon,
    active: true,
  },
  {
    id: 2,
    title: 'Leaderboard',
    path: '/leaderboard',
    icon: TableCellsIcon,
    dot: true, // 红点
  },
  {
    id: 3,
    title: 'Spreadsheets',
    path: '/spreadsheets',
    icon: PhotoIcon,
  },
  {
    id: 4,
    title: 'Administration',
    path: '/administration',
    icon: DocumentTextIcon,
  },
  {
    id: 5,
    title: 'Sales',
    path: '/sales',
    icon: BanknotesIcon,
    children: [
      { id: 51, title: 'Clients', path: '/sales/clients', icon: UserGroupIcon },
      { id: 52, title: 'Deals', path: '/sales/deals', icon: TableCellsIcon },
    ],
  },
  {
    id: 6,
    title: 'Schedule',
    path: '/schedule',
    icon: CalendarIcon,
  },
]);

// 帮助分区（固定项）
const helpList = reactive<MenuItem[]>([
  { id: 100, title: 'Messages', path: '/messages', icon: InboxIcon, badge: '3' },
  { id: 101, title: 'Library', path: '/library', icon: DocumentTextIcon },
  { id: 102, title: 'Settings', path: '/settings', icon: CogIcon },
  { id: 103, title: 'Support', path: '/support', icon: DevicePhoneMobileIcon },
]);

// 切分为 MAIN / HELP（你也可以按 item.section 字段分组）
const mainList = computed(() => sidebarList);
</script>

<style scoped>
.app-sidebar {
  width: 260px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(250, 250, 252, 0.96));
  border-right: 1px solid rgba(16, 24, 40, 0.04);
  box-shadow: 0 6px 24px rgba(8, 15, 36, 0.04);
  position: relative;
  font-family: Inter, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

/* header */
.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid rgba(16, 24, 40, 0.02);
}
.logo-container {
  display: flex;
  gap: 12px;
  align-items: center;
}
.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.18);
}
.logo-text {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

/* nav */
.sidebar-nav {
  padding: 14px 8px;
  overflow-y: auto;
  flex: 1;
}

/* section title */
.section {
  margin-bottom: 12px;
}
.section-title {
  font-size: 11px;
  color: #9ca3af;
  margin: 8px 12px;
  letter-spacing: 0.08em;
  font-weight: 600;
}

/* list */
.nav-list {
  list-style: none;
  padding: 6px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* footer */
.sidebar-footer {
  padding: 14px 12px;
  border-top: 1px solid rgba(16, 24, 40, 0.02);
}
.user-profile {
  display: flex;
  gap: 10px;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f97316, #d97706);
  color: white;
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(249, 115, 22, 0.12);
}
.user-name {
  font-weight: 600;
  color: #111827;
  font-size: 13px;
}
.user-role {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}
.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.06);
  border-radius: 6px;
}

/* small responsive */
@media (max-width: 900px) {
  .app-sidebar {
    width: 220px;
  }
}
</style>
