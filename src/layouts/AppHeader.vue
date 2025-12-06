<template>
  <header class="header">
    <!-- 移动端侧边栏切换 -->
    <button class="mobile-toggle" @click="$emit('toggle-sidebar')" aria-label="Toggle sidebar">
      <Bars3Icon class="icon mobile-toggle-icon" />
    </button>

    <!-- 搜索框 -->
    <div class="search-box">
      <MagnifyingGlassIcon class="icon search-icon" />
      <input v-model="search" type="text" placeholder="Search..." class="search-input" />
    </div>

    <!-- 右侧操作栏 -->
    <div class="actions">
      <!-- 通知 -->
      <div class="notification" @click="onClickNotification">
        <BellIcon class="icon bell" />
        <span class="badge"></span>
      </div>

      <!-- 用户信息 -->
      <div class="user" @click="toggleDropdown">
        <img src="https://i.pravatar.cc/40" alt="avatar" class="avatar" />
        <div class="info">
          <span class="name">Austin Robertson</span>
          <span class="title">Marketing Administrator</span>
        </div>
        <ChevronDownIcon class="icon chevron" :class="{ open: isOpen }" />

        <!-- 下拉菜单 -->
        <transition name="fade">
          <ul v-if="isOpen" class="dropdown">
            <li>Profile</li>
            <li>Settings</li>
            <li class="logout">Logout</li>
          </ul>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BellIcon, ChevronDownIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['toggle-sidebar']);

const search = ref('');
const isOpen = ref(false);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function onClickNotification() {
  // production: replace with logger if needed
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 10px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 移动端汉堡 */
.mobile-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: 6px;
  margin-right: 8px;
}
.mobile-toggle-icon {
  width: 22px;
  height: 22px;
  color: #333;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  width: 260px;
  position: relative;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #999;
  margin-right: 8px;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  background: transparent;
}

/* 右侧栏 */
.actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* 通知 */
.notification {
  position: relative;
  cursor: pointer;
  transition: 0.2s ease;
}

.bell {
  width: 22px;
  height: 22px;
  color: #555;
  transition: color 0.2s;
}

.notification:hover .bell {
  color: #000;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: red;
  border-radius: 50%;
}

/* 用户信息 */
.user {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.name {
  font-weight: 600;
  font-size: 14px;
  color: #222;
}

.title {
  font-size: 12px;
  color: #888;
}

.chevron {
  width: 16px;
  height: 16px;
  color: #888;
  transition: transform 0.2s;
}

.chevron.open {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.dropdown {
  position: absolute;
  right: 0;
  top: 110%;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  width: 150px;
  padding: 6px 0;
  z-index: 10;
}

.dropdown li {
  padding: 8px 14px;
  font-size: 14px;
  color: #333;
  transition: background 0.2s;
}

.dropdown li:hover {
  background: #f5f5f5;
}

.dropdown .logout {
  color: #e74c3c;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .mobile-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .search-box {
    width: 140px;
    margin-left: 8px;
  }

  .actions {
    gap: 12px;
  }
}
</style>
