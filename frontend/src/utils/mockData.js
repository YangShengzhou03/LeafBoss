function generateRandomDate() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  return new Date(randomTime)
}

function generateRandomStorageSize() {
  return Math.floor(Math.random() * 99) + 1
}

const mockData = {
  getDashboardStats() {
    return {
      totalUsers: 1500,
      activeUsers: 342,
      totalStorage: 1024,
      usedStorage: 256,
      todayUploads: 23,
      todayDownloads: 45
    }
  },

  getUserList(page = 1, pageSize = 10) {
    const total = 1500
    const totalPages = Math.ceil(total / pageSize)
    
    const users = Array.from({ length: pageSize }, (_, index) => {
      const id = (page - 1) * pageSize + index + 1
      return {
        id,
        username: `user${id}`,
        nickname: `用户${id}`,
        email: `user${id}@example.com`,
        role: id % 5 === 0 ? 1 : 0,
        status: id % 10 === 0 ? 0 : 1,
        createTime: generateRandomDate().toISOString(),
        lastLoginTime: generateRandomDate().toISOString(),
        storageUsed: generateRandomStorageSize(),
        storageQuota: 100
      }
    })
    
    return {
      list: users,
      total,
      page,
      pageSize,
      totalPages
    }
  },

  getLogList(page = 1, pageSize = 10) {
    const total = 500
    const totalPages = Math.ceil(total / pageSize)
    
    const logTypes = ['login', 'upload', 'download', 'delete', 'modify']
    const logLevels = ['info', 'warning', 'error']
    
    const logs = Array.from({ length: pageSize }, (_, index) => {
      const id = (page - 1) * pageSize + index + 1
      const type = logTypes[Math.floor(Math.random() * logTypes.length)]
      const level = logLevels[Math.floor(Math.random() * logLevels.length)]
      
      return {
        id,
        userId: Math.floor(Math.random() * 100) + 1,
        username: `user${Math.floor(Math.random() * 100) + 1}`,
        type,
        level,
        description: `${type}操作日志描述 ${id}`,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        createTime: generateRandomDate().toISOString()
      }
    })
    
    return {
      list: logs,
      total,
      page,
      pageSize,
      totalPages
    }
  },

  getSystemConfig() {
    return {
      siteName: 'Leaf Card',
      siteDescription: '一个简单的文件分享平台',
      maxFileSize: 100,
      allowedFileTypes: ['.jpg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
      userStorageQuota: 100,
      enableRegistration: true,
      enableEmailVerification: false,
      maintenanceMode: false
    }
  },

  getMockResponse(url, method, params) {
    if ((url.includes('/auth/login') || url.includes('/admin/login')) && method === 'POST') {
      const { username, password } = params
      if (username && password) {
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: 1,
              username: username,
              nickname: username === 'admin' ? '管理员' : '用户',
              email: `${username}@example.com`,
              role: username === 'admin' ? 1 : 0,
              avatar: 'https://picsum.photos/id/1005/200/200'
            }
          }
        }
      }
    }

    if (url.includes('/auth/register') && method === 'POST') {
      const { username, email, password } = params
      if (username && email && password) {
        return {
          code: 200,
          message: '注册成功',
          data: {
            token: 'mock-token-' + Date.now(),
            user: {
              id: Math.floor(Math.random() * 1000) + 1,
              username: username,
              nickname: username,
              email: email,
              role: 0,
              avatar: 'https://picsum.photos/id/1005/200/200'
            }
          }
        }
      }
    }

    if (url.includes('/auth/me') && method === 'GET') {
      return {
        code: 200,
        message: '获取成功',
        data: {
          id: 1,
          username: 'testuser',
          nickname: '测试用户',
          email: 'test@example.com',
          role: 0,
          avatar: 'https://picsum.photos/id/1005/200/200',
          storageInfo: {
            totalStorageGB: 10,
            usedStorageGB: 3,
            availableStorageGB: 7,
            usagePercentage: 30
          }
        }
      }
    }

    if (url.includes('/admin/dashboard') && method === 'GET') {
      return {
        code: 200,
        message: '获取成功',
        data: this.getDashboardStats()
      }
    }

    if (url.includes('/admin/users') && method === 'GET') {
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      return {
        code: 200,
        message: '获取成功',
        data: this.getUserList(page, pageSize)
      }
    }

    if (url.includes('/admin/logs') && method === 'GET') {
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      return {
        code: 200,
        message: '获取成功',
        data: this.getLogList(page, pageSize)
      }
    }

    if (url.includes('/admin/config') && method === 'GET') {
      return {
        code: 200,
        message: '获取成功',
        data: this.getSystemConfig()
      }
    }

    if (url.includes('/user/storage') && method === 'GET') {
      return {
        code: 200,
        message: '获取成功',
        data: {
          storageQuota: 10737418240,
          usedStorage: 3221225472,
          availableStorage: 7516192768,
          usagePercentage: 30
        }
      }
    }

    return {
      code: 200,
      message: '操作成功（模拟数据）',
      data: {}
    }
  }
}

export default mockData