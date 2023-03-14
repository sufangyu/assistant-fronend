/**
 * 系统主题色
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ThemeEnum, type ThemeType } from '@/enum'

const THEME_LOCAL_STORAGE_KEY = 'tools-theme'

export const useThemeStore = defineStore('theme', () => {
  const themeCode = (window.localStorage.getItem(THEME_LOCAL_STORAGE_KEY) ??
    ThemeEnum.SYSTEM) as ThemeType
  // console.log('themeCode =>', themeCode);
  const theme = ref<ThemeType>(themeCode)

  function setTheme(code: ThemeType) {
    theme.value = code
    document.querySelector('html')?.setAttribute('data-theme', code)
    window.localStorage.setItem(THEME_LOCAL_STORAGE_KEY, code)
  }

  return { theme, setTheme }
})
