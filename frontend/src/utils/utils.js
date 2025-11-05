// 工具函数集合

// 检查用户是否已登录
export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

// 保存token到localStorage
export function saveToken(token) {
  localStorage.setItem('token', token)
}

// 从localStorage移除token
export function removeToken() {
  localStorage.removeItem('token')
}

// 获取token
export function getToken() {
  return localStorage.getItem('token')
}

// 格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 解析JWT token
export function parseJWT(token) {
  try {
    // 检查token格式
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      console.warn('无效的token格式');
      return {};
    }
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 处理base64解码
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    
    // 检查token是否过期 - 使用UTC时间进行比较，避免时区差异
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('Token已过期');
      removeToken(); // 自动清除过期token
      return {};
    }
    
    return payload;
  } catch (error) {
    console.error('JWT解析错误:', error);
    removeToken(); // 解析失败时清除无效token
    return {};
  }
}

// 保存登录凭据到localStorage
export function saveCredentials(username, password) {
  const credentials = {
    username: username,
    password: password,
    timestamp: Date.now()
  }
  localStorage.setItem('rememberedCredentials', JSON.stringify(credentials))
}

// 获取保存的登录凭据
export function getCredentials() {
  const saved = localStorage.getItem('rememberedCredentials')
  if (saved) {
    const credentials = JSON.parse(saved)
    // 检查凭据是否在7天内保存的
    if (Date.now() - credentials.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return credentials
    } else {
      // 超过7天，清除凭据
      removeCredentials()
    }
  }
  return null
}

// 清除保存的登录凭据
export function removeCredentials() {
  localStorage.removeItem('rememberedCredentials')
}

// 防抖函数
export function debounce(func, wait, immediate) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// 节流函数
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 深拷贝函数
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// 验证邮箱格式
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证手机号格式
export function isValidPhone(phone) {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 生成随机字符串
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 格式化日期
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 计算相对时间
export function getRelativeTime(date) {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

// 检查网络连接状态
export function checkNetworkStatus() {
  return new Promise((resolve) => {
    if (navigator.onLine === false) {
      resolve(false)
      return
    }
    
    // 尝试请求一个小的资源来确认网络连接
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = 'https://www.google.com/favicon.ico?t=' + Date.now()
    
    // 设置超时
    setTimeout(() => resolve(false), 3000)
  })
}

// 网络状态监听器
export function setupNetworkListener(callback) {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      callback(true)
    })
    
    window.addEventListener('offline', () => {
      callback(false)
    })
  }
}

// 重试机制
export async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error
      }
      
      // 检查是否是网络错误
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        // 等待一段时间后重试
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        // 非网络错误，直接抛出
        throw error
      }
    }
  }
}