import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { errorHandler, safeAsync } from '@/utils/errorHandler'
import { useUserStore } from '@/stores'

// API响应数据结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp: number
}

// 分页响应数据结构
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
    pages: number
  }
}

// API配置
export interface ApiConfig extends AxiosRequestConfig {
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  retryCount?: number
  timeout?: number
}

// API服务类
export class ApiService {
  private instance: AxiosInstance
  private baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  // 设置拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加认证令牌
        const userStore = useUserStore()
        const token = userStore.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 添加请求时间戳
        config.headers['X-Request-Timestamp'] = Date.now()

        return config
      },
      (error) => {
        errorHandler.handleError(error, '请求拦截器')
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // 处理成功响应
        return this.handleSuccessResponse(response)
      },
      (error) => {
        // 处理错误响应
        return this.handleErrorResponse(error)
      }
    )
  }

  // 处理成功响应
  private handleSuccessResponse(response: AxiosResponse): ApiResponse {
    const { data, config } = response

    // 统一响应格式
    const apiResponse: ApiResponse = {
      code: data.code || 200,
      message: data.message || '请求成功',
      data: data.data || data,
      success: data.success !== undefined ? data.success : data.code === 200,
      timestamp: Date.now(),
    }

    // 业务逻辑错误处理
    if (!apiResponse.success) {
      const error = new Error(apiResponse.message)
      errorHandler.handleError(error, '业务逻辑错误')
      throw error
    }

    return apiResponse
  }

  // 处理错误响应
  private handleErrorResponse(error: any): Promise<never> {
    const { config, response } = error

    // 网络错误
    if (!response) {
      errorHandler.handleError(error, '网络错误')
      return Promise.reject(error)
    }

    const { status, data } = response

    // 认证错误
    if (status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      errorHandler.handleError(error, '认证错误')
    }

    // 权限错误
    if (status === 403) {
      errorHandler.handleError(error, '权限错误')
    }

    // 服务器错误
    if (status >= 500) {
      errorHandler.handleError(error, '服务器错误')
    }

    // 客户端错误
    if (status >= 400 && status < 500) {
      errorHandler.handleError(error, '客户端错误')
    }

    return Promise.reject(error)
  }

  // 通用请求方法
  async request<T = any>(config: ApiConfig): Promise<ApiResponse<T>> {
    const {
      showLoading = true,
      loadingText = '加载中...',
      showError = true,
      retryCount = 0,
      ...axiosConfig
    } = config

    let loadingId: number | null = null

    try {
      // 显示加载状态
      if (showLoading && typeof window !== 'undefined' && window.$loading) {
        loadingId = window.$loading.show(loadingText)
      }

      // 执行请求
      const response = await this.instance.request(axiosConfig)

      // 隐藏加载状态
      if (loadingId !== null && typeof window !== 'undefined' && window.$loading) {
        window.$loading.hide(loadingId)
      }

      return response
    } catch (error) {
      // 隐藏加载状态
      if (loadingId !== null && typeof window !== 'undefined' && window.$loading) {
        window.$loading.hide(loadingId)
      }

      // 显示错误信息
      if (showError) {
        errorHandler.handleError(error, 'API请求错误')
      }

      throw error
    }
  }

  // GET请求
  async get<T = any>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      ...config,
    })
  }

  // POST请求
  async post<T = any>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    })
  }

  // PUT请求
  async put<T = any>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    })
  }

  // DELETE请求
  async delete<T = any>(url: string, config?: ApiConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    })
  }

  // PATCH请求
  async patch<T = any>(url: string, data?: any, config?: ApiConfig): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    })
  }

  // 上传文件
  async upload<T = any>(url: string, file: File, config?: ApiConfig): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    })
  }

  // 下载文件
  async download(url: string, filename?: string, config?: ApiConfig): Promise<void> {
    const response = await this.request<Blob>({
      method: 'GET',
      url,
      responseType: 'blob',
      showLoading: false,
      ...config,
    })

    // 创建下载链接
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // 设置认证令牌
  setAuthToken(token: string): void {
    this.instance.defaults.headers.Authorization = `Bearer ${token}`
  }

  // 移除认证令牌
  removeAuthToken(): void {
    delete this.instance.defaults.headers.Authorization
  }

  // 获取实例（用于自定义配置）
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// 创建全局API实例
export const apiService = new ApiService()

// 便捷函数
export const api = {
  get: apiService.get.bind(apiService),
  post: apiService.post.bind(apiService),
  put: apiService.put.bind(apiService),
  delete: apiService.delete.bind(apiService),
  patch: apiService.patch.bind(apiService),
  upload: apiService.upload.bind(apiService),
  download: apiService.download.bind(apiService),
}

// 安全API调用（自动错误处理）
export const safeApi = {
  get: <T = any>(url: string, config?: ApiConfig) =>
    safeAsync(() => api.get<T>(url, config), `GET ${url}`),
  
  post: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    safeAsync(() => api.post<T>(url, data, config), `POST ${url}`),
  
  put: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    safeAsync(() => api.put<T>(url, data, config), `PUT ${url}`),
  
  delete: <T = any>(url: string, config?: ApiConfig) =>
    safeAsync(() => api.delete<T>(url, config), `DELETE ${url}`),
  
  patch: <T = any>(url: string, data?: any, config?: ApiConfig) =>
    safeAsync(() => api.patch<T>(url, data, config), `PATCH ${url}`),
}

export default apiService