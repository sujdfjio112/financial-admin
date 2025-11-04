import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const name = ref('未登录');
  const token = ref('');

  function login(newName: string, newToken: string) {
    name.value = newName;
    token.value = newToken;
  }
  function logout() {
    name.value = '未登录';
    token.value = '';
  }

  return { name, token, login, logout };
});
