<template>
  <div class="login-page">
    <h2>登录</h2>
    <button @click="fakeLogin">模拟登录</button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
const store = useUserStore();
const router = useRouter();
function fakeLogin() {
  store.login('Gavin', 'fake-token-123');
  router.push('/dashboard');
}
</script>
