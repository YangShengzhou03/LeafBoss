/**
 * 卡密工具类 - 优化卡密生成和验证算法
 */

/**
 * 生成安全的卡密ID
 * @param {string} prefix - 卡密前缀
 * @param {number} index - 序号
 * @returns {string} 卡密ID
 */
export const generateCardId = (prefix = 'CARD', index = 1) => {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${timestamp}-${String(index).padStart(3, '0')}-${randomSuffix}`
}

/**
 * 批量生成卡密
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
  
  const cards = []
  const specNameMap = {
    'month': '月卡',
    'quarter': '季卡', 
    'year': '年卡'
  }
  
  // 使用性能优化的循环
  for (let i = 1; i <= quantity; i++) {
    cards.push({
      id: generateCardId(prefix, i),
      specType: specType,
      responseNumber: 0,
      status: 'unused',
      createdAt: new Date().toLocaleString('zh-CN'),
      categoryName: categoryName,
      goodsName: goodsName,
      specName: specNameMap[specType] || specType
    })
  }
  
  return cards
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
 * 卡密状态管理
 */
export class CardStatusManager {
  constructor() {
    this.statusMap = new Map()
  }
  
  /**
   * 设置卡密状态
   * @param {string} cardId - 卡密ID
   * @param {string} status - 状态
   */
  setStatus(cardId, status) {
    if (validateCardFormat(cardId)) {
      this.statusMap.set(cardId, {
        status,
        updatedAt: new Date().toISOString()
      })
    }
  }
  
  /**
   * 获取卡密状态
   * @param {string} cardId - 卡密ID
   * @returns {Object|null} 状态信息
   */
  getStatus(cardId) {
    return this.statusMap.get(cardId) || null
  }
  
  /**
   * 批量更新状态
   * @param {Array} cardIds - 卡密ID数组
   * @param {string} status - 状态
   */
  batchUpdateStatus(cardIds, status) {
    cardIds.forEach(cardId => this.setStatus(cardId, status))
  }
  
  /**
   * 清理过期状态（24小时）
   */
  cleanupExpiredStatus() {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    for (const [cardId, statusInfo] of this.statusMap.entries()) {
      if (new Date(statusInfo.updatedAt) < twentyFourHoursAgo) {
        this.statusMap.delete(cardId)
      }
    }
  }
}

/**
 * 卡密缓存管理
 */
export class CardCacheManager {
  constructor(maxSize = 1000) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.accessQueue = []
  }
  
  /**
   * 添加卡密到缓存
   * @param {string} cardId - 卡密ID
   * @param {Object} cardData - 卡密数据
   */
  set(cardId, cardData) {
    if (this.cache.size >= this.maxSize) {
      // LRU淘汰策略
      const oldestCardId = this.accessQueue.shift()
      this.cache.delete(oldestCardId)
    }
    
    this.cache.set(cardId, {
      ...cardData,
      accessedAt: new Date().toISOString()
    })
    
    this.accessQueue.push(cardId)
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
      cardData.accessedAt = new Date().toISOString()
      
      // 更新访问队列
      const index = this.accessQueue.indexOf(cardId)
      if (index > -1) {
        this.accessQueue.splice(index, 1)
      }
      this.accessQueue.push(cardId)
    }
    
    return cardData
  }
  
  /**
   * 批量获取卡密
   * @param {Array} cardIds - 卡密ID数组
   * @returns {Map} 卡密数据映射
   */
  batchGet(cardIds) {
    const result = new Map()
    cardIds.forEach(cardId => {
      const cardData = this.get(cardId)
      if (cardData) {
        result.set(cardId, cardData)
      }
    })
    return result
  }
}

// 导出单例实例
export const cardStatusManager = new CardStatusManager()
export const cardCacheManager = new CardCacheManager()