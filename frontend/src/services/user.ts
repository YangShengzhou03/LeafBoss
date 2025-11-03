import { api, safeApi, type ApiResponse, type PaginationParams, type PaginationResponse } from './api'
import type { UserInfo, UserListParams, CreateUserParams, UpdateUserParams } from '@/types'

// 用户管理相关API
export const userApi = {
  // 获取用户列表
  getUserList: (params: UserListParams & PaginationParams): Promise<ApiResponse<PaginationResponse<UserInfo>>> =>
    api.get('/users', { params }),

  // 获取用户详情
  getUserDetail: (id: number): Promise<ApiResponse<UserInfo>> =>
    api.get(`/users/${id}`),

  // 创建用户
  createUser: (params: CreateUserParams): Promise<ApiResponse<UserInfo>> =>
    api.post('/users', params),

  // 更新用户信息
  updateUser: (id: number, params: UpdateUserParams): Promise<ApiResponse<UserInfo>> =>
    api.put(`/users/${id}`, params),

  // 删除用户
  deleteUser: (id: number): Promise<ApiResponse<void>> =>
    api.delete(`/users/${id}`),

  // 批量删除用户
  batchDeleteUsers: (ids: number[]): Promise<ApiResponse<void>> =>
    api.post('/users/batch-delete', { ids }),

  // 启用/禁用用户
  toggleUserStatus: (id: number, status: boolean): Promise<ApiResponse<void>> =>
    api.patch(`/users/${id}/status`, { status }),

  // 重置用户密码
  resetUserPassword: (id: number, newPassword: string): Promise<ApiResponse<void>> =>
    api.post(`/users/${id}/reset-password`, { newPassword }),

  // 获取用户统计信息
  getUserStats: (): Promise<ApiResponse<{
    total: number
    active: number
    inactive: number
    todayRegistered: number
  }>> => api.get('/users/stats'),
}

// 安全的用户管理API
export const safeUserApi = {
  getUserList: (params: UserListParams & PaginationParams) => safeApi.get('/users', { params }),
  getUserDetail: (id: number) => safeApi.get(`/users/${id}`),
  createUser: (params: CreateUserParams) => safeApi.post('/users', params),
  updateUser: (id: number, params: UpdateUserParams) => safeApi.put(`/users/${id}`, params),
  deleteUser: (id: number) => safeApi.delete(`/users/${id}`),
  batchDeleteUsers: (ids: number[]) => safeApi.post('/users/batch-delete', { ids }),
  toggleUserStatus: (id: number, status: boolean) => safeApi.patch(`/users/${id}/status`, { status }),
  resetUserPassword: (id: number, newPassword: string) => safeApi.post(`/users/${id}/reset-password`, { newPassword }),
  getUserStats: () => safeApi.get('/users/stats'),
}