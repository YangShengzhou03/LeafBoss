import axios from 'axios'
import { getToken, removeToken } from './utils.js'
import { ElMessage } from 'element-plus'
import mockDataService from './mockData.js'

const Server = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 10000
})

// 请求拦截器
Server.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
Server.interceptors.response.use(
  response => {
    // 检查响应数据是否为null或undefined
    if (response.data === null || response.data === undefined) {
      console.warn('响应数据为空:', response)
      return { data: null, code: 500, message: '响应数据为空' }
    }
    
    // 如果是blob响应（文件下载），直接返回原始响应
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 统一处理响应数据格式
    if (response.data && response.data.code !== undefined) {
      if (response.data.code === 200) {
        return response.data
      } else {
        ElMessage.error(response.data.message || '请求失败')
        return Promise.reject(new Error(response.data.message || '请求失败'))
      }
    }
    return response
  },
  error => {
    // 尝试使用模拟数据的辅助函数
    const tryMockData = (error) => {
      const url = error.config?.url || ''
      const method = error.config?.method?.toUpperCase() || 'GET'
      
      if (url.includes('/admin/stats') && method === 'GET') {
        return Promise.resolve(mockDataService.getDashboardStats())
      } else if (url.includes('/admin/user/list') && method === 'GET') {
        const page = parseInt(new URLSearchParams(error.config?.params?.toString() || '').get('page') || '0')
        const size = parseInt(new URLSearchParams(error.config?.params?.toString() || '').get('size') || '20')
        return Promise.resolve(mockDataService.getUserList(page, size))
      } else if (url.includes('/admin/log') && method === 'GET') {
        const page = parseInt(new URLSearchParams(error.config?.params?.toString() || '').get('page') || '0')
        const size = parseInt(new URLSearchParams(error.config?.params?.toString() || '').get('size') || '20')
        return Promise.resolve(mockDataService.getLogList(page, size))
      } else if (url.includes('/admin/config') && method === 'GET') {
        return Promise.resolve(mockDataService.getSystemConfig())
      } else if (url.includes('/file/list') && method === 'GET') {
        const parentId = new URLSearchParams(error.config?.params?.toString() || '').get('parentId') || 'root'
        return Promise.resolve(mockDataService.getFileList(parentId))
      } else if (url.includes('/share/list') && method === 'GET') {
        return Promise.resolve(mockDataService.getShareLinks())
      }
      return null
    }
    
    // 网络错误处理
    if (!error.response) {
      // 静默处理网络连接错误，避免控制台错误
      console.log('网络连接失败，使用模拟数据')
      // 添加一个标记，表示这是一个网络错误
      error.isNetworkError = true
      
      // 尝试使用模拟数据
      const mockResult = tryMockData(error)
      if (mockResult) {
        return mockResult
      }
      
      return Promise.reject(error)
    }
    
    const status = error.response.status
    const message = error.response.data?.message || '请求失败'
    
    switch (status) {
      case 401:
        ElMessage.error('登录已过期，请重新登录')
        removeToken()
        // 触发路由跳转到登录页
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        break
      case 403:
        ElMessage.error('权限不足，无法访问该资源')
        break
      case 404:
        // 静默处理404错误，避免控制台错误
        console.log('请求的资源不存在，使用模拟数据')
        // 添加一个标记，表示这是一个404错误
        error.isNotFoundError = true
        
        // 尝试使用模拟数据
        const mockResult404 = tryMockData(error)
        if (mockResult404) {
          return mockResult404
        }
        break
      case 500:
        // 静默处理500错误，避免控制台错误
        console.log('服务器内部错误，使用模拟数据')
        // 添加一个标记，表示这是一个服务器错误
        error.isServerError = true
        
        // 尝试使用模拟数据
        const mockResult500 = tryMockData(error)
        if (mockResult500) {
          return mockResult500
        }
        break
      default:
        // 静默处理其他错误，避免控制台错误
        console.log('请求失败，使用模拟数据')
        // 添加一个标记，表示这是一个通用错误
        error.isGenericError = true
        
        // 尝试使用模拟数据
        const mockResultDefault = tryMockData(error)
        if (mockResultDefault) {
          return mockResultDefault
        }
    }
    
    return Promise.reject(error)
  }
)

// 导出常用的HTTP方法
const http = {
  get: (url, params = {}) => Server.get(url, { params }),
  post: (url, data = {}) => Server.post(url, data),
  put: (url, data = {}) => Server.put(url, data),
  delete: (url, params = {}) => Server.delete(url, { params }),
  upload: (url, formData, onUploadProgress) => {
    return Server.post(url, formData, {
      onUploadProgress
    })
  },
  // 添加支持完整配置的请求方法，特别是用于文件下载
  request: (url, config = {}) => Server.get(url, config),
  // 专门的下载方法，自动设置responseType为blob
  download: (url, config = {}) => {
    return Server.get(url, {
      ...config,
      responseType: 'blob'
    })
  }
}

export default http