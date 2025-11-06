import Server from '../utils/Server'

const AdminService = {
  login(data) {
    return Server.post('/api/admins/login', data)
  },

  register(data) {
    return Server.post('/api/admins', data)
  },

  getDashboardStats() {
    return Server.get('/api/admin/dashboard')
  },

  getUserList(params) {
    return Server.get('/api/admins', { page: params.page || 1, size: params.size || 10 })
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

  getLogStats(params) {
    return Server.get('/api/operation-logs/stats', {
      startDate: params.startDate,
      endDate: params.endDate
    })
  },

  exportLogs(params) {
    return Server.get('/api/operation-logs/export', {
      startDate: params.startDate,
      endDate: params.endDate
    }, { responseType: 'blob' })
  },

  clearLogs() {
    return Server.delete('/api/operation-logs/clear')
  },

  getLogsByAdmin(adminId) {
    return Server.get(`/api/operation-logs/admin/${adminId}`)
  },

  getLogsByType(operationType) {
    return Server.get(`/api/operation-logs/type/${operationType}`)
  },

  getLogsByTarget(targetType, targetId) {
    return Server.get(`/api/operation-logs/target/${targetType}/${targetId}`)
  },

  logOperation(data) {
    return Server.post('/api/operation-logs', data)
  },

  logDetailedOperation(data) {
    return Server.post('/api/operation-logs/detailed', data)
  },

  getSystemConfig() {
    return Server.get('/api/admin/config')
  },

  updateSystemConfig(data) {
    return Server.put('/api/admin/config', data)
  },

  getCardKeyList(params) {
    return Server.get('/api/card-keys', {
      page: params.page || 1,
      size: params.size || 10,
      status: params.status
    })
  },

  getCardKeyListWithDetails() {
    return Server.get('/api/card-keys/with-details')
  },

  generateCardKey(data) {
    return Server.post('/api/card-keys', data)
  },

  editCardKey(id, data) {
    return Server.put(`/api/card-keys/${id}`, data)
  },

  deleteCardKey(id) {
    return Server.delete(`/api/card-keys/${id}`)
  },

  toggleCardKeyStatus(id, status) {
    return Server.put(`/api/card-keys/${id}/status`, { status })
  },

  disableCardKey(id) {
    return Server.put(`/api/card-keys/${id}/disable`)
  },

  clearUsedCardKeys() {
    return Server.delete('/api/card-keys/clear-used')
  },

  exportCardKeys(params) {
    return Server.get('/api/admin/card-keys/export', params, { responseType: 'blob' })
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
      size: params.size || 10
    })
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

  resetPassword(data) {
    return Server.post('/api/admins/reset-password', data)
  },

  sendResetCode(data) {
    return Server.post('/api/admins/send-reset-code', data)
  },

  getUserInfo() {
    return Server.get('/api/admins/info')
  },

  getCaptcha() {
    return Server.get('/api/auth/captcha')
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
  },

  getFileList(params) {
    return Server.get('/api/user/files', params)
  },

  uploadFile(data) {
    return Server.upload('/api/user/files/upload', data)
  },

  downloadFile(id) {
    return Server.get(`/api/user/files/${id}/download`, {}, { responseType: 'blob' })
  },

  deleteFile(id) {
    return Server.delete(`/api/user/files/${id}`)
  },

  getShareList(params) {
    return Server.get('/api/user/shares', params)
  },

  createShare(data) {
    return Server.post('/api/user/shares', data)
  },

  deleteShare(id) {
    return Server.delete(`/api/user/shares/${id}`)
  },

  verifyCardKey(data) {
    return Server.post('/api/user/card-keys/verify', data)
  }
}

export default {
  admin: AdminService,
  user: UserService
}