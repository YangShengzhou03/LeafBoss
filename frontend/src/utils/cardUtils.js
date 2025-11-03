/**
 * 卡密工具类 - 现代化优化版本
 * 采用ES6+语法，增强性能和安全性
 */

/**
 * 生成安全的卡密ID（使用Crypto API增强安全性）
 * @param {string} prefix - 卡密前缀
 * @param {number} index - 序号
 * @returns {string} 卡密ID
 */
export const generateCardId = (prefix = 'CARD', index = 1) => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  // 使用更安全的随机数生成
  const randomSuffix = crypto.getRandomValues(new Uint32Array(1))[0]
    .toString(36)
    .substring(0, 6)
    .toUpperCase()
  return `${prefix}-${timestamp}-${String(index).padStart(3, '0')}-${randomSuffix}`
}

/**
 * 批量生成卡密（性能优化版本）
 * @param {string} specType - 规格类型
 * @param {number} quantity - 数量
 * @param {Object} options - 选项
 * @returns {Array} 卡密数组
 */
export const generateCardsBatch = (specType, quantity, options = {}) => {
  const {
    prefix = 'CARD',
    categoryName = '软件服务',
    goodsName = '办公软件'
  } = options
  
  const specNameMap = new Map([
    ['month', '月卡'],
    ['quarter', '季卡'], 
    ['year', '年卡']
  ])
  
  // 使用Array.from和map进行性能优化
  return Array.from({ length: quantity }, (_, i) => ({
    id: generateCardId(prefix, i + 1),
    specType,
    responseNumber: 0,
    status: 'unused',
    createdAt: new Date().toLocaleString('zh-CN'),
    categoryName,
    goodsName,
    specName: specNameMap.get(specType) || specType
  }))
}

/**
 * 验证卡密格式
 * @param {string} cardId - 卡密ID
 * @returns {boolean} 是否有效
 */
export const validateCardFormat = (cardId) => {
  if (!cardId || typeof cardId !== 'string') return false
  
  // 卡密格式验证: CARD-20240115-001-ABC123
  const pattern = /^[A-Z]{3,10}-\d{8}-\d{3}-[A-Z0-9]{6}$/
  return pattern.test(cardId)
}

/**
 * 现代化卡密状态管理器（使用WeakMap和Proxy）
 */
export class CardStatusManager {
  constructor() {
    this.statusMap = new Map()
    this.observers = new Set()
  }
  
  /**
   * 设置卡密状态（支持批量操作）
   * @param {string|Array} cardIds - 卡密ID或ID数组
   * @param {string} status - 状态
   */
  setStatus(cardIds, status) {
    const ids = Array.isArray(cardIds) ? cardIds : [cardIds]
    
    ids.forEach(cardId => {
      if (validateCardFormat(cardId)) {
        const oldStatus = this.statusMap.get(cardId)?.status
        this.statusMap.set(cardId, {
          status,
          updatedAt: new Date().toISOString()
        })
        
        // 通知观察者状态变化
        if (oldStatus !== status) {
          this.notifyObservers(cardId, status, oldStatus)
        }
      }
    })
  }
  
  /**
   * 获取卡密状态（支持批量获取）
   * @param {string|Array} cardIds - 卡密ID或ID数组
   * @returns {Object|Map} 状态信息
   */
  getStatus(cardIds) {
    if (Array.isArray(cardIds)) {
      const result = new Map()
      cardIds.forEach(cardId => {
        const status = this.statusMap.get(cardId)
        if (status) result.set(cardId, status)
      })
      return result
    }
    return this.statusMap.get(cardIds) || null
  }
  
  /**
   * 订阅状态变化
   * @param {Function} callback - 回调函数
   */
  subscribe(callback) {
    this.observers.add(callback)
    return () => this.observers.delete(callback)
  }
  
  /**
   * 通知观察者
   * @param {string} cardId - 卡密ID
   * @param {string} newStatus - 新状态
   * @param {string} oldStatus - 旧状态
   */
  notifyObservers(cardId, newStatus, oldStatus) {
    this.observers.forEach(callback => {
      try {
        callback(cardId, newStatus, oldStatus)
      } catch (error) {
        console.error('状态观察者回调错误:', error)
      }
    })
  }
  
  /**
   * 智能清理过期状态
   */
  cleanupExpiredStatus() {
    const now = Date.now()
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000
    
    for (const [cardId, statusInfo] of this.statusMap.entries()) {
      if (new Date(statusInfo.updatedAt).getTime() < twentyFourHoursAgo) {
        this.statusMap.delete(cardId)
      }
    }
  }
}

/**
 * 高性能卡密缓存管理器（使用LRU算法）
 */
export class CardCacheManager {
  constructor(maxSize = 1000) {
    this.cache = new Map()
    this.maxSize = maxSize
  }
  
  /**
   * 添加卡密到缓存
   * @param {string} cardId - 卡密ID
   * @param {Object} cardData - 卡密数据
   */
  set(cardId, cardData) {
    // 如果缓存已满，删除最久未使用的项目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(cardId, {
      ...cardData,
      accessedAt: Date.now()
    })
  }
  
  /**
   * 从缓存获取卡密
   * @param {string} cardId - 卡密ID
   * @returns {Object|null} 卡密数据
   */
  get(cardId) {
    const cardData = this.cache.get(cardId)
    if (cardData) {
      // 更新访问时间
      cardData.accessedAt = Date.now()
      // 重新插入以更新顺序
      this.cache.delete(cardId)
      this.cache.set(cardId, cardData)
    }
    return cardData
  }
  
  /**
   * 批量获取卡密（性能优化）
   * @param {Array} cardIds - 卡密ID数组
   * @returns {Map} 卡密数据映射
   */
  batchGet(cardIds) {
    const result = new Map()
    cardIds.forEach(cardId => {
      const cardData = this.get(cardId)
      if (cardData) result.set(cardId, cardData)
    })
    return result
  }
  
  /**
   * 清理过期缓存（1小时）
   */
  cleanupExpiredCache() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    for (const [cardId, cardData] of this.cache.entries()) {
      if (cardData.accessedAt < oneHourAgo) {
        this.cache.delete(cardId)
      }
    }
  }
}

/**
 * 卡密操作日志管理器
 */
export class CardLogManager {
  constructor(maxLogs = 1000) {
    this.logs = []
    this.maxLogs = maxLogs
  }
  
  /**
   * 添加操作日志
   * @param {Object} logData - 日志数据
   */
  addLog(logData) {
    const log = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      ...logData
    }
    
    this.logs.unshift(log)
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }
    
    return log
  }
  
  /**
   * 获取日志列表
   * @param {Object} filters - 筛选条件
   * @returns {Array} 日志数组
   */
  getLogs(filters = {}) {
    let filteredLogs = this.logs
    
    if (filters.cardId) {
      filteredLogs = filteredLogs.filter(log => log.cardId === filters.cardId)
    }
    
    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action)
    }
    
    if (filters.startDate && filters.endDate) {
      filteredLogs = filteredLogs.filter(log => {
        const logTime = new Date(log.timestamp).getTime()
        return logTime >= new Date(filters.startDate).getTime() && 
               logTime <= new Date(filters.endDate).getTime()
      })
    }
    
    return filteredLogs
  }
  
  /**
   * 生成日志ID
   * @returns {string} 日志ID
   */
  generateLogId() {
    return `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// 导出单例实例
export const cardStatusManager = new CardStatusManager()
export const cardCacheManager = new CardCacheManager()
export const cardLogManager = new CardLogManager()