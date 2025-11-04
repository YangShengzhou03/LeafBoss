import axios from 'axios'
import { getToken, removeToken } from './utils.js'
import { ElMessage } from 'element-plus'

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
    // 网络错误处理
    if (!error.response) {
      ElMessage.error('网络连接失败，请检查网络设置')
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
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误，请稍后重试')
        break
      default:
        ElMessage.error(message)
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