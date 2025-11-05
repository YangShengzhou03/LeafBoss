import Server from '../utils/Server'

/**
 * 管理员相关API - 适配后端统一响应格式
 */
export const userApi = {
  /**
   * 管理员登录
   * @param {Object} loginData - 登录数据
   * @param {string} loginData.email - 邮箱
   * @param {string} loginData.password - 密码
   * @returns {Promise} 登录结果
   */
  login(loginData) {
    return Server.post('/api/auth/login', loginData)
  },

  /**
   * 获取管理员列表（分页）
   * @param {number} page - 页码
   * @param {number} size - 每页大小
   * @returns {Promise} 管理员列表
   */
  getUsers(page = 1, size = 10) {
    return Server.get('/api/admins', { page, size })
  },

  /**
   * 根据ID获取管理员
   * @param {string} id - 管理员ID
   * @returns {Promise} 管理员信息
   */
  getUserById(id) {
    return Server.get(`/api/admins/${id}`)
  },

  /**
   * 根据用户名获取管理员
   * @param {string} username - 用户名
   * @returns {Promise} 管理员信息
   */
  getUserByUsername(username) {
    return Server.get(`/api/admins/username/${username}`)
  },

  /**
   * 创建管理员
   * @param {Object} userData - 管理员数据
   * @returns {Promise} 创建结果
   */
  createUser(userData) {
    return Server.post('/api/admins', userData)
  },

  /**
   * 更新管理员
   * @param {string} id - 管理员ID
   * @param {Object} userData - 管理员数据
   * @returns {Promise} 更新结果
   */
  updateUser(id, userData) {
    return Server.put(`/api/admins/${id}`, userData)
  },

  /**
   * 删除管理员
   * @param {string} id - 管理员ID
   * @returns {Promise} 删除结果
   */
  deleteUser(id) {
    return Server.delete(`/api/admins/${id}`)
  },

  /**
   * 获取管理员统计信息
   * @returns {Promise} 统计信息
   */
  getUserStatistics() {
    return Server.get('/api/admins/statistics')
  },

  /**
   * 重置管理员密码
   * @param {Object} resetData - 重置密码数据
   * @param {string} resetData.email - 邮箱
   * @param {string} resetData.verificationCode - 验证码
   * @param {string} resetData.newPassword - 新密码
   * @returns {Promise} 重置结果
   */
  resetPassword(resetData) {
    return Server.post('/api/admins/reset-password', resetData)
  },

  /**
   * 发送重置密码验证码
   * @param {Object} data - 发送验证码数据
   * @param {string} data.email - 邮箱
   * @returns {Promise} 发送结果
   */
  sendResetCode(data) {
    return Server.post('/api/admins/send-reset-code', data)
  },

  /**
   * 获取用户信息
   * @returns {Promise} 用户信息
   */
  getUserInfo() {
    return Server.get('/api/admins/info')
  },

  /**
   * 更新用户信息
   * @param {Object} userData - 用户数据
   * @returns {Promise} 更新结果
   */
  updateUserInfo(userData) {
    return Server.put('/api/admins/info', userData)
  },

  /**
   * 修改密码
   * @param {Object} passwordData - 密码数据
   * @param {string} passwordData.oldPassword - 旧密码
   * @param {string} passwordData.newPassword - 新密码
   * @returns {Promise} 修改结果
   */
  changePassword(passwordData) {
    return Server.put('/api/admins/password', passwordData)
  }
}

export default userApi