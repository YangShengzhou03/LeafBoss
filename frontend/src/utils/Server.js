import axios from 'axios'
import { getToken, removeToken } from './utils.js'
import { ElMessage } from 'element-plus'
import router from '@/route'

const Server = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '/api',
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
    if (!error.response) {
      ElMessage.error('网络连接失败，请检查网络连接')
      return Promise.reject(error)
    }
    
    const status = error.response.status
    
    switch (status) {
      case 401:
        ElMessage.error('登录已过期，请重新登录')
        removeToken()
        if (router.currentRoute.value.path !== '/login') {
          router.replace('/login')
        }
        break
      case 403:
        ElMessage.error('权限不足，无法访问该资源')
        break
      case 404:
        // 不显示错误消息，由具体业务逻辑处理
        break
      case 500:
        ElMessage.error('服务器内部错误，请联系管理员')
        break
      default:
        ElMessage.error('请求失败，请稍后重试')
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