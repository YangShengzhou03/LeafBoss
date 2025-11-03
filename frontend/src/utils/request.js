import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AppStorage } from './storage.js'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = AppStorage.getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 如果响应数据包含code字段，按业务逻辑处理
    if (data && typeof data.code !== 'undefined') {
      if (data.code === 200 || data.code === 0) {
        return data
      } else {
        // 业务错误
        ElMessage.error(data.message || '操作失败')
        return Promise.reject(new Error(data.message || '操作失败'))
      }
    }
    
    return data
  },
  (error) => {
    console.error('Response interceptor error:', error)
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          ElMessageBox.confirm('登录已过期，请重新登录', '确认登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 清除token并跳转到登录页
            AppStorage.clearAppData()
            window.location.href = '/login'
          })
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '网络错误')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

// 通用请求方法
export const request = {
  get(url, config) {
    return service.get(url, config)
  },
  
  post(url, data, config) {
    return service.post(url, data, config)
  },
  
  put(url, data, config) {
    return service.put(url, data, config)
  },
  
  delete(url, config) {
    return service.delete(url, config)
  },
  
  patch(url, data, config) {
    return service.patch(url, data, config)
  }
}

export default service