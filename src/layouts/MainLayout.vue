<template>
  <div class="app-shell">
    <AppSidebar class="sidebar" />
    <div class="main-area">
      <AppHeader class="header" />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/layouts/AppSidebar.vue';
import AppHeader from '@/layouts/AppHeader.vue';
</script>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 240px;
  border-right: 1px solid #eee;
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
</style>
