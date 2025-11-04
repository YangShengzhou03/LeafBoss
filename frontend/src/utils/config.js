// 配置管理工具
import Server from './Server'

// 默认配置
const defaultConfig = {
  maxFileSize: 5120, // MB (5GB)
  appName: 'LeafPan网盘系统',
  apiVersion: 'v1'
}

// 当前配置
let currentConfig = { ...defaultConfig }

/**
 * 获取当前配置
 * @returns {Object} 当前配置对象
 */
export const getConfig = () => {
  return { ...currentConfig }
}

/**
 * 获取特定配置项
 * @param {string} key 配置键名
 * @param {*} defaultValue 默认值
 * @returns {*} 配置值
 */
export const getConfigItem = (key, defaultValue = null) => {
  return currentConfig[key] !== undefined ? currentConfig[key] : defaultValue
}

/**
 * 从后端加载配置
 * @returns {Promise<Object>} 配置对象
 */
export const loadConfig = async () => {
  try {
    const response = await Server.get('/config')
    if (response && response.data) {
      // 合并后端配置和默认配置
      currentConfig = { ...defaultConfig, ...response.data }
      return currentConfig
    }
  } catch (error) {
  }
  
  // 如果加载失败，返回默认配置
  return { ...defaultConfig }
}

/**
 * 设置配置项
 * @param {string} key 配置键名
 * @param {*} value 配置值
 */
export const setConfigItem = (key, value) => {
  currentConfig[key] = value
}

/**
 * 重置配置为默认值
 */
export const resetConfig = () => {
  currentConfig = { ...defaultConfig }
}

// 初始化时加载配置
loadConfig().catch(() => {})

export default {
  getConfig,
  getConfigItem,
  loadConfig,
  setConfigItem,
  resetConfig
}