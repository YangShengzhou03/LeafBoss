import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import api from '@/api'

// 请求状态管理
export const useApiStore = defineStore('api', () => {
  // 状态
  const loading = ref(false)
  const loadingInstance = ref(null)
  const error = ref(null)
  const requestQueue = ref([])
  
  // 显示全局加载
  const showLoading = (text = '加载中...') => {
    if (loadingInstance.value) {
      loadingInstance.value.close()
    }
    loadingInstance.value = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.7)'
    })
    loading.value = true
  }
  
  // 隐藏全局加载
  const hideLoading = () => {
    if (loadingInstance.value) {
      loadingInstance.value.close()
      loadingInstance.value = null
    }
    loading.value = false
  }
  
  // 设置错误
  const setError = (err) => {
    error.value = err
    console.error('API错误:', err)
  }
  
  // 清除错误
  const clearError = () => {
    error.value = null
  }
  
  // 添加请求到队列
  const addToQueue = (config) => {
    const id = Date.now().toString()
    requestQueue.value.push({
      id,
      config,
      timestamp: Date.now()
    })
    return id
  }
  
  // 从队列移除请求
  const removeFromQueue = (id) => {
    const index = requestQueue.value.findIndex(req => req.id === id)
    if (index !== -1) {
      requestQueue.value.splice(index, 1)
    }
  }
  
  // 取消所有请求
  const cancelAllRequests = () => {
    requestQueue.value.forEach(req => {
      if (req.config.cancelToken) {
        req.config.cancelToken.cancel('请求已取消')
      }
    })
    requestQueue.value = []
    hideLoading()
  }
  
  return {
    loading,
    error,
    requestQueue,
    showLoading,
    hideLoading,
    setError,
    clearError,
    addToQueue,
    removeFromQueue,
    cancelAllRequests
  }
})

// API服务封装
export class ApiService {
  constructor() {
    this.apiStore = useApiStore()
  }
  
  // 通用请求方法
  async request(config, options = {}) {
    const { 
      showLoading = false, 
      loadingText = '加载中...',
      showError = true,
      silent = false
    } = options
    
    try {
      // 显示加载状态
      if (showLoading && !silent) {
        this.apiStore.showLoading(loadingText)
      }
      
      // 清除之前的错误
      this.apiStore.clearError()
      
      // 执行请求
      const response = await api(config)
      
      // 隐藏加载状态
      if (showLoading) {
        this.apiStore.hideLoading()
      }
      
      return response
    } catch (error) {
      // 隐藏加载状态
      if (showLoading) {
        this.apiStore.hideLoading()
      }
      
      // 设置错误状态
      this.apiStore.setError(error)
      
      // 显示错误消息
      if (showError && !silent) {
        this.handleErrorMessage(error)
      }
      
      throw error
    }
  }
  
  // 处理错误消息
  handleErrorMessage(error) {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    
    switch (status) {
      case 400:
        ElMessage.error(`请求参数错误: ${message}`)
        break
      case 401:
        ElMessage.error('认证失败，请重新登录')
        // 清除token并跳转到登录页
        localStorage.removeItem('token')
        window.location.href = '/login'
        break
      case 403:
        ElMessage.error('权限不足')
        break
      case 404:
        ElMessage.error('请求的资源不存在')
        break
      case 422:
        // 表单验证错误
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors
          const errorMessages = Object.values(errors).flat()
          ElMessage.error(errorMessages.join(', '))
        } else {
          ElMessage.error(`数据验证失败: ${message}`)
        }
        break
      case 429:
        ElMessage.error('请求过于频繁，请稍后再试')
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
      case 504:
        ElMessage.error('网关超时')
        break
      default:
        if (error.code === 'ECONNABORTED') {
          ElMessage.error('请求超时，请检查网络连接')
        } else if (error.code === 'NETWORK_ERROR') {
          ElMessage.error('网络错误，请检查网络连接')
        } else if (error.message === 'canceled') {
          // 请求被取消，不显示错误
          return
        } else {
          ElMessage.error(`请求失败: ${message}`)
        }
    }
  }
  
  // GET请求
  get(url, params = {}, options = {}) {
    return this.request({
      method: 'get',
      url,
      params
    }, options)
  }
  
  // POST请求
  post(url, data = {}, options = {}) {
    return this.request({
      method: 'post',
      url,
      data
    }, options)
  }
  
  // PUT请求
  put(url, data = {}, options = {}) {
    return this.request({
      method: 'put',
      url,
      data
    }, options)
  }
  
  // DELETE请求
  delete(url, options = {}) {
    return this.request({
      method: 'delete',
      url
    }, options)
  }
  
  // PATCH请求
  patch(url, data = {}, options = {}) {
    return this.request({
      method: 'patch',
      url,
      data
    }, options)
  }
  
  // 文件上传
  upload(url, formData, options = {}) {
    return this.request({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }, options)
  }
  
  // 文件下载
  download(url, params = {}, filename = '', options = {}) {
    return this.request({
      method: 'get',
      url,
      params,
      responseType: 'blob'
    }, options).then(response => {
      // 创建下载链接
      const blob = new Blob([response])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return response
    })
  }
}

// 创建API服务实例
export const apiService = new ApiService()

// 导出默认API实例
export default api