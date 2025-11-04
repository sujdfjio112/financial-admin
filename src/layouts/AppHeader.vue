<template>
  <header class="app-header">
    <div class="left">
      <button @click="$emit('toggleSidebar')">☰</button>
      <span class="logo">管理后台</span>
    </div>
    <div class="right">
      <span>{{ user.name }}</span>
      <button @click="logout">退出</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
const userStore = useUserStore();
const user = userStore;
function logout() {
  user.logout();
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}
.logo {
  font-weight: 700;
  margin-left: 8px;
}
</style>
