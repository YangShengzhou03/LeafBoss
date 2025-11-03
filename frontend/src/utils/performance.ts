// 性能监控和优化工具函数

/**
 * 性能监控工具类
 */
export class PerformanceUtil {
  private static marks: Map<string, number> = new Map()
  private static measures: Map<string, number> = new Map()

  /**
   * 开始性能标记
   */
  static mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name)
    }
    this.marks.set(name, performance.now())
  }

  /**
   * 结束性能标记并计算耗时
   */
  static measure(name: string, startMark: string, endMark?: string): number {
    if (typeof performance !== 'undefined' && performance.measure) {
      if (endMark) {
        performance.measure(name, startMark, endMark)
      } else {
        performance.measure(name, startMark)
      }
    }

    const startTime = this.marks.get(startMark)
    const endTime = endMark ? this.marks.get(endMark) : performance.now()
    
    if (startTime && endTime) {
      const duration = endTime - startTime
      this.measures.set(name, duration)
      return duration
    }
    
    return 0
  }

  /**
   * 获取性能测量结果
   */
  static getMeasure(name: string): number | undefined {
    return this.measures.get(name)
  }

  /**
   * 清除所有性能标记
   */
  static clearMarks(): void {
    this.marks.clear()
    this.measures.clear()
    
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks()
      performance.clearMeasures()
    }
  }

  /**
   * 获取页面加载性能指标
   */
  static getNavigationTiming(): PerformanceNavigationTiming | null {
    if (typeof performance !== 'undefined') {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return navigation || null
    }
    return null
  }

  /**
   * 获取资源加载性能指标
   */
  static getResourceTimings(): PerformanceResourceTiming[] {
    if (typeof performance !== 'undefined') {
      return performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    }
    return []
  }

  /**
   * 获取FPS（帧率）
   */
  static getFPS(): Promise<number> {
    return new Promise((resolve) => {
      let frames = 0
      let startTime: number
      
      const measureFPS = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp
        }
        
        frames++
        
        if (timestamp - startTime >= 1000) {
          resolve(frames)
          return
        }
        
        requestAnimationFrame(measureFPS)
      }
      
      requestAnimationFrame(measureFPS)
    })
  }

  /**
   * 监控内存使用情况
   */
  static getMemoryInfo(): {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null {
    if ((performance as any).memory) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      }
    }
    return null
  }

  /**
   * 检查是否支持某些Web API
   */
  static checkWebSupport(): {
    serviceWorker: boolean
    webAssembly: boolean
    webGL: boolean
    webRTC: boolean
    indexedDB: boolean
    localStorage: boolean
    sessionStorage: boolean
  } {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      webAssembly: typeof WebAssembly === 'object',
      webGL: !!document.createElement('canvas').getContext('webgl'),
      webRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      indexedDB: 'indexedDB' in window,
      localStorage: 'localStorage' in window,
      sessionStorage: 'sessionStorage' in window
    }
  }
}

/**
 * 性能优化工具类
 */
