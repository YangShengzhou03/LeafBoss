import { request } from './api'
import type { UserInfo, LoginParams, RegisterParams, ApiResponse } from '@/types'

// 认证相关的错误类型
export interface AuthError {
  code: string
  message: string
  details?: any
}

// 登录响应数据类型
export interface LoginResponse {
  token: string
  user: UserInfo
  expiresIn: number
  refreshToken?: string
}

// 注册响应数据类型
export interface RegisterResponse {
  userId: string
  username: string
  email: string
}

export const authApi = {
  // 用户登录
  login: (data: LoginParams): Promise<ApiResponse<LoginResponse>> => {
    return request.post('/auth/login', data)
  },

  // 用户注册
  register: (data: RegisterParams): Promise<ApiResponse<RegisterResponse>> => {
    return request.post('/auth/register', data)
  },

  // 获取用户信息
  getUserInfo: (): Promise<ApiResponse<UserInfo>> => {
    return request.get('/auth/userinfo')
  },

  // 刷新token
  refreshToken: (): Promise<ApiResponse<{ token: string; expiresIn: number }>> => {
    return request.post('/auth/refresh')
  },

  // 用户登出
  logout: (): Promise<ApiResponse<null>> => {
    return request.post('/auth/logout')
  },

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
    return request.post('/auth/change-password', data)
  },

  // 忘记密码
  forgotPassword: (data: { email: string }): Promise<ApiResponse<{ resetToken: string }>> => {
    return request.post('/auth/forgot-password', data)
  },

  // 重置密码
  resetPassword: (data: { token: string; newPassword: string }): Promise<ApiResponse<null>> => {
    return request.post('/auth/reset-password', data)
  },

  // 验证token
  verifyToken: (token: string): Promise<ApiResponse<{ valid: boolean; user?: UserInfo }>> => {
    return request.post('/auth/verify-token', { token })
  },

  // 检查用户名是否可用
  checkUsername: (username: string): Promise<ApiResponse<{ available: boolean }>> => {
    return request.get(`/auth/check-username/${username}`)
  },

  // 检查邮箱是否可用
  checkEmail: (email: string): Promise<ApiResponse<{ available: boolean }>> => {
    return request.get(`/auth/check-email/${email}`)
  }
}

// 安全版本的API调用，包含错误处理和重试机制
export const safeAuthApi = {
  login: async (data: LoginParams, retryCount = 3) => {
    for (let i = 0; i < retryCount; i++) {
      try {
        const response = await authApi.login(data)
        return response
      } catch (error: any) {
        if (i === retryCount - 1) {
          return {
            success: false,
            message: error.response?.data?.message || '登录请求失败',
            data: null
          }
        }
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    return {
      success: false,
      message: '登录请求失败',
      data: null
    }
  },

  register: async (data: RegisterParams, retryCount = 2) => {
    for (let i = 0; i < retryCount; i++) {
      try {
        const response = await authApi.register(data)
        return response
      } catch (error: any) {
        if (i === retryCount - 1) {
          return {
            success: false,
            message: error.response?.data?.message || '注册请求失败',
            data: null
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    return {
      success: false,
      message: '注册请求失败',
      data: null
    }
  },

  getUserInfo: async (retryCount = 2) => {
    for (let i = 0; i < retryCount; i++) {
      try {
        const response = await authApi.getUserInfo()
        return response
      } catch (error: any) {
        if (i === retryCount - 1) {
          return {
            success: false,
            message: error.response?.data?.message || '获取用户信息失败',
            data: null
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    return {
      success: false,
      message: '获取用户信息失败',
      data: null
    }
  },

  checkUsername: async (username: string) => {
    try {
      return await authApi.checkUsername(username)
    } catch (error: any) {
      return {
        success: false,
        message: '检查用户名失败',
        data: { available: false }
      }
    }
  },

  checkEmail: async (email: string) => {
    try {
      return await authApi.checkEmail(email)
    } catch (error: any) {
      return {
        success: false,
        message: '检查邮箱失败',
        data: { available: false }
      }
    }
  }
}

// 认证工具函数
export class AuthUtil {
  // 检查token是否过期
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  // 从token中解析用户信息
  static parseToken(token: string): { userId: string; username: string; exp: number } | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        userId: payload.sub || payload.userId,
        username: payload.username,
        exp: payload.exp
      }
    } catch {
      return null
    }
  }

  // 生成随机token（用于测试）
  static generateMockToken(): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
      sub: 'mock-user-id',
      username: 'mock-user',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1小时后过期
      iat: Math.floor(Date.now() / 1000)
    }))
    const signature = 'mock-signature'
    return `${header}.${payload}.${signature}`
  }
}