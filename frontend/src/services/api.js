import Server from '../utils/Server'

const AdminService = {
  getDashboardStats() {
    return Server.get('/admin/dashboard')
  },

  getUserList(params) {
    return Server.get('/admin/users', params)
  },

  getLogList(params) {
    return Server.get('/admin/logs', params)
  },

  getSystemConfig() {
    return Server.get('/admin/config')
  },

  updateSystemConfig(data) {
    return Server.put('/admin/config', data)
  },

  getCardKeyList(params) {
    return Server.get('/admin/card-keys', params)
  },

  generateCardKey(data) {
    return Server.post('/admin/card-keys/generate', data)
  },

  editCardKey(id, data) {
    return Server.put(`/admin/card-keys/${id}`, data)
  },

  deleteCardKey(id) {
    return Server.delete(`/admin/card-keys/${id}`)
  },

  exportCardKeys(params) {
    return Server.get('/admin/card-keys/export', params, { responseType: 'blob' })
  },

  getProductList(params) {
    return Server.get('/admin/products', params)
  },

  createProduct(data) {
    return Server.post('/admin/products', data)
  },

  editProduct(id, data) {
    return Server.put(`/admin/products/${id}`, data)
  },

  deleteProduct(id) {
    return Server.delete(`/admin/products/${id}`)
  },

  getSpecList(params) {
    return Server.get('/admin/specs', params)
  },

  createSpec(data) {
    return Server.post('/admin/specs', data)
  },

  editSpec(id, data) {
    return Server.put(`/admin/specs/${id}`, data)
  },

  deleteSpec(id) {
    return Server.delete(`/admin/specs/${id}`)
  }
}

const UserService = {
  login(data) {
    return Server.post('/auth/login', data)
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