export class OptimizationUtil {
  /**
   * 图片懒加载
   */
  static lazyLoadImages(selector: string = 'img[data-src]'): void {
    const images = document.querySelectorAll<HTMLImageElement>(selector)
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement
          const src = image.getAttribute('data-src')
          
          if (src) {
            image.src = src
            image.removeAttribute('data-src')
          }
          
          imageObserver.unobserve(image)
        }
      })
    })
    
    images.forEach((image) => imageObserver.observe(image))
  }

  /**
   * 防抖函数（优化版）
   */
  static debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
    immediate: boolean = false
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      const later = () => {
        timeout = null
        if (!immediate) func.apply(this, args)
      }
      
      const callNow = immediate && !timeout
      
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      
      if (callNow) func.apply(this, args)
    }
  }

  /**
   * 节流函数（优化版）
   */
  static throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let lastFunc: NodeJS.Timeout
    let lastRan: number
    
    return (...args: Parameters<T>) => {
      if (!lastRan) {
        func.apply(this, args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        }, limit - (Date.now() - lastRan))
      }
    }
  }

  /**
   * 批量DOM操作
   */
  static batchDOMUpdate(callback: () => void): void {
    // 使用requestAnimationFrame进行批量更新
    requestAnimationFrame(() => {
      callback()
    })
  }

  /**
   * 虚拟滚动优化
   */
  static virtualScroll(
    container: HTMLElement,
    itemHeight: number,
    totalItems: number,
    renderItem: (index: number) => HTMLElement
  ): void {
    let visibleStart = 0
    let visibleEnd = 0
    
    const updateVisibleItems = () => {
      const scrollTop = container.scrollTop
      const containerHeight = container.clientHeight
      
      visibleStart = Math.floor(scrollTop / itemHeight)
      visibleEnd = Math.min(visibleStart + Math.ceil(containerHeight / itemHeight) + 1, totalItems)
      
      // 清空容器
      container.innerHTML = ''
      
      // 设置容器高度以支持滚动
      container.style.height = `${totalItems * itemHeight}px`
      
      // 创建可见项目
      for (let i = visibleStart; i < visibleEnd; i++) {
        const item = renderItem(i)
        item.style.position = 'absolute'
        item.style.top = `${i * itemHeight}px`
        item.style.height = `${itemHeight}px`
        item.style.width = '100%'
        container.appendChild(item)
      }
    }
    
    container.addEventListener('scroll', OptimizationUtil.throttle(updateVisibleItems, 16))
    updateVisibleItems()
  }

  /**
   * 预加载关键资源
   */
  static preloadResources(urls: string[]): void {
    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = url.endsWith('.css') ? 'style' : url.endsWith('.js') ? 'script' : 'fetch'
      document.head.appendChild(link)
    })
  }

  /**
   * 预连接关键域名
   */
  static preconnectDomains(domains: string[]): void {
    domains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      document.head.appendChild(link)
    })
  }

  /**
   * 压缩图片
   */
  static compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        let { width, height } = img
        
        // 计算缩放比例
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Image compression failed'))
          }
        }, 'image/jpeg', quality)
      }
      
      img.onerror = () => reject(new Error('Image loading failed'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 缓存管理
   */
  static createCache<T>(maxSize: number = 100) {
    const cache = new Map<string, { value: T; timestamp: number }>()
    
    return {
      set(key: string, value: T): void {
        if (cache.size >= maxSize) {
          // 移除最旧的项
          const oldestKey = Array.from(cache.entries())
            .reduce((oldest, [key, item]) => 
              item.timestamp < cache.get(oldest)!.timestamp ? key : oldest
            )
          cache.delete(oldestKey)
        }
        
        cache.set(key, { value, timestamp: Date.now() })
      },
      
      get(key: string): T | undefined {
        const item = cache.get(key)
        if (item) {
          // 更新访问时间
          item.timestamp = Date.now()
          return item.value
        }
        return undefined
      },
      
      has(key: string): boolean {
        return cache.has(key)
      },
      
      delete(key: string): void {
        cache.delete(key)
      },
      
      clear(): void {
        cache.clear()
      },
      
      size(): number {
        return cache.size
      }
    }
  }
}

/**
 * 错误监控工具类
 */
export class ErrorMonitor {
  private static isInitialized = false

  /**
   * 初始化错误监控
   */
  static initialize(): void {
    if (this.isInitialized) return
    
    // 监听JavaScript错误
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'JavaScript Error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    })
    
    // 监听Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'Unhandled Promise Rejection',
        message: event.reason?.message || String(event.reason),
        reason: event.reason
      })
    })
    
    this.isInitialized = true
  }

  /**
   * 记录错误
   */
  private static logError(errorInfo: {
    type: string
    message: string
    filename?: string
    lineno?: number
    colno?: number
    error?: Error
    reason?: any
  }): void {
    const errorData = {
      type: errorInfo.type,
      message: errorInfo.message,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      ...errorInfo
    }
    
    // 发送到错误监控服务
    this.sendToMonitoringService(errorData)
    
    // 控制台输出（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Monitor:', errorData)
    }
  }

  /**
   * 发送错误信息到监控服务
   */
  private static sendToMonitoringService(errorData: any): void {
    // 这里可以集成第三方错误监控服务，如Sentry、Bugsnag等
    // 或者发送到自己的后端API
    
    // 示例：发送到后端API
    // fetch('/api/error-log', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // }).catch(() => {
    //   // 发送失败时的处理
    // })
  }

  /**
   * 手动记录错误
   */
  static captureError(error: Error, context?: any): void {
    this.logError({
      type: 'Manual Error Capture',
      message: error.message,
      error,
      ...context
    })
  }
}

export default PerformanceUtil