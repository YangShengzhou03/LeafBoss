// 本地存储工具函数

import { STORAGE_KEYS } from '@/constants'

/**
 * 安全的本地存储操作
 */
export class StorageUtil {
  /**
   * 设置存储项
   */
  static set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error)
    }
  }

  /**
   * 获取存储项
   */
  static get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue || null
      
      return JSON.parse(item)
    } catch (error) {
      console.error(`Storage get error for key "${key}":`, error)
      return defaultValue || null
    }
  }

  /**
   * 移除存储项
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error)
    }
  }

  /**
   * 清空所有存储项
   */
  static clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }

  /**
   * 获取存储项数量
   */
  static get length(): number {
    try {
      return localStorage.length
    } catch (error) {
      console.error('Storage length error:', error)
      return 0
    }
  }

  /**
   * 检查存储项是否存在
   */
  static has(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null
    } catch (error) {
      console.error(`Storage has error for key "${key}":`, error)
      return false
    }
  }

  /**
   * 获取所有存储键名
   */
  static keys(): string[] {
    try {
      return Object.keys(localStorage)
    } catch (error) {
      console.error('Storage keys error:', error)
      return []
    }
  }
}

/**
 * 应用特定的存储操作
 */
export const AppStorage = {
  // Token操作
  getToken(): string | null {
    return StorageUtil.get<string>(STORAGE_KEYS.TOKEN)
  },

  setToken(token: string): void {
    StorageUtil.set(STORAGE_KEYS.TOKEN, token)
  },

  removeToken(): void {
    StorageUtil.remove(STORAGE_KEYS.TOKEN)
  },

  // 用户信息操作
  getUserInfo<T = any>(): T | null {
    return StorageUtil.get<T>(STORAGE_KEYS.USER_INFO)
  },

  setUserInfo<T = any>(userInfo: T): void {
    StorageUtil.set(STORAGE_KEYS.USER_INFO, userInfo)
  },

  removeUserInfo(): void {
    StorageUtil.remove(STORAGE_KEYS.USER_INFO)
  },

  // 侧边栏状态
  getSidebarStatus(): boolean {
    return StorageUtil.get<boolean>(STORAGE_KEYS.SIDEBAR_STATUS, true)
  },

  setSidebarStatus(opened: boolean): void {
    StorageUtil.set(STORAGE_KEYS.SIDEBAR_STATUS, opened)
  },

  // 主题设置
  getTheme(): string | null {
    return StorageUtil.get<string>(STORAGE_KEYS.THEME)
  },

  setTheme(theme: string): void {
    StorageUtil.set(STORAGE_KEYS.THEME, theme)
  },

  // 语言设置
  getLanguage(): string | null {
    return StorageUtil.get<string>(STORAGE_KEYS.LANGUAGE)
  },

  setLanguage(language: string): void {
    StorageUtil.set(STORAGE_KEYS.LANGUAGE, language)
  },

  // 清空所有应用相关存储
  clearAppData(): void {
    const keys = Object.values(STORAGE_KEYS)
    keys.forEach(key => StorageUtil.remove(key))
  },
}

/**
 * 会话存储工具（临时存储）
 */
export class SessionStorageUtil {
  static set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      sessionStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`SessionStorage set error for key "${key}":`, error)
    }
  }

  static get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return defaultValue || null
      
      return JSON.parse(item)
    } catch (error) {
      console.error(`SessionStorage get error for key "${key}":`, error)
      return defaultValue || null
    }
  }

  static remove(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`SessionStorage remove error for key "${key}":`, error)
    }
  }

  static clear(): void {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('SessionStorage clear error:', error)
    }
  }
}

/**
 * Cookie操作工具
 */
export class CookieUtil {
  static set(name: string, value: string, days?: number): void {
    let expires = ''
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
      expires = '; expires=' + date.toUTCString()
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/' + '; SameSite=Lax'
  }

  static get(name: string): string | null {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  static remove(name: string): void {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + '; SameSite=Lax'
  }
}

export default StorageUtil