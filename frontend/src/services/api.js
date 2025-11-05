import Server from '../utils/Server'
import { userApi, productApi, specificationApi, cardKeyApi, operationLogApi } from '../api'

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
    return userApi.getUsers(params.page || 1, params.size || 10)
  },

  getLogList(params) {
    return operationLogApi.getOperationLogs(
      params.page || 1, 
      params.size || 10,
      params.startDate,
      params.endDate,
      params.operationType,
      params.adminId
    )
  },

  getLogStats(params) {
    return operationLogApi.getLogStats(params.startDate, params.endDate)
  },

  exportLogs(params) {
    return operationLogApi.exportLogs(params.startDate, params.endDate)
  },

  clearLogs() {
    return operationLogApi.clearLogs()
  },

  getLogsByAdmin(adminId) {
    return operationLogApi.getOperationLogsByAdmin(adminId)
  },

  getLogsByType(operationType) {
    return operationLogApi.getOperationLogsByType(operationType)
  },

  getLogsByTarget(targetType, targetId) {
    return operationLogApi.getOperationLogsByTarget(targetType, targetId)
  },

  logOperation(data) {
    return operationLogApi.logOperation(data)
  },

  logDetailedOperation(data) {
    return operationLogApi.logDetailedOperation(data)
  },

  getSystemConfig() {
    return Server.get('/api/admin/config')
  },

  updateSystemConfig(data) {
    return Server.put('/api/admin/config', data)
  },

  getCardKeyList(params) {
    return cardKeyApi.getCardKeys(params.page || 1, params.size || 10, params.status)
  },

  getCardKeyListWithDetails() {
    return cardKeyApi.getCardKeyListWithDetails()
  },

  generateCardKey(data) {
    return cardKeyApi.createCardKey(data)
  },

  editCardKey(id, data) {
    return cardKeyApi.updateCardKey(id, data)
  },

  deleteCardKey(id) {
    return cardKeyApi.deleteCardKey(id)
  },

  toggleCardKeyStatus(id, status) {
    return cardKeyApi.toggleCardKeyStatus(id, status)
  },

  disableCardKey(id) {
    return cardKeyApi.disableCard(id)
  },

  clearUsedCardKeys() {
    // 清空已使用卡密的API调用
    return Server.delete('/api/card-keys/clear-used')
  },

  exportCardKeys(params) {
    return Server.get('/api/admin/card-keys/export', params, { responseType: 'blob' })
  },

  getProductList(params) {
    return productApi.getProducts(params.page || 1, params.size || 10, params.category, params.status)
  },

  createProduct(data) {
    return productApi.createProduct(data)
  },

  editProduct(id, data) {
    return productApi.updateProduct(id, data)
  },

  deleteProduct(id) {
    return productApi.deleteProduct(id)
  },

  getSpecList(params) {
    return specificationApi.getSpecifications(params.page || 1, params.size || 10)
  },

  createSpec(data) {
    return specificationApi.createSpecification(data)
  },

  editSpec(id, data) {
    return specificationApi.updateSpecification(id, data)
  },

  deleteSpec(id) {
    return specificationApi.deleteSpecification(id)
  }
}

const UserService = {
  login(data) {
    return userApi.login(data)
  },

  register(data) {
    return Server.post('/api/auth/register', data)
  },

  createUser(data) {
    return userApi.createUser(data)
  },

  deleteUser(id) {
    return userApi.deleteUser(id)
  },

  resetPassword(data) {
    return userApi.resetPassword(data)
  },

  sendResetCode(data) {
    return userApi.sendResetCode(data)
  },

  getUserInfo() {
    return userApi.getUserInfo()
  },

  getCaptcha() {
    return Server.get('/api/auth/captcha')
  },

  getCurrentUser() {
    return Server.get('/api/auth/me')
  },

  updateUserInfo(data) {
    return Server.put('/api/auth/me', data)
  },

  changePassword(data) {
    return Server.put('/api/auth/password', data)
  },

  getStorageInfo() {
    return Server.get('/api/user/storage')
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