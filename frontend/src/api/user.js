import Server from '../utils/Server'

/**
 * 管理员相关API - 适配后端统一响应格式
 */
export const userApi = {
  /**
   * 管理员登录
   * @param {Object} loginData - 登录数据
   * @param {string} loginData.username - 用户名
   * @param {string} loginData.password - 密码
   * @returns {Promise} 登录结果
   */
  login(loginData) {
    return Server.post('/api/admins/login', loginData)
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
  }
}

export default userApi