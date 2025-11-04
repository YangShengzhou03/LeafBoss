import { apiService } from './service'
import { useCardStore } from '@/stores/card'
import { useProductStore } from '@/stores/product'
import { useNotificationStore } from '@/stores/notification'

// 卡密API服务
export const cardService = {
  // 获取卡密列表
  async getCards(params = {}) {
    const cardStore = useCardStore()
    cardStore.setLoading(true)
    
    try {
      const response = await apiService.get('/cards', params, {
        showLoading: true,
        loadingText: '加载卡密列表...'
      })
      
      cardStore.setCards(response.data || [])
      cardStore.setPagination({
        currentPage: response.current_page || 1,
        pageSize: response.per_page || 20,
        total: response.total || 0
      })
      
      return response
    } catch (error) {
      const notificationStore = useNotificationStore()
      notificationStore.error('加载卡密列表失败')
      throw error
    } finally {
      cardStore.setLoading(false)
    }
  },
  
  // 获取卡密统计
  async getCardStats() {
    const cardStore = useCardStore()
    
    try {
      const response = await apiService.get('/cards/stats', {}, {
        cache: true
      })
      
      cardStore.setCardStats(response.data || {})
      return response
    } catch (error) {
      console.error('获取卡密统计失败:', error)
      // 不显示错误，因为这是后台数据
      throw error
    }
  },
  
  // 添加卡密
  async addCard(data) {
    const cardStore = useCardStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/cards', data, {
        showLoading: true,
        loadingText: '添加卡密中...'
      })
      
      notificationStore.success('卡密添加成功')
      return response
    } catch (error) {
      notificationStore.error('添加卡密失败')
      throw error
    }
  },
  
  // 批量添加卡密
  async batchAddCards(data) {
    const cardStore = useCardStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/cards/batch', data, {
        showLoading: true,
        loadingText: '批量添加卡密中...'
      })
      
      notificationStore.success(`成功添加 ${response.count || 0} 个卡密`)
      return response
    } catch (error) {
      notificationStore.error('批量添加卡密失败')
      throw error
    }
  },
  
  // 更新卡密
  async updateCard(id, data) {
    const cardStore = useCardStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.put(`/cards/${id}`, data, {
        showLoading: true,
        loadingText: '更新卡密中...'
      })
      
      cardStore.updateCard(id, response.data)
      notificationStore.success('卡密更新成功')
      return response
    } catch (error) {
      notificationStore.error('更新卡密失败')
      throw error
    }
  },
  
  // 删除卡密
  async deleteCard(id) {
    const cardStore = useCardStore()
    const notificationStore = useNotificationStore()
    
    try {
      await apiService.delete(`/cards/${id}`, {
        showLoading: true,
        loadingText: '删除卡密中...'
      })
      
      cardStore.deleteCard(id)
      notificationStore.success('卡密删除成功')
    } catch (error) {
      notificationStore.error('删除卡密失败')
      throw error
    }
  },
  
  // 批量删除卡密
  async batchDeleteCards(ids) {
    const cardStore = useCardStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/cards/batch-delete', { ids }, {
        showLoading: true,
        loadingText: '批量删除卡密中...'
      })
      
      // 从状态中移除已删除的卡密
      ids.forEach(id => cardStore.deleteCard(id))
      
      notificationStore.success(`成功删除 ${response.count || ids.length} 个卡密`)
      return response
    } catch (error) {
      notificationStore.error('批量删除卡密失败')
      throw error
    }
  },
  
  // 验证卡密
  async validateCard(cardKey) {
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/cards/validate', { cardKey }, {
        showLoading: true,
        loadingText: '验证卡密中...'
      })
      
      notificationStore.success('卡密验证成功')
      return response
    } catch (error) {
      notificationStore.error('卡密验证失败')
      throw error
    }
  },
  
  // 导出卡密
  async exportCards(params = {}) {
    const notificationStore = useNotificationStore()
    
    try {
      await apiService.download('/cards/export', params, 'cards.xlsx', {
        showLoading: true,
        loadingText: '导出卡密中...'
      })
      
      notificationStore.success('卡密导出成功')
    } catch (error) {
      notificationStore.error('导出卡密失败')
      throw error
    }
  }
}

