// DOM操作工具函数

/**
 * DOM操作工具类
 */
export class DOMUtil {
  /**
   * 获取元素
   */
  static getElement(selector: string): HTMLElement | null {
    return document.querySelector(selector)
  }

  /**
   * 获取元素列表
   */
  static getElements(selector: string): NodeListOf<HTMLElement> {
    return document.querySelectorAll(selector)
  }

  /**
   * 创建元素
   */
  static createElement(tag: string, attributes: Record<string, string> = {}, content: string = ''): HTMLElement {
    const element = document.createElement(tag)
    
    Object.keys(attributes).forEach(key => {
      element.setAttribute(key, attributes[key])
    })
    
    if (content) {
      element.innerHTML = content
    }
    
    return element
  }

  /**
   * 添加类名
   */
  static addClass(element: HTMLElement, className: string): void {
    element.classList.add(className)
  }

  /**
   * 移除类名
   */
  static removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className)
  }

  /**
   * 切换类名
   */
  static toggleClass(element: HTMLElement, className: string): void {
    element.classList.toggle(className)
  }

  /**
   * 检查是否包含类名
   */
  static hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className)
  }

  /**
   * 设置样式
   */
  static setStyle(element: HTMLElement, styles: Record<string, string>): void {
    Object.keys(styles).forEach(key => {
      element.style.setProperty(key, styles[key])
    })
  }

  /**
   * 获取样式
   */
  static getStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element).getPropertyValue(property)
  }

  /**
   * 显示元素
   */
  static show(element: HTMLElement, display: string = 'block'): void {
    element.style.display = display
  }

  /**
   * 隐藏元素
   */
  static hide(element: HTMLElement): void {
    element.style.display = 'none'
  }

  /**
   * 检查元素是否可见
   */
  static isVisible(element: HTMLElement): boolean {
    return element.offsetWidth > 0 && element.offsetHeight > 0 && element.style.display !== 'none'
  }

  /**
   * 获取元素位置
   */
  static getPosition(element: HTMLElement): { top: number; left: number; width: number; height: number } {
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
      width: rect.width,
      height: rect.height
    }
  }

  /**
   * 滚动到元素
   */
  static scrollTo(element: HTMLElement, options: ScrollToOptions = {}): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    })
  }

  /**
   * 监听元素大小变化
   */
  static observeResize(element: HTMLElement, callback: (entries: ResizeObserverEntry[]) => void): ResizeObserver {
    const observer = new ResizeObserver(callback)
    observer.observe(element)
    return observer
  }

  /**
   * 监听元素进入视口
   */
  static observeIntersection(
    element: HTMLElement, 
    callback: (entries: IntersectionObserverEntry[]) => void, 
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      ...options
    })
    observer.observe(element)
    return observer
  }

  /**
   * 防抖函数
   */
  static debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  /**
   * 节流函数
   */
  static throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * 复制文本到剪贴板
   */
  static copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      
      try {
        document.execCommand('copy')
        return Promise.resolve()
      } catch (err) {
        return Promise.reject(err)
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }

  /**
   * 获取滚动位置
   */
  static getScrollPosition(): { x: number; y: number } {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    }
  }

  /**
   * 设置滚动位置
   */
  static setScrollPosition(x: number, y: number): void {
    window.scrollTo(x, y)
  }

  /**
   * 检查是否在视口内
   */
  static isInViewport(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  /**
   * 获取视口尺寸
   */
  static getViewportSize(): { width: number; height: number } {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    }
  }

  /**
   * 阻止事件冒泡
   */
  static stopPropagation(event: Event): void {
    event.stopPropagation()
  }

  /**
   * 阻止默认行为
   */
  static preventDefault(event: Event): void {
    event.preventDefault()
  }

  /**
   * 添加事件监听器（支持一次性监听）
   */
  static on(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions | boolean
  ): void {
    element.addEventListener(event, handler, options)
  }

  /**
   * 移除事件监听器
   */
  static off(
    element: HTMLElement | Window | Document,
    event: string,
    handler: EventListener,
    options?: EventListenerOptions | boolean
  ): void {
    element.removeEventListener(event, handler, options)
  }

  /**
   * 触发自定义事件
   */
  static triggerEvent(element: HTMLElement, eventName: string, detail?: any): void {
    const event = new CustomEvent(eventName, { detail })
    element.dispatchEvent(event)
  }
}

/**
 * 动画工具类
 */
export class AnimationUtil {
  /**
   * 淡入动画
   */
  static fadeIn(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.opacity = '0'
      element.style.display = 'block'
      
      let start: number | null = null
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        const opacity = Math.min(progress / duration, 1)
        
        element.style.opacity = opacity.toString()
        
        if (progress < duration) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      
      requestAnimationFrame(animate)
    })
  }

  /**
   * 淡出动画
   */
  static fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      let start: number | null = null
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        const opacity = Math.max(1 - progress / duration, 0)
        
        element.style.opacity = opacity.toString()
        
        if (progress < duration) {
          requestAnimationFrame(animate)
        } else {
          element.style.display = 'none'
          resolve()
        }
      }
      
      requestAnimationFrame(animate)
    })
  }

  /**
   * 滑动显示
   */
  static slideDown(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.display = 'block'
      const height = element.scrollHeight
      element.style.height = '0px'
      element.style.overflow = 'hidden'
      
      let start: number | null = null
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        const currentHeight = Math.min((progress / duration) * height, height)
        
        element.style.height = `${currentHeight}px`
        
        if (progress < duration) {
          requestAnimationFrame(animate)
        } else {
          element.style.height = ''
          element.style.overflow = ''
          resolve()
        }
      }
      
      requestAnimationFrame(animate)
    })
  }

  /**
   * 滑动隐藏
   */
  static slideUp(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      const height = element.scrollHeight
      element.style.height = `${height}px`
      element.style.overflow = 'hidden'
      
      let start: number | null = null
      
      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        const currentHeight = Math.max(height - (progress / duration) * height, 0)
        
        element.style.height = `${currentHeight}px`
        
        if (progress < duration) {
          requestAnimationFrame(animate)
        } else {
          element.style.display = 'none'
          element.style.height = ''
          element.style.overflow = ''
          resolve()
        }
      }
      
      requestAnimationFrame(animate)
    })
  }
}

export default DOMUtil