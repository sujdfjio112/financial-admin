<template>
  <div class="app-shell">
    <AppSidebar :class="['sidebar', { 'sidebar-open': isSidebarOpen }]" />

    <div class="main-area">
      <AppHeader class="header" @toggle-sidebar="toggleSidebar" />

      <main class="content">
        <router-view />
      </main>
    </div>

    <div v-if="isSidebarOpen" class="overlay" @click="toggleSidebar"></div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/layouts/AppSidebar.vue';
import AppHeader from '@/layouts/AppHeader.vue';
import { ref } from 'vue';

const isSidebarOpen = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  position: relative;
}
.sidebar {
  width: var(--sidebar-width, 240px);
  border-right: 1px solid #eee;
  transition: transform 0.25s ease;
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  height: 60px;
  border-bottom: 1px solid #eee;
}
.content {
  padding: 16px;
  overflow: auto;
  flex: 1;
  background: #f5f7fa;
}

/* Mobile behavior: slide-in sidebar */
@media (max-width: 900px) {
  .app-shell {
    display: block;
    height: 100vh;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    z-index: 40;
    width: var(--sidebar-width);
    box-shadow: 0 16px 40px rgba(0,0,0,0.12);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .main-area {
    margin-left: 0;
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 20;
  }
}
</style>