// 商品API服务
export const productService = {
  // 获取商品列表
  async getGoods(params = {}) {
    const productStore = useProductStore()
    productStore.setLoading(true)
    
    try {
      const response = await apiService.get('/goods', params, {
        showLoading: true,
        loadingText: '加载商品列表...'
      })
      
      productStore.setGoods(response.data || [])
      productStore.setPagination({
        currentPage: response.current_page || 1,
        pageSize: response.per_page || 10,
        total: response.total || 0
      })
      
      return response
    } catch (error) {
      const notificationStore = useNotificationStore()
      notificationStore.error('加载商品列表失败')
      throw error
    } finally {
      productStore.setLoading(false)
    }
  },
  
  // 添加商品
  async addGood(data) {
    const productStore = useProductStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/goods', data, {
        showLoading: true,
        loadingText: '添加商品中...'
      })
      
      productStore.addGood(response.data)
      notificationStore.success('商品添加成功')
      return response
    } catch (error) {
      notificationStore.error('添加商品失败')
      throw error
    }
  },
  
  // 更新商品
  async updateGood(id, data) {
    const productStore = useProductStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.put(`/goods/${id}`, data, {
        showLoading: true,
        loadingText: '更新商品中...'
      })
      
      productStore.updateGood(id, response.data)
      notificationStore.success('商品更新成功')
      return response
    } catch (error) {
      notificationStore.error('更新商品失败')
      throw error
    }
  },
  
  // 删除商品
  async deleteGood(id) {
    const productStore = useProductStore()
    const notificationStore = useNotificationStore()
    
    try {
      await apiService.delete(`/goods/${id}`, {
        showLoading: true,
        loadingText: '删除商品中...'
      })
      
      productStore.deleteGood(id)
      notificationStore.success('商品删除成功')
    } catch (error) {
      notificationStore.error('删除商品失败')
      throw error
    }
  },
  
  // 获取规格列表
  async getSpecifications(params = {}) {
    const productStore = useProductStore()
    
    try {
      const response = await apiService.get('/specifications', params, {
        cache: true
      })
      
      productStore.setSpecifications(response.data || [])
      return response
    } catch (error) {
      const notificationStore = useNotificationStore()
      notificationStore.error('加载规格列表失败')
      throw error
    }
  },
  
  // 添加规格
  async addSpecification(data) {
    const productStore = useProductStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/specifications', data, {
        showLoading: true,
        loadingText: '添加规格中...'
      })
      
      productStore.addSpecification(response.data)
      notificationStore.success('规格添加成功')
      return response
    } catch (error) {
      notificationStore.error('添加规格失败')
      throw error
    }
  },
  
  // 更新规格
  async updateSpecification(id, data) {
    const productStore = useProductStore()
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.put(`/specifications/${id}`, data, {
        showLoading: true,
        loadingText: '更新规格中...'
      })
      
      productStore.updateSpecification(id, response.data)
      notificationStore.success('规格更新成功')
      return response
    } catch (error) {
      notificationStore.error('更新规格失败')
      throw error
    }
  },
  
  // 删除规格
  async deleteSpecification(id) {
    const productStore = useProductStore()
    const notificationStore = useNotificationStore()
    
    try {
      await apiService.delete(`/specifications/${id}`, {
        showLoading: true,
        loadingText: '删除规格中...'
      })
      
      productStore.deleteSpecification(id)
      notificationStore.success('规格删除成功')
    } catch (error) {
      notificationStore.error('删除规格失败')
      throw error
    }
  }
}

// 用户API服务
export const userService = {
  // 获取用户列表
  async getUsers(params = {}) {
    try {
      const response = await apiService.get('/users', params, {
        showLoading: true,
        loadingText: '加载用户列表...'
      })
      
      return response
    } catch (error) {
      const notificationStore = useNotificationStore()
      notificationStore.error('加载用户列表失败')
      throw error
    }
  },
  
  // 添加用户
  async addUser(data) {
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/users', data, {
        showLoading: true,
        loadingText: '添加用户中...'
      })
      
      notificationStore.success('用户添加成功')
      return response
    } catch (error) {
      notificationStore.error('添加用户失败')
      throw error
    }
  },
  
  // 更新用户
  async updateUser(id, data) {
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.put(`/users/${id}`, data, {
        showLoading: true,
        loadingText: '更新用户中...'
      })
      
      notificationStore.success('用户更新成功')
      return response
    } catch (error) {
      notificationStore.error('更新用户失败')
      throw error
    }
  },
  
  // 删除用户
  async deleteUser(id) {
    const notificationStore = useNotificationStore()
    
    try {
      await apiService.delete(`/users/${id}`, {
        showLoading: true,
        loadingText: '删除用户中...'
      })
      
      notificationStore.success('用户删除成功')
    } catch (error) {
      notificationStore.error('删除用户失败')
      throw error
    }
  },
  
  // 切换用户状态
  async toggleUserStatus(id, status) {
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.patch(`/users/${id}/status`, { status }, {
        showLoading: true,
        loadingText: '更新用户状态中...'
      })
      
      notificationStore.success(`用户已${status ? '启用' : '禁用'}`)
      return response
    } catch (error) {
      notificationStore.error('更新用户状态失败')
      throw error
    }
  }
}

// 认证API服务
export const authService = {
  // 登录
  async login(credentials) {
    const notificationStore = useNotificationStore()
    
    try {
      const response = await apiService.post('/auth/login', credentials, {
        showLoading: true,
        loadingText: '登录中...'
      })
      
      notificationStore.success('登录成功')
      return response
    } catch (error) {
      notificationStore.error('登录失败，请检查用户名和密码')
      throw error
    }
  },
  
  // 登出
  async logout() {
    const notificationStore = useNotificationStore()
    
    try {
      await apiService.post('/auth/logout')
      notificationStore.success('已退出登录')
    } catch (error) {
      // 即使登出接口失败，也要清除本地状态
      console.error('登出接口调用失败:', error)
    }
  },
  
  // 刷新token
  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh')
      return response
    } catch (error) {
      console.error('刷新token失败:', error)
      throw error
    }
  },
  
  // 获取用户信息
  async getUserInfo() {
    try {
      const response = await apiService.get('/auth/user')
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }
}

// 统计API服务
export const statsService = {
  // 获取仪表板统计数据
  async getDashboardStats() {
    try {
      const response = await apiService.get('/stats/dashboard', {}, {
        cache: true
      })
      
      return response
    } catch (error) {
      console.error('获取仪表板统计数据失败:', error)
      throw error
    }
  },
  
  // 获取图表数据
  async getChartData(type, params = {}) {
    try {
      const response = await apiService.get(`/stats/charts/${type}`, params, {
        cache: true
      })
      
      return response
    } catch (error) {
      console.error(`获取${type}图表数据失败:`, error)
      throw error
    }
  }
}