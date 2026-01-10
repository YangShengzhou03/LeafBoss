import axios from 'axios'
import { getToken, removeToken } from './utils.js'
import { ElMessage } from 'element-plus'
import router from '@/route'
import store from './store.js'

const Server = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '',
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
        if (response.data.message && (response.data.message.includes('Token无效') ||
          response.data.message.includes('Token过期') ||
          response.data.message.includes('未授权访问'))) {
          handleTokenExpiration()
          return Promise.reject(new Error('登录已过期，请重新登录'))
        }

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
    const url = error.config?.url || ''

    switch (status) {
      case 401:
        handleTokenExpiration()
        break
      case 403:
        ElMessage.error('权限不足，无法访问该资源')
        break
      case 404:
        if (url.includes('/api/card-keys/')) {
          ElMessage.error('卡密不存在或参数错误')
        }
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

function handleTokenExpiration() {
  removeToken()

  if (store && store.clearUser) {
    store.clearUser()
  }

  ElMessage.error('登录已过期，请重新登录')

  const currentPath = router.currentRoute.value.path
  if (currentPath !== '/login' && !currentPath.includes('/login')) {
    router.replace('/login')
  }
}

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