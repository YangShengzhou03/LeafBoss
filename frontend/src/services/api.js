import Server from '../utils/Server'

const AdminService = {
  login(data) {
    return Server.post('/api/admins/login', data)
  },

  register(data) {
    return Server.post('/api/admins', data)
  },

  getDashboardStats() {
    return Server.get('/api/admin/stats')
  },

  getUserList(params) {
    return Server.get('/api/admins', {
      page: params.page || 1,
      size: params.size || 10,
      keyword: params.keyword,
      status: params.status
    })
  },

  getLogList(params) {
    return Server.get('/api/operation-logs', {
      page: params.page || 1,
      size: params.size || 10,
      startDate: params.startDate,
      endDate: params.endDate,
      operationType: params.operationType,
      adminId: params.adminId
    })
  },

  exportLogs(params) {
    return Server.get('/api/operation-logs/export', {
      startDate: params.startDate,
      endDate: params.endDate
    }, { responseType: 'blob' })
  },

  clearLogs() {
    return Server.delete('/api/operation-logs')
  },

  getCardKeyList(params) {
    return Server.get('/api/card-keys', {
      page: params.page || 1,
      size: params.size || 10,
      status: params.status,
      specificationId: params.specificationId
    })
  },

  getCardKeyListWithDetails(params) {
    return Server.get('/api/card-keys/with-details', {
      page: params.page || 1,
      size: params.size || 10,
      keyword: params.keyword,
      specificationId: params.specificationId
    })
  },

  generateCardKey(data) {
    return Server.post('/api/card-keys', data)
  },

  toggleCardKeyStatus(cardKey, status) {
    return Server.post(`/api/card-keys/${cardKey}/status`, { status })
  },

  disableCardKey(cardKey) {
    return Server.post(`/api/card-keys/disable`, { cardKey })
  },

  deleteCardKey(cardKey) {
    return Server.delete(`/api/card-keys/by-card-key/${cardKey}`)
  },

  getProductList(params) {
    return Server.get('/api/products', {
      page: params.page || 1,
      size: params.size || 10,
      category: params.category,
      status: params.status
    })
  },

  createProduct(data) {
    return Server.post('/api/products', data)
  },

  editProduct(id, data) {
    return Server.put(`/api/products/${id}`, data)
  },

  deleteProduct(id) {
    return Server.delete(`/api/products/${id}`)
  },

  getSpecList(params) {
    return Server.get('/api/specifications', {
      page: params.page || 1,
      size: params.size || 10,
      keyword: params.keyword,
      productId: params.productId
    })
  },

  getSpecificationDTOs() {
    return Server.get('/api/specifications/dto')
  },

  createSpec(data) {
    return Server.post('/api/specifications', data)
  },

  editSpec(id, data) {
    return Server.put(`/api/specifications/${id}`, data)
  },

  deleteSpec(id) {
    return Server.delete(`/api/specifications/${id}`)
  },

  getSpecificationById(id) {
    return Server.get(`/api/specifications/${id}`)
  }
}

const UserService = {
  login(data) {
    return Server.post('/api/auth/login', data)
  },

  logout() {
    return Server.post('/api/auth/logout')
  },

  register(data) {
    return Server.post('/api/auth/register', data)
  },

  createUser(data) {
    return Server.post('/api/admins', data)
  },

  deleteUser(id) {
    return Server.delete(`/api/admins/${id}`)
  },

  updateUser(id, data) {
    return Server.put(`/api/admins/${id}`, data)
  },

  adminResetPassword(data) {
    return Server.post('/api/admins/admin-reset-password', data)
  },

  sendResetCode(data) {
    return Server.post('/api/admins/send-reset-code', data)
  },

  getUserInfo() {
    return Server.get('/api/admins/info')
  },

  getCurrentUser() {
    return Server.get('/api/auth/me')
  },

  updateUserInfo(data) {
    return Server.put('/api/admins/info', data)
  },

  changePassword(data) {
    return Server.put('/api/admins/password', data)
  },

  getStorageInfo() {
    return Server.get('/api/user/storage')
  },

  sendVerificationCode(data) {
    return Server.post('/api/verification/send', data)
  }
}

export default {
  admin: AdminService,
  user: UserService
}