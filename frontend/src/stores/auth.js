import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/http'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const isAuthenticated = computed(() => !!token.value)
  const loading = ref(false)
  
  // 登录
  const login = async (credentials) => {
    loading.value = true
    try {
      // 测试账号：admin / admin123
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // 模拟登录成功
        const authToken = 'mock-jwt-token'
        const userData = {
          id: 1,
          username: credentials.username,
          email: 'admin@example.com',
          role: 'admin',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        }
        
        token.value = authToken
        user.value = userData
        
        // 保存token到本地存储
        localStorage.setItem('token', authToken)
        
        // 设置HTTP默认请求头
        http.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
        
        ElMessage.success('登录成功')
        return { success: true }
      } else {
        ElMessage.error('用户名或密码错误，请使用测试账号：admin / admin123')
        return { success: false, error: '用户名或密码错误' }
      }
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '登录失败')
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }
  
  // 登出
  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    ElMessage.success('已退出登录')
  }
  
  // 初始化认证状态
  const initAuth = () => {
    if (token.value) {
      http.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      // 这里可以调用API获取用户信息
      // fetchUserInfo()
    }
  }
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return
    
    try {
      // const response = await api.get('/auth/user')
      // user.value = response.data
      
      // 模拟用户信息
      user.value = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }
  
  return {
    // 状态
    user,
    token,
    isAuthenticated,
    loading,
    
    // 方法
    login,
    logout,
    initAuth,
    fetchUserInfo
  }
})