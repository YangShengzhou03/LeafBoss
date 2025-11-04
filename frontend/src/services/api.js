import Server from '../utils/Server'
import { ErrorHandler } from './errorHandler.js'

// 管理员API服务
export const AdminService = {
  // 获取仪表板统计数据
  async getDashboardStats() {
    return await Server.get('/admin/stats').catch(error => {
      ErrorHandler.handleApiError(error, '获取统计数据失败')
      throw error
    })
  },
  
  // 获取用户列表
  async getUserList(params) {
    return await Server.get('/admin/user/list', { params }).catch(error => {
      ErrorHandler.handleApiError(error, '获取用户列表失败')
      throw error
    })
  },
  
  // 创建用户
  async createUser(userData) {
    return await Server.post('/admin/user/create', userData).catch(error => {
      ErrorHandler.handleValidationError(error, '创建用户失败')
      throw error
    })
  },
  
  // 更新用户
  async updateUser(userId, userData) {
    return await Server.put(`/admin/user/${userId}`, userData).catch(error => {
      ErrorHandler.handleValidationError(error, '更新用户失败')
      throw error
    })
  },
  
  // 删除用户
  async deleteUser(userId) {
    return await Server.delete(`/admin/user/${userId}`).catch(error => {
      ErrorHandler.handleApiError(error, '删除用户失败')
      throw error
    })
  },
  
  // 重置用户密码
  async resetUserPassword(userId, newPassword) {
    return await Server.post(`/admin/user/${userId}/reset-password`, { password: newPassword }).catch(error => {
      ErrorHandler.handleApiError(error, '重置密码失败')
      throw error
    })
  },
  
  // 切换用户状态
  async toggleUserStatus(userId, status) {
    return await Server.put(`/admin/user/${userId}/status`, { status }).catch(error => {
      ErrorHandler.handleApiError(error, '切换用户状态失败')
      throw error
    })
  },
  
  // 获取日志列表
  async getLogList(params) {
    return await Server.get('/admin/log', { params }).catch(error => {
      ErrorHandler.handleApiError(error, '获取日志列表失败')
      throw error
    })
  },
  
  // 获取系统配置
  async getSystemConfig() {
    return await Server.get('/admin/config').catch(error => {
      ErrorHandler.handleApiError(error, '获取系统配置失败')
      throw error
    })
  },
  
  // 更新系统配置
  async updateSystemConfig(config) {
    return await Server.put('/admin/config', config).catch(error => {
      ErrorHandler.handleApiError(error, '更新系统配置失败')
      throw error
    })
  },
  
  // 获取卡密列表
  async getCardKeyList(params) {
    return await Server.get('/admin/cardkey/list', { params }).catch(error => {
      ErrorHandler.handleApiError(error, '获取卡密列表失败')
      throw error
    })
  },
  
  // 创建卡密
  async createCardKey(cardKeyData) {
    return await Server.post('/admin/cardkey/create', cardKeyData).catch(error => {
      ErrorHandler.handleValidationError(error, '创建卡密失败')
      throw error
    })
  },
  
  // 删除卡密
  async deleteCardKey(keyId) {
    return await Server.delete(`/admin/cardkey/${keyId}`).catch(error => {
      ErrorHandler.handleApiError(error, '删除卡密失败')
      throw error
    })
  },
  
  // 验证卡密
  async verifyCardKey(key) {
    return await Server.post('/admin/cardkey/verify', { key }).catch(error => {
      ErrorHandler.handleApiError(error, '验证卡密失败')
      throw error
    })
  },
  
  // 导出卡密
  async exportCardKeys(params) {
    return await Server.get('/admin/cardkey/export', { params, responseType: 'blob' }).catch(error => {
      ErrorHandler.handleApiError(error, '导出卡密失败')
      throw error
    })
  }
}

// 用户API服务
export const UserService = {
  // 用户登录
  async login(credentials) {
    try {
      return await Server.post('/user/login', credentials)
    } catch (error) {
      ErrorHandler.handleApiError(error, '登录失败')
      throw error
    }
  },
  
  // 用户注册
  async register(userData) {
    try {
      return await Server.post('/user/register', userData)
    } catch (error) {
      ErrorHandler.handleValidationError(error, '注册失败')
      throw error
    }
  },
  
  // 发送注册验证码
  async sendRegisterCode(email) {
    try {
      return await Server.post('/user/send-register-code', { email })
    } catch (error) {
      ErrorHandler.handleApiError(error, '发送验证码失败')
      throw error
    }
  },
  
  // 发送重置密码验证码
  async sendResetCode(email) {
    try {
      return await Server.post('/user/send-reset-code', { email })
    } catch (error) {
      ErrorHandler.handleApiError(error, '发送验证码失败')
      throw error
    }
  },
  
  // 重置密码
  async resetPassword(resetData) {
    try {
      return await Server.post('/user/reset-password', resetData)
    } catch (error) {
      ErrorHandler.handleApiError(error, '重置密码失败')
      throw error
    }
  },
  
  // 获取当前用户信息
  async getCurrentUser() {
    try {
      return await Server.get('/user/me')
    } catch (error) {
      ErrorHandler.handleApiError(error, '获取用户信息失败')
      throw error
    }
  },
  
  // 更新用户信息
  async updateProfile(userData) {
    try {
      return await Server.put('/user/profile', userData)
    } catch (error) {
      ErrorHandler.handleValidationError(error, '更新用户信息失败')
      throw error
    }
  },
  
  // 修改密码
  async changePassword(passwordData) {
    try {
      return await Server.put('/user/password', passwordData)
    } catch (error) {
      ErrorHandler.handleValidationError(error, '修改密码失败')
      throw error
    }
  }
}

export default {
  AdminService,
  UserService
}