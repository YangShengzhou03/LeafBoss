import { api, safeApi, type ApiResponse } from './api'
import type { UserInfo, LoginParams, RegisterParams } from '@/types'

// 认证相关API
export const authApi = {
  // 用户登录
  login: (params: LoginParams): Promise<ApiResponse<{ token: string; user: UserInfo }>> =>
    api.post('/auth/login', params),

  // 用户注册
  register: (params: RegisterParams): Promise<ApiResponse<{ token: string; user: UserInfo }>> =>
    api.post('/auth/register', params),

  // 获取当前用户信息
  getCurrentUser: (): Promise<ApiResponse<UserInfo>> =>
    api.get('/auth/me'),

  // 刷新令牌
  refreshToken: (refreshToken: string): Promise<ApiResponse<{ token: string }>> =>
    api.post('/auth/refresh', { refreshToken }),

  // 修改密码
  changePassword: (params: { oldPassword: string; newPassword: string }): Promise<ApiResponse<void>> =>
    api.post('/auth/change-password', params),

  // 退出登录
  logout: (): Promise<ApiResponse<void>> =>
    api.post('/auth/logout'),

  // 发送重置密码邮件
  forgotPassword: (email: string): Promise<ApiResponse<void>> =>
    api.post('/auth/forgot-password', { email }),

  // 重置密码
  resetPassword: (params: { token: string; newPassword: string }): Promise<ApiResponse<void>> =>
    api.post('/auth/reset-password', params),
}

// 安全的认证API（自动错误处理）
export const safeAuthApi = {
  login: (params: LoginParams) => safeApi.post('/auth/login', params),
  register: (params: RegisterParams) => safeApi.post('/auth/register', params),
  getCurrentUser: () => safeApi.get('/auth/me'),
  refreshToken: (refreshToken: string) => safeApi.post('/auth/refresh', { refreshToken }),
  changePassword: (params: { oldPassword: string; newPassword: string }) => safeApi.post('/auth/change-password', params),
  logout: () => safeApi.post('/auth/logout'),
  forgotPassword: (email: string) => safeApi.post('/auth/forgot-password', { email }),
  resetPassword: (params: { token: string; newPassword: string }) => safeApi.post('/auth/reset-password', params),
}