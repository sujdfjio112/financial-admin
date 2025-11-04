<template>
  <aside class="app-sidebar">
    <nav>
      <ul>
        <li><router-link to="/dashboard">仪表盘</router-link></li>
        <!-- 更多菜单 -->
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-sidebar {
  padding: 16px;
  background: #fff;
  height: 100%;
}
.app-sidebar ul { list-style: none; padding: 0; }
.app-sidebar li { margin: 8px 0; }
</style>
