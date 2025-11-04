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
      // 检查用户角色，设置管理员标志
      state.isAdmin = user.role === 1 || user.role === 'ADMIN' || user.role === 'admin'
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
      this.clearUser()
      return { success: false, message: error.response?.data?.message || '登录失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
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
      return { success: false, message: error.response?.data?.message || error.message }
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
      return { success: false, message: error.response?.data?.message || error.message }
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
      const response = await Server.get('/auth/me')
      
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
      const response = await Server.get('/user/storage')
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
      return { success: false, message: error.response?.data?.message || error.message }
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
      return { success: false, message: error.response?.data?.message || error.message }
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
        // 只有在token无效或过期时才清除token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.clearUser()
        }
        return false
      }
    }
    return false
  }
}

export default store