import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 主题设置
  const theme = ref(localStorage.getItem('theme') || 'light')
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  
  // 设置主题
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }
  
  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  // 设置加载状态
  const setLoading = (status) => {
    loading.value = status
  }
  
  return {
    theme,
    sidebarCollapsed,
    loading,
    setTheme,
    toggleSidebar,
    setLoading
  }
})