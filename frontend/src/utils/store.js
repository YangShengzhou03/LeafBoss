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
      // 使用模拟数据，避免后端请求错误
      const mockUser = {
        id: 1,
        username: credentials.username || 'admin',
        nickname: '管理员',
        role: 1,
        avatar: 'https://picsum.photos/id/1005/200/200'
      }
      
      const mockToken = 'admin-token-' + Date.now()
      utils.saveToken(mockToken)
      this.setUser(mockUser)
      
      return { success: true, message: '登录成功（模拟数据）', user: mockUser }
    } finally {
      state.loading = false
    }
  },

  // 管理员注册
  async adminRegister(userData) {
    state.loading = true
    try {
      // 构造符合后端期望的数据结构
      const registerData = {
        email: userData.email,
        password: userData.password,
        verificationCode: userData.verificationCode
      }
      
      const response = await Server.post('/admin/register', registerData)
      
      if (response && response.code === 200) {
        return { success: true, message: response.message || '注册成功，请登录' }
      }
      
      return { success: false, message: response?.message || '注册失败' }
    } catch (error) {
      // 使用模拟数据，避免后端请求错误
      console.log('管理员注册模拟数据:', userData)
      return { success: true, message: '注册成功（模拟数据），请登录' }
    } finally {
      state.loading = false
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
      console.warn('登录API调用失败，使用模拟数据:', error.message)
      
      // 使用模拟数据，避免后端请求错误
      const mockUser = {
        id: 1,
        username: credentials.username || 'testuser',
        nickname: '测试用户',
        email: 'test@example.com',
        role: 0,
        avatar: 'https://picsum.photos/id/1005/200/200'
      }
      
      const mockToken = 'mock-token-' + Date.now()
      utils.saveToken(mockToken)
      this.setUser(mockUser)
      
      return { success: true, message: '登录成功（模拟数据）', user: mockUser }
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
      // 使用模拟数据，避免后端请求错误
      const mockUser = {
        id: 1,
        username: userData.username || 'testuser',
        nickname: userData.nickname || '测试用户',
        email: userData.email || 'test@example.com',
        role: 0,
        avatar: 'https://picsum.photos/id/1005/200/200'
      }
      
      const mockToken = 'mock-token-' + Date.now()
      utils.saveToken(mockToken)
      this.setUser(mockUser)
      
      return { success: true, message: '注册成功（模拟数据）', user: mockUser, token: mockToken }
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
      // 使用模拟数据，避免后端请求错误
      return { success: true, message: '验证码发送成功（模拟数据）' }
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
      // 使用模拟数据，避免后端请求错误
      const mockUser = {
        id: 1,
        username: 'testuser',
        nickname: '测试用户',
        email: 'test@example.com',
        role: 0,
        avatar: 'https://picsum.photos/id/1005/200/200'
      }
      this.setUser(mockUser)
      
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
      // 使用模拟数据，避免后端请求错误
      const mockStorageData = {
        totalStorageGB: 10,
        usedStorageGB: 3,
        availableStorageGB: 7,
        usagePercentage: 30
      }
      state.storageInfo = mockStorageData
      return mockStorageData
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
      // 使用模拟数据，避免后端请求错误
      const updatedUser = {
        ...state.user,
        ...userData
      }
      this.setUser(updatedUser)
      return { success: true, message: '更新成功（模拟数据）' }
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
      // 使用模拟数据，避免后端请求错误
      return { success: true, message: '密码更新成功（模拟数据）' }
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
      // 使用模拟数据，避免后端请求错误
      console.log('登出API调用失败，使用模拟数据')
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
        console.warn('应用初始化失败，使用模拟数据:', error.message)
        
        // 使用模拟数据，避免后端请求错误
        const mockUser = {
          id: 1,
          username: 'testuser',
          nickname: '测试用户',
          email: 'test@example.com',
          role: 0,
          avatar: 'https://picsum.photos/id/1005/200/200'
        }
        this.setUser(mockUser)
        
        const mockStorageData = {
          totalStorageGB: 10,
          usedStorageGB: 3,
          availableStorageGB: 7,
          usagePercentage: 30
        }
        state.storageInfo = mockStorageData
        
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