// 模拟数据服务
// 当后端API不可用时，提供模拟数据以保持前端功能可用

/**
 * 生成随机日期
 * @param {number} daysAgo 多少天前
 * @returns {string} 格式化的日期字符串
 */
const generateRandomDate = (daysAgo = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toLocaleString('zh-CN')
}

/**
 * 生成随机存储大小（字节）
 * @param {number} maxGB 最大GB数
 * @returns {number} 字节数
 */
const generateRandomStorage = (maxGB = 10) => {
  return Math.floor(Math.random() * maxGB * 1024 * 1024 * 1024)
}

/**
 * 获取仪表板模拟数据
 * @returns {Object} 仪表板统计数据
 */
export const getDashboardStats = () => {
  return {
    userCount: Math.floor(Math.random() * 100) + 10,
    fileCount: Math.floor(Math.random() * 500) + 50,
    usedStorage: generateRandomStorage(50),
    shareCount: Math.floor(Math.random() * 50) + 5,
    uptime: '2天 14小时 32分钟'
  }
}

/**
 * 获取用户列表模拟数据
 * @param {number} page 页码
 * @param {number} size 每页大小
 * @returns {Object} 用户列表数据
 */
export const getUserList = (page = 0, size = 20) => {
  const users = [
    {
      id: 'admin-001',
      email: 'admin@example.com',
      avatar: null,
      gender: 'NOT_SET',
      phone: '13800138000',
      role: 'admin',
      storageQuota: 10737418240, // 10GB
      storageUsed: generateRandomStorage(5),
      status: 'active',
      lastLoginTime: generateRandomDate(0),
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'user-001',
      email: 'user@example.com',
      avatar: null,
      gender: 'MALE',
      phone: '13900139000',
      role: 'user',
      storageQuota: 1073741824, // 1GB
      storageUsed: generateRandomStorage(1),
      status: 'active',
      lastLoginTime: generateRandomDate(1),
      createdAt: '2023-06-15 00:00:00'
    },
    {
      id: 'user-002',
      email: 'test@example.com',
      avatar: null,
      gender: 'FEMALE',
      phone: '13700137000',
      role: 'user',
      storageQuota: 2147483648, // 2GB
      storageUsed: generateRandomStorage(2),
      status: 'active',
      lastLoginTime: generateRandomDate(2),
      createdAt: '2023-08-20 00:00:00'
    }
  ]

  // 模拟分页
  const startIndex = page * size
  const endIndex = startIndex + size
  const content = users.slice(startIndex, endIndex)

  return {
    content,
    totalElements: users.length,
    totalPages: Math.ceil(users.length / size),
    size,
    number: page
  }
}

/**
 * 获取日志列表模拟数据
 * @param {number} page 页码
 * @param {number} size 每页大小
 * @returns {Object} 日志列表数据
 */
export const getLogList = (page = 0, size = 20) => {
  const logs = [
    {
      id: 1,
      operationType: 'LOGIN',
      description: '管理员登录系统',
      ipAddress: '192.168.1.100',
      createTime: generateRandomDate(0),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      operationType: 'CARD_KEY_GENERATE',
      description: '生成卡密: 10张VIP会员卡密',
      ipAddress: '192.168.1.101',
      createTime: generateRandomDate(1),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 3,
      operationType: 'CARD_KEY_VERIFY',
      description: '验证卡密: VIP会员卡密验证成功',
      ipAddress: '192.168.1.102',
      createTime: generateRandomDate(2),
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 4,
      operationType: 'CARD_KEY_EDIT',
      description: '编辑卡密: 修改卡密状态为已使用',
      ipAddress: '192.168.1.103',
      createTime: generateRandomDate(3),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 5,
      operationType: 'CARD_KEY_DELETE',
      description: '删除卡密: 删除过期的测试卡密',
      ipAddress: '192.168.1.104',
      createTime: generateRandomDate(4),
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    },
    {
      id: 6,
      operationType: 'CARD_KEY_EXPORT',
      description: '导出卡密: 导出VIP会员卡密列表',
      ipAddress: '192.168.1.105',
      createTime: generateRandomDate(5),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 7,
      operationType: 'PRODUCT_MANAGE',
      description: '商品管理: 添加新商品"VIP会员套餐"',
      ipAddress: '192.168.1.106',
      createTime: generateRandomDate(6),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 8,
      operationType: 'SPEC_MANAGE',
      description: '规格管理: 编辑商品规格信息',
      ipAddress: '192.168.1.107',
      createTime: generateRandomDate(7),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 9,
      operationType: 'SYSTEM_SETTING',
      description: '系统设置: 更新系统配置参数',
      ipAddress: '192.168.1.108',
      createTime: generateRandomDate(8),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 10,
      operationType: 'CLEAR_LOGS',
      description: '清空日志: 清理30天前的操作日志',
      ipAddress: '192.168.1.109',
      createTime: generateRandomDate(9),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ]

  // 模拟分页
  const startIndex = page * size
  const endIndex = startIndex + size
  const content = logs.slice(startIndex, endIndex)

  return {
    content,
    totalElements: logs.length,
    totalPages: Math.ceil(logs.length / size),
    size,
    number: page
  }
}

/**
 * 获取系统配置模拟数据
 * @returns {Object} 系统配置数据
 */
export const getSystemConfig = () => {
  return {
    maxFileSize: 5120, // MB (5GB)
    appName: 'LeafCard枫叶卡管系统',
    apiVersion: 'v1',
    allowRegistration: true,
    defaultUserQuota: 1073741824, // 1GB
    adminEmail: 'admin@example.com',
    systemVersion: '1.0.0'
  }
}

export default {
  getDashboardStats,
  getUserList,
  getLogList,
  getSystemConfig
}