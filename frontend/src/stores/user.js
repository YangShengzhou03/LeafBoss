import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref({
    id: '',
    username: '',
    email: '',
    role: '',
    avatar: '',
    permissions: []
  })
  
  const isLoggedIn = computed(() => !!userInfo.value.id)
  const isAdmin = computed(() => userInfo.value.role === 'admin')
  
  // 方法
  const setUserInfo = (info) => {
    userInfo.value = { ...userInfo.value, ...info }
  }
  
  const clearUserInfo = () => {
    userInfo.value = {
      id: '',
      username: '',
      email: '',
      role: '',
      avatar: '',
      permissions: []
    }
  }
  
  const hasPermission = (permission) => {
    if (isAdmin.value) return true
    return userInfo.value.permissions.includes(permission)
  }
  
  return {
    userInfo,
    isLoggedIn,
    isAdmin,
    setUserInfo,
    clearUserInfo,
    hasPermission
  }
})