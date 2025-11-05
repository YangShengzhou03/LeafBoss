import { ElMessage } from 'element-plus'

/**
 * 错误处理服务
 * 统一处理API调用中的错误，提供友好的错误提示
 */
export const ErrorHandler = {
  /**
   * 处理API错误
   * @param {Error} error 错误对象
   * @param {string} defaultMessage 默认错误消息
   * @param {boolean} showMessage 是否显示错误消息
   * @returns {boolean} 是否处理了错误
   */
  handleApiError(error, defaultMessage = '操作失败', showMessage = true) {
    
    // 处理错误
    let message = defaultMessage
    
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data?.message || defaultMessage
      }
    } else if (error.request) {
      message = '网络请求失败，请检查网络连接'
    } else {
      message = error.message || defaultMessage
    }
    
    if (showMessage) {
      ElMessage.error(message)
    }
    
    return true
  },
  
  /**
   * 处理文件上传错误
   * @param {Error} error 错误对象
   * @param {string} defaultMessage 默认错误消息
   */
  handleUploadError(error, defaultMessage = '文件上传失败') {
    
    let message = defaultMessage
    
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 400:
          message = '文件格式或大小不符合要求'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '权限不足，无法上传文件'
          break
        case 413:
          message = '文件大小超出限制'
          break
        case 500:
          message = '服务器处理文件时出错'
          break
        default:
          message = error.response.data?.message || defaultMessage
      }
    } else if (error.request) {
      message = '网络请求失败，请检查网络连接'
    } else {
      message = error.message || defaultMessage
    }
    
    ElMessage.error(message)
  },
  
  /**
   * 处理文件下载错误
   * @param {Error} error 错误对象
   * @param {string} defaultMessage 默认错误消息
   */
  handleDownloadError(error, defaultMessage = '文件下载失败') {
    
    let message = defaultMessage
    
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 400:
          message = '下载请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '权限不足，无法下载文件'
          break
        case 404:
          message = '文件不存在或已被删除'
          break
        case 500:
          message = '服务器处理下载请求时出错'
          break
        default:
          message = error.response.data?.message || defaultMessage
      }
    } else if (error.request) {
      message = '网络请求失败，请检查网络连接'
    } else {
      message = error.message || defaultMessage
    }
    
    ElMessage.error(message)
  },
  
  /**
   * 处理表单验证错误
   * @param {Error} error 错误对象
   * @param {string} defaultMessage 默认错误消息
   */
  handleValidationError(error, defaultMessage = '表单验证失败') {
    
    let message = defaultMessage
    
    if (error.response && error.response.data) {
      const data = error.response.data
      
      // 处理字段验证错误
      if (data.errors && typeof data.errors === 'object') {
        const errors = Object.values(data.errors).flat()
        message = errors.join(', ')
      } else if (data.message) {
        message = data.message
      }
    } else if (error.message) {
      message = error.message
    }
    
    ElMessage.error(message)
  }
}

export default ErrorHandler