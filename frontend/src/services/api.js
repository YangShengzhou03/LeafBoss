import Server from '../utils/Server'
import { userApi, productApi, specificationApi, cardKeyApi, operationLogApi } from '../api'

const AdminService = {
  login(data) {
    return Server.post('/admin/login', data)
  },

  register(data) {
    return Server.post('/admin/register', data)
  },

  getDashboardStats() {
    return Server.get('/admin/dashboard')
  },

  getUserList(params) {
    return userApi.getUsers(params.page || 1, params.size || 10)
  },

  getLogList(params) {
    return operationLogApi.getOperationLogs(params.page || 1, params.size || 10)
  },

  getSystemConfig() {
    return Server.get('/admin/config')
  },

  updateSystemConfig(data) {
    return Server.put('/admin/config', data)
  },

  getCardKeyList(params) {
    return cardKeyApi.getCardKeys(params.page || 1, params.size || 10, params.status)
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

  exportCardKeys(params) {
    return Server.get('/admin/card-keys/export', params, { responseType: 'blob' })
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
    return Server.post('/auth/register', data)
  },

  getCaptcha() {
    return Server.get('/auth/captcha')
  },

  getCurrentUser() {
    return Server.get('/auth/me')
  },

  updateUserInfo(data) {
    return Server.put('/auth/me', data)
  },

  changePassword(data) {
    return Server.put('/auth/password', data)
  },

  getStorageInfo() {
    return Server.get('/user/storage')
  },

  getFileList(params) {
    return Server.get('/user/files', params)
  },

  uploadFile(data) {
    return Server.upload('/user/files/upload', data)
  },

  downloadFile(id) {
    return Server.get(`/user/files/${id}/download`, {}, { responseType: 'blob' })
  },

  deleteFile(id) {
    return Server.delete(`/user/files/${id}`)
  },

  getShareList(params) {
    return Server.get('/user/shares', params)
  },

  createShare(data) {
    return Server.post('/user/shares', data)
  },

  deleteShare(id) {
    return Server.delete(`/user/shares/${id}`)
  },

  verifyCardKey(data) {
    return Server.post('/user/card-keys/verify', data)
  }
}

export default {
  admin: AdminService,
  user: UserService
}