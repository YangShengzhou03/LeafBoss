import { ElMessage, ElNotification } from 'element-plus'
import type { App } from 'vue'

// 错误类型定义
export interface AppError {
  code: string | number
  message: string
  details?: any
  timestamp: number
}

// 错误代码映射
const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const

// 错误处理器类
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorListeners: Array<(error: AppError) => void> = []

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // 注册错误监听器
  public onError(listener: (error: AppError) => void): void {
    this.errorListeners.push(listener)
  }

  // 移除错误监听器
  public offError(listener: (error: AppError) => void): void {
    const index = this.errorListeners.indexOf(listener)
    if (index > -1) {
      this.errorListeners.splice(index, 1)
    }
  }

  // 处理错误
  public handleError(error: any, context?: string): AppError {
    const appError = this.normalizeError(error, context)
    
    // 通知所有监听器
    this.errorListeners.forEach(listener => {
      try {
        listener(appError)
      } catch (e) {
        console.error('Error listener failed:', e)
      }
    })

    // 根据错误类型显示不同的用户提示
    this.showUserNotification(appError)

    // 开发环境下记录详细错误信息
    if (import.meta.env.DEV) {
      console.error('Error handled:', appError)
    }

    return appError
  }

  // 标准化错误信息
  private normalizeError(error: any, context?: string): AppError {
    let code = ERROR_CODES.UNKNOWN_ERROR
    let message = '发生未知错误'
    let details: any = null

    if (error instanceof Error) {
      message = error.message
      details = {
        stack: error.stack,
        name: error.name
      }
    } else if (typeof error === 'string') {
      message = error
    } else if (error && typeof error === 'object') {
      code = error.code || error.status || ERROR_CODES.UNKNOWN_ERROR
      message = error.message || error.msg || message
      details = error.details || error.data
    }

    // 根据错误类型进一步分类
    if (message.includes('Network Error') || message.includes('Failed to fetch')) {
      code = ERROR_CODES.NETWORK_ERROR
      message = '网络连接失败，请检查网络设置'
    } else if (error?.response?.status === 401) {
      code = ERROR_CODES.AUTH_ERROR
      message = '登录已过期，请重新登录'
    } else if (error?.response?.status === 403) {
      code = ERROR_CODES.AUTH_ERROR
      message = '权限不足，无法访问该资源'
    } else if (error?.response?.status === 404) {
      code = ERROR_CODES.API_ERROR
      message = '请求的资源不存在'
    } else if (error?.response?.status >= 500) {
      code = ERROR_CODES.API_ERROR
      message = '服务器内部错误，请稍后重试'
    }

    return {
      code,
      message: context ? `[${context}] ${message}` : message,
      details,
      timestamp: Date.now()
    }
  }

  // 显示用户通知
  private showUserNotification(error: AppError): void {
    const { code, message } = error

    switch (code) {
      case ERROR_CODES.NETWORK_ERROR:
        ElNotification.error({
          title: '网络错误',
          message,
          duration: 5000
        })
        break

      case ERROR_CODES.AUTH_ERROR:
        ElNotification.warning({
          title: '认证错误',
          message,
          duration: 3000
        })
        // 触发登出逻辑
        this.triggerLogout()
        break

      case ERROR_CODES.API_ERROR:
        ElNotification.error({
          title: '服务错误',
          message,
          duration: 4000
        })
        break

      case ERROR_CODES.VALIDATION_ERROR:
        ElMessage.warning({
          message,
          grouping: true
        })
        break

      default:
        ElNotification.error({
          title: '系统错误',
          message,
          duration: 4000
        })
    }
  }

  // 触发登出逻辑
  private triggerLogout(): void {
    // 延迟执行，避免与当前操作冲突
    setTimeout(() => {
      const userStore = useUserStore?.()
      if (userStore?.logout) {
        userStore.logout()
      }
      // 跳转到登录页
      const router = useRouter?.()
      if (router) {
        router.push('/login')
      }
    }, 1000)
  }

  // 创建Vue错误处理器插件
  public install(app: App): void {
    // Vue应用级错误处理
    app.config.errorHandler = (err, instance, info) => {
      const error = this.normalizeError(err, `Vue组件: ${info}`)
      this.handleError(error)
    }

    // 全局未捕获的Promise拒绝处理
    window.addEventListener('unhandledrejection', (event) => {
      event.preventDefault()
      this.handleError(event.reason, '未处理的Promise拒绝')
    })

    // 全局错误处理
    window.addEventListener('error', (event) => {
      event.preventDefault()
      this.handleError(event.error, '全局错误')
    })
  }
}

// 全局错误处理器实例
export const errorHandler = ErrorHandler.getInstance()

// 错误边界组件（用于React式错误捕获）
export const withErrorBoundary = (component: any, fallback?: any) => {
  return {
    ...component,
    errorCaptured(error: any, instance: any, info: string) {
      errorHandler.handleError(error, `错误边界: ${info}`)
      return false // 阻止错误继续向上传播
    }
  }
}

// 工具函数：安全执行异步操作
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: AppError }> => {
  try {
    const data = await operation()
    return { data }
  } catch (error) {
    const appError = errorHandler.handleError(error, context)
    return { error: appError }
  }
}

// 工具函数：重试机制
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }
  
  throw lastError
}