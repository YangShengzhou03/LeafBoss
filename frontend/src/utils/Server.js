import axios from 'axios'
import { getToken, removeToken } from './utils.js'
import { ElMessage } from 'element-plus'
import mockDataService from './mockData.js'

const Server = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 10000
})

Server.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

Server.interceptors.response.use(
  response => {
    if (response.data === null || response.data === undefined) {
      console.warn('响应数据为空:', response)
      return { data: null, code: 500, message: '响应数据为空' }
    }
    
    if (response.config.responseType === 'blob') {
      return response
    }
    
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
    const tryMockData = (error) => {
      const url = error.config?.url || ''
      const method = error.config?.method?.toUpperCase() || 'GET'
      const data = error.config?.data ? JSON.parse(error.config.data) : {}
      
      // 首先尝试使用getMockResponse方法
      const mockResponse = mockDataService.getMockResponse(url, method, data)
      if (mockResponse) {
        return Promise.resolve(mockResponse)
      }
      
      // 如果没有匹配的mock响应，尝试特定的路由
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
      }
      return null
    }
    
    if (!error.response) {
      console.log('网络连接失败，使用模拟数据')
      error.isNetworkError = true
      
      const mockResult = tryMockData(error)
      if (mockResult) {
        return mockResult
      }
      
      return Promise.reject(error)
    }
    
    const status = error.response.status
    
    let mockResult
    switch (status) {
      case 401:
        ElMessage.error('登录已过期，请重新登录')
        removeToken()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        break
      case 403:
        ElMessage.error('权限不足，无法访问该资源')
        break
      case 404:
        console.log('请求的资源不存在，使用模拟数据')
        error.isNotFoundError = true
        
        mockResult = tryMockData(error)
        if (mockResult) {
          return mockResult
        }
        break
      case 500:
        console.log('服务器内部错误，使用模拟数据')
        error.isServerError = true
        
        mockResult = tryMockData(error)
        if (mockResult) {
          return mockResult
        }
        break
      default:
        console.log('请求失败，使用模拟数据')
        error.isGenericError = true
        
        mockResult = tryMockData(error)
        if (mockResult) {
          return mockResult
        }
    }
    
    return Promise.reject(error)
  }
)

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
  request: (url, config = {}) => Server.get(url, config),
  download: (url, config = {}) => {
    return Server.get(url, {
      ...config,
      responseType: 'blob'
    })
  }
}

export default http