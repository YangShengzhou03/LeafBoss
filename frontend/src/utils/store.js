import { reactive } from 'vue'
import Server from './Server.js'
import * as utils from './utils.js'

// 全局状态
const state = reactive({
  user: null,
  isAuthenticated: utils.isLoggedIn(),
  loading: false,
  isAdmin: false,
  storageInfo: {
    totalStorageGB: 0,
    usedStorageGB: 0
  }
})

// 状态管理方法
const store = {
  state,

  // 设置用户信息
  setUser(user) {
    if (user) {
      state.user = user
      state.isAuthenticated = true
      // 系统只有管理员，所有登录用户都是管理员
      state.isAdmin = true
      // 更新存储信息
      if (user.storageInfo) {
        state.storageInfo = user.storageInfo
      }
    }
  },

  // 清除用户信息
  clearUser() {
    state.user = null
    state.isAuthenticated = false
    state.isAdmin = false
    utils.removeToken()
    // 重置存储信息为默认值
    state.storageInfo = {
      totalStorageGB: 0,
      usedStorageGB: 0
    }
  },

  // 更新存储信息
  updateStorageInfo(storageInfo) {
    if (storageInfo) {
      state.storageInfo = storageInfo
    }
  },

  // 管理员登录
  async adminLogin(credentials) {
    state.loading = true
    try {
      const response = await Server.post('/admin/login', credentials)
      
      if (response && response.code === 200 && response.data) {
        const { token, user } = response.data
        
        if (token) {
          utils.saveToken(token)
        }
        
        // 设置用户信息
        if (user) {
          this.setUser(user)
        }
        
        return { success: true, message: response.message || '登录成功', user }
      }
      
      return { success: false, message: response?.message || '登录失败' }
    } catch (error) {
      return { success: false, message: '登录失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  // 管理员注册
  async adminRegister(registerData) {
    try {
      const response = await adminApi.register(registerData);
      return { success: true, message: response.message };
    } catch (error) {
      throw error;
    }
  },

  // 登录
  async login(credentials) {
    state.loading = true
    try {
      const response = await Server.post('/auth/login', credentials)
      
      // 后端返回的数据结构是 {code: 200, message: "登录成功", data: {token: "...", user: {...}}}
      // 注意：Server.js的响应拦截器已经将后端返回的完整响应包装成了response.data
      if (response && response.code === 200 && response.data) {
        const { token, user } = response.data
        
        if (token) {
          utils.saveToken(token)
        }
        
        // 设置用户信息
        if (user) {
          this.setUser(user)
        } else {
          // 如果没有返回用户信息，需要额外获取
          await this.fetchCurrentUser()
        }
        
        return { success: true, message: response.message || '登录成功', user }
      }
      
      return { success: false, message: response?.message || '登录失败' }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, message: '登录失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  // 更新用户信息
  async updateUserProfile(userData) {
    try {
      const response = await Server.put('/user/profile', userData)
      
      if (response && response.code === 200 && response.data) {
        // 更新本地用户信息
        this.setUser({ ...state.user, ...response.data })
        return { success: true, message: response.message || '更新成功' }
      }
      
      return { success: false, message: response?.message || '更新失败' }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return { success: false, message: '更新失败，请重试' }
    }
  },

  // 修改密码
  async changePassword(passwordData) {
    try {
      const response = await Server.put('/user/password', passwordData)
      
      if (response && response.code === 200) {
        return { success: true, message: response.message || '密码修改成功' }
      }
      
      return { success: false, message: response?.message || '密码修改失败' }
    } catch (error) {
      console.error('修改密码失败:', error)
      return { success: false, message: '密码修改失败，请重试' }
    }
  },

  // 检查登录状态
  checkAuthStatus() {
    const token = utils.getToken()
    if (!token) {
      this.clearUser()
      return false
    }
    
    // 检查token是否过期
    try {
      const decoded = utils.parseJWT(token)
      if (decoded.exp * 1000 < Date.now()) {
        this.clearUser()
        return false
      }
      
      // 如果用户信息不存在，尝试获取
      if (!state.user) {
        this.fetchCurrentUser()
      }
      
      return true
    } catch (error) {
      console.error('检查登录状态失败:', error)
      this.clearUser()
      return false
    }
  },

  // 设置加载状态
  setLoading(loading) {
    state.loading = loading
  },

  // 获取加载状态
  getLoading() {
    return state.loading
  },

  // 注册
  async register(userData) {
    state.loading = true
    try {
      const response = await Server.post('/auth/register', userData)
      
      // 后端返回的数据结构是 {code: 200, message: "注册成功", data: {token: "...", user: {...}}}
      // 注意：Server.js的响应拦截器已经将后端返回的完整响应包装成了response.data
      if (response && response.code === 200 && response.data) {
        const { token, user } = response.data
        
        if (token) {
          // 保存token
          utils.saveToken(token)
          
          // 设置用户信息
          if (user) {
            this.setUser(user)
          } else {
            // 如果没有返回用户信息，需要额外获取
            await this.fetchCurrentUser()
          }
          
          return { success: true, message: response.message || '注册成功', user, token }
        } else {
          // 如果后端没有返回token，注册成功但需要手动登录
          return { success: true, message: response.message || '注册成功，请登录' }
        }
      }
      
      return { success: false, message: response?.message || '注册失败' }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, message: '注册失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  // 发送邮箱验证码
  async sendVerificationCode(email) {
    state.loading = true
    try {
      await Server.post('/verification/send', { email })
      return { success: true, message: '验证码发送成功' }
    } catch (error) {
      console.error('发送验证码失败:', error)
      return { success: false, message: '验证码发送失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  // 获取当前用户信息
  async fetchCurrentUser() {
    if (!utils.isLoggedIn()) {
      this.clearUser()
      return
    }

    try {
      const response = await Server.get('/api/auth/me')
      
      // 根据API响应结构，用户信息在response.data中
      // 响应结构: {code: 200, message: "操作成功", data: {用户信息}}
      if (response && response.code === 200 && response.data) {
        this.setUser(response.data)
        
        // 如果用户信息中包含存储信息，更新存储信息
        if (response.data.storageInfo) {
          this.updateStorageInfo(response.data.storageInfo)
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      
      // 只有在token无效或过期时才清除token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.clearUser()
      }
    }
  },

  // 获取存储信息
  async fetchStorageInfo() {
    if (!utils.isLoggedIn()) {
      return null
    }

    try {
      const response = await Server.get('/api/user/storage')
      // 注意：Server.js的响应拦截器已经将后端返回的完整响应包装成了response.data
      // 后端返回的数据结构是 {code: 200, message: "success", data: {storageQuota: 1073741824, usedStorage: 1048576, ...}}
      const storageData = response.data || response
      
      // 将后端返回的字节转换为GB，并更新存储信息
      if (storageData) {
        state.storageInfo = {
          totalStorageGB: storageData.storageQuota ? (storageData.storageQuota / (1024 * 1024 * 1024)) : 0,
          usedStorageGB: storageData.usedStorage ? (storageData.usedStorage / (1024 * 1024 * 1024)) : 0,
          availableStorageGB: storageData.availableStorage ? (storageData.availableStorage / (1024 * 1024 * 1024)) : 0,
          usagePercentage: storageData.usagePercentage || 0
        }
      }
      return storageData
    } catch (error) {
      console.error('获取存储信息失败:', error)
      return null
    }
  },

  // 更新用户信息
  async updateProfile(userData) {
    state.loading = true
    try {
      const response = await Server.put('/user/profile', userData)
      this.setUser(response.data)
      return { success: true, message: '更新成功' }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return { success: false, message: '更新失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  // 更新密码
  async updatePassword(passwordData) {
    state.loading = true
    try {
      await Server.put('/user/password', passwordData)
      return { success: true, message: '密码更新成功' }
    } catch (error) {
      console.error('更新密码失败:', error)
      return { success: false, message: '密码更新失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  // 登出
  async logout() {
    try {
      // 调用后端登出API
      await Server.post('/auth/logout')
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 无论API调用是否成功，都清除本地状态
      this.clearUser()
    }
  },

  // 初始化应用时检查登录状态
  async init() {
    if (utils.isLoggedIn()) {
      try {
        await this.fetchCurrentUser()
        await this.fetchStorageInfo()
        return true
      } catch (error) {
        console.error('应用初始化失败:', error)
        
        // 只有在token无效或过期时才清除token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.clearUser()
        }
        return false
      }
    } else {
      // 未登录状态，确保用户信息被清除
      this.clearUser()
    }
    return false
  },

}

export default store