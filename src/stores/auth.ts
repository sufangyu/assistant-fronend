// import { router } from '@/router';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { userDetail } from '@/api/user'

const ACCESS_TOKEN_KEY = 'access_token'


export const useAuthStore = defineStore('auth', () => {
  const storageAccessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const token = ref<string | null>(storageAccessToken);
  const isSigned = computed(() => !!token.value);
  const account = ref<User | null>(null);

  function login(val: string) {
    setToken(val);
  }

  function logout() {
    setToken('');
    account.value = null;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  function setToken(val: string) {
    token.value = val;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, val)
  }

  async function getUserDetail() {
    const { data } = await userDetail();
    account.value = data;
  }

  return { token, isSigned, account, login, logout, getUserDetail }
})
