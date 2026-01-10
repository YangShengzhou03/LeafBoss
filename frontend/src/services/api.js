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

  getCardKeyListWithDetails(params) {
    return Server.get('/api/card-keys/with-details', {
      page: params.page || 1,
      size: params.size || 10,
      keyword: params.keyword,
      specificationId: params.specificationId,
      status: params.status
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

  batchDeleteUsedCardKeys() {
    return Server.delete('/api/card-keys/batch-delete-used')
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

  getSpecListDTO(params) {
    return Server.get('/api/specifications/dto/pagination', {
      page: params.page || 1,
      size: params.size || 10,
      keyword: params.keyword,
      productId: params.productId
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

  getSpecificationDTOs() {
    return Server.get('/api/specifications/dto')
  },

  getCompanyList(params) {
    return Server.get('/api/companies', {
      page: params.page || 1,
      size: params.size || 10,
      name: params.name
    })
  },

  createCompany(data) {
    return Server.post('/api/companies', data)
  },

  editCompany(id, data) {
    return Server.put(`/api/companies/${id}`, data)
  },

  deleteCompany(id) {
    return Server.delete(`/api/companies/${id}`)
  },

  getBossReviewList(params) {
    return Server.get('/api/boss-reviews', {
      page: params.page || 1,
      size: params.size || 10,
      companyId: params.companyId,
      cardKey: params.cardKey
    })
  },

  createBossReview(data) {
    return Server.post('/api/boss-reviews', data)
  },

  deleteBossReview(id) {
    return Server.delete(`/api/boss-reviews/${id}`)
  },

  getCustomerUserList(params) {
    return Server.get('/api/users', {
      page: params.page || 1,
      size: params.size || 10,
      keyword: params.keyword,
      status: params.status
    })
  },

  createCustomerUser(data) {
    return Server.post('/api/users', data)
  },

  updateCustomerUser(id, data) {
    return Server.put(`/api/users/${id}`, data)
  },

  deleteCustomerUser(id) {
    return Server.delete(`/api/users/${id}`)
  },

  resetCustomerUserPassword(data) {
    return Server.post('/api/users/reset-password', data)
  },

  createPublicReview(data) {
    return Server.post('/api/public/boss-reviews', data)
  },

  getPublicReviews(params) {
    return Server.get('/api/public/boss-reviews', {
      company_name: params.company_name,
      page: params.page || 1,
      size: params.size || 10
    })
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
  }
}

export default {
  admin: AdminService,
  user: UserService
}