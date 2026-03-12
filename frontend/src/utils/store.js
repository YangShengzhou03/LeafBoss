import { reactive } from 'vue'
import * as utils from './utils.js'
import api from '@/services/api.js'

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

const store = {
  state,

  setUser(user) {
    if (user) {
      state.user = user
      state.isAuthenticated = true
      state.isAdmin = true
      if (user.storageInfo) {
        state.storageInfo = user.storageInfo
      }
    }
  },

  clearUser() {
    state.user = null
    state.isAuthenticated = false
    state.isAdmin = false
    utils.removeToken()
    state.storageInfo = {
      totalStorageGB: 0,
      usedStorageGB: 0
    }
  },

  updateStorageInfo(storageInfo) {
    if (storageInfo) {
      state.storageInfo = storageInfo
    }
  },

  async login(credentials) {
    state.loading = true
    try {
      const response = await api.user.login(credentials)

      if (response && response.code === 200 && response.data) {
        const { token, user } = response.data

        if (token) {
          utils.saveToken(token)
        }

        if (user) {
          this.setUser(user)
        } else {
          await this.fetchCurrentUser()
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

  async register(userData) {
    state.loading = true
    try {
      const response = await api.user.register(userData)
      if (response && response.code === 200) {
        // 注册成功后自动登录
        return await this.login({
          email: userData.email,
          password: userData.password
        })
      }
      return { success: false, message: response?.message || '注册失败' }
    } catch (error) {
      return { success: false, message: '注册失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  async resetPassword(data) {
    state.loading = true
    try {
      const response = await api.user.resetPassword(data)
      if (response && response.code === 200) {
        return { success: true, message: '密码重置成功' }
      }
      return { success: false, message: response?.message || '密码重置失败' }
    } catch (error) {
      return { success: false, message: '密码重置失败，请检查网络连接' }
    } finally {
      state.loading = false
    }
  },

  async checkAuthStatus() {
    const token = utils.getToken()
    if (!token) {
      this.clearUser()
      return false
    }

    try {
      const decoded = utils.parseJWT(token)

      if (!decoded || !decoded.exp || decoded.exp * 1000 < Date.now()) {
        this.clearUser()
        return false
      }

      if (!state.user) {
        await this.fetchCurrentUser()
      }

      return true
    } catch (error) {
      this.clearUser()
      return false
    }
  },

  async fetchCurrentUser() {
    if (!utils.isLoggedIn()) {
      this.clearUser()
      return
    }

    try {
      const response = await api.user.getCurrentUser()

      if (response && response.code === 200 && response.data) {
        this.setUser(response.data)

        if (response.data.storageInfo) {
          this.updateStorageInfo(response.data.storageInfo)
        }
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.clearUser()
      }
    }
  },

  async fetchStorageInfo() {
    if (!utils.isLoggedIn()) {
      return null
    }

    try {
      const response = await api.user.getStorageInfo()
      const storageData = response.data || response

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

  async updateProfile(userData) {
    state.loading = true
    try {
      const response = await api.user.updateUserInfo(userData)
      this.setUser(response.data)
      return { success: true, message: '更新成功' }
    } catch (error) {
      return { success: false, message: '更新失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  async updatePassword(passwordData) {
    state.loading = true
    try {
      await api.user.changePassword(passwordData)
      return { success: true, message: '密码更新成功' }
    } catch (error) {
      return { success: false, message: '密码更新失败，请重试' }
    } finally {
      state.loading = false
    }
  },

  async logout() {
    try {
      await api.user.logout()
    } catch (error) {
      // 忽略登出错误，继续清理用户信息
    } finally {
      this.clearUser()
    }
  },

  async init() {
    if (utils.isLoggedIn()) {
      try {
        await this.fetchCurrentUser()
        await this.fetchStorageInfo()
        return true
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.clearUser()
        }
        return false
      }
    } else {
      this.clearUser()
    }
    return false
  }
}

export default store