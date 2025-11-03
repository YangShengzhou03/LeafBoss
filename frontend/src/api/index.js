import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例（现代化配置）
const api = axios.create({
  baseURL: '/api',
  timeout: 15000, // 增加超时时间
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 支持跨域认证
})

// 请求缓存管理
const requestCache = new Map()

// 请求拦截器（现代化增强）
api.interceptors.request.use(
  (config) => {
    // 添加请求时间戳防止缓存
    config.headers['X-Request-Timestamp'] = Date.now()
    
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 处理GET请求缓存
    if (config.method === 'get' && config.cache) {
      const cacheKey = JSON.stringify({
        url: config.url,
        params: config.params
      })
      
      if (requestCache.has(cacheKey)) {
        const cachedResponse = requestCache.get(cacheKey)
        const cacheTime = cachedResponse.timestamp
        const now = Date.now()
        
        // 检查缓存是否过期（默认5分钟）
        if (now - cacheTime < (config.cacheTimeout || 300000)) {
          return Promise.reject(new axios.Cancel('Request canceled - using cache'))
        }
      }
    }
    
    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器（现代化错误处理）
api.interceptors.response.use(
  (response) => {
    // 缓存GET响应
    if (response.config.method === 'get' && response.config.cache) {
      const cacheKey = JSON.stringify({
        url: response.config.url,
        params: response.config.params
      })
      
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })
    }
    
    return response.data
  },
  (error) => {
    // 如果是缓存取消的请求，直接返回缓存数据
    if (axios.isCancel(error)) {
      const cacheKey = JSON.stringify({
        url: error.config.url,
        params: error.config.params
      })
      return requestCache.get(cacheKey)?.data
    }
    
    // 统一错误处理
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    
    switch (status) {
      case 400:
        ElMessage.error(`请求参数错误: ${message}`)
        break
      case 401:
        ElMessage.error('认证失败，请重新登录')
        // 清除token并跳转到登录页
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
        break
      case 403:
        ElMessage.error('权限不足')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 500:
        ElMessage.error('服务器内部错误')
        break
      case 502:
        ElMessage.error('网关错误')
        break
      case 503:
        ElMessage.error('服务不可用')
        break
      default:
        if (error.code === 'ECONNABORTED') {
          ElMessage.error('请求超时，请检查网络连接')
        } else if (error.code === 'NETWORK_ERROR') {
          ElMessage.error('网络错误，请检查网络连接')
        } else {
          ElMessage.error(`请求失败: ${message}`)
        }
    }
    
    return Promise.reject(error)
  }
)

// 重试机制
const retryRequest = async (config, retries = 3) => {
  try {
    return await api(config)
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return retryRequest(config, retries - 1)
    }
    throw error
  }
}

// API接口定义（现代化版本）
export const cardAPI = {
  // 获取卡密列表（支持缓存）
  getCards: (params, options = {}) => api.get('/cards', { 
    params, 
    cache: options.cache !== false,
    cacheTimeout: options.cacheTimeout || 300000
  }),
  
  // 添加卡密（带重试机制）
  addCard: (data) => retryRequest({ method: 'post', url: '/cards', data }),
  
  // 验证卡密
  validateCard: (cardKey) => api.post('/cards/validate', { cardKey }),
  
  // 删除卡密
  deleteCard: (id) => api.delete(`/cards/${id}`),
  
  // 批量操作
  batchDeleteCards: (ids) => api.post('/cards/batch-delete', { ids }),
  
  // 获取卡密统计
  getCardStats: () => api.get('/cards/stats', { cache: true })
}

export const specificationAPI = {
  // 获取规格列表（支持缓存）
  getSpecifications: (options = {}) => api.get('/specifications', { 
    cache: options.cache !== false,
    cacheTimeout: options.cacheTimeout || 300000
  }),
  
  // 添加规格
  addSpecification: (data) => api.post('/specifications', data),
  
  // 更新规格
  updateSpecification: (id, data) => api.put(`/specifications/${id}`, data),
  
  // 删除规格
  deleteSpecification: (id) => api.delete(`/specifications/${id}`),
  
  // 批量更新规格状态
  batchUpdateSpecStatus: (ids, status) => api.post('/specifications/batch-status', { ids, status })
}

// 卡密日志API
export const cardLogAPI = {
  // 获取卡密操作日志
  getCardLogs: (params) => api.get('/card-logs', { params }),
  
  // 导出日志
  exportLogs: (params) => api.get('/card-logs/export', { 
    params, 
    responseType: 'blob' 
  }),
  
  // 清理日志
  clearLogs: () => api.delete('/card-logs/clear')
}

// 工具函数
export const apiUtils = {
  // 清除缓存
  clearCache: (pattern) => {
    if (pattern) {
      for (const [key] of requestCache.entries()) {
        if (key.includes(pattern)) {
          requestCache.delete(key)
        }
      }
    } else {
      requestCache.clear()
    }
  },
  
  // 获取缓存状态
  getCacheStatus: () => ({
    size: requestCache.size,
    keys: Array.from(requestCache.keys())
  })
}

export default api