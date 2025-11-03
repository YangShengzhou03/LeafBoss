// 应用常量定义

// 应用配置
export const APP_CONFIG = {
  NAME: '枫叶卡管',
  VERSION: '1.0.0',
  DESCRIPTION: 'Leaf Card - 智能卡管理系统',
  COPYRIGHT: '© 2024 Leaf Card. All Rights Reserved.',
} as const

// API配置
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
} as const

// 路由配置
export const ROUTE_CONFIG = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CARDS: '/cards',
  CATEGORIES: '/categories',
  TRASH: '/trash',
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'leaf_token',
  USER_INFO: 'leaf_user_info',
  SIDEBAR_STATUS: 'leaf_sidebar_status',
  SIZE: 'size',
  THEME: 'leaf_theme',
  LANGUAGE: 'leaf_language',
  SETTINGS: 'leaf_settings'
} as const

// 响应状态码
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const

// 卡状态枚举
export const CARD_STATUS = {
  UNUSED: 'unused',
  USED: 'used',
  DISABLED: 'disabled',
} as const

export type CardStatus = typeof CARD_STATUS[keyof typeof CARD_STATUS]

// 权限枚举
export const PERMISSIONS = {
  // 卡管理
  CARD_VIEW: 'card:view',
  CARD_CREATE: 'card:create',
  CARD_EDIT: 'card:edit',
  CARD_DELETE: 'card:delete',
  
  // 分类管理
  CATEGORY_VIEW: 'category:view',
  CATEGORY_CREATE: 'category:create',
  CATEGORY_EDIT: 'category:edit',
  CATEGORY_DELETE: 'category:delete',
  
  // 系统管理
  USER_MANAGEMENT: 'system:user',
  ROLE_MANAGEMENT: 'system:role',
  SETTINGS_MANAGEMENT: 'system:settings',
} as const

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const

// 应用状态
export enum APP_STATUS {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error'
}

// 日期格式
export const DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  SHORT_DATE: 'MM-DD',
  SHORT_TIME: 'HH:mm',
  CHINESE: 'YYYY年MM月DD日',
  CHINESE_FULL: 'YYYY年MM月DD日 HH时mm分ss秒'
} as const

// 动画时长
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const

// 图标名称
export const ICON_NAMES = {
  DASHBOARD: 'dashboard',
  USER: 'user',
  SETTINGS: 'settings',
  LOGOUT: 'logout',
  SEARCH: 'search',
  ADD: 'add',
  EDIT: 'edit',
  DELETE: 'delete',
  SAVE: 'save',
  CANCEL: 'cancel',
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
  REFRESH: 'refresh',
  EXPAND: 'expand',
  COLLAPSE: 'collapse'
} as const

// 本地化语言
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US'
} as const

// 主题模式
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
} as const

// 响应式断点
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600,
} as const

// 主题配置
export const THEME_CONFIG = {
  PRIMARY_COLOR: '#409EFF',
  SUCCESS_COLOR: '#67C23A',
  WARNING_COLOR: '#E6A23C',
  DANGER_COLOR: '#F56C6C',
  INFO_COLOR: '#909399',
  
  // 字体大小
  FONT_SIZE_SM: '12px',
  FONT_SIZE_MD: '14px',
  FONT_SIZE_LG: '16px',
  FONT_SIZE_XL: '18px',
  
  // 间距
  SPACING_XS: '4px',
  SPACING_SM: '8px',
  SPACING_MD: '12px',
  SPACING_LG: '16px',
  SPACING_XL: '20px',
} as const

// 表单验证规则
export const VALIDATION_RULES = {
  // 用户名：4-20位字母、数字、下划线
  USERNAME: /^[a-zA-Z0-9_]{4,20}$/,
  // 密码：6-20位，包含字母和数字
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20}$/,
  // 邮箱
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 手机号
  PHONE: /^1[3-9]\d{9}$/
} as const

export default {
  APP_CONFIG,
  API_CONFIG,
  ROUTE_CONFIG,
  STORAGE_KEYS,
  HTTP_STATUS,
  CARD_STATUS,
  PERMISSIONS,
  BREAKPOINTS,
  THEME_CONFIG,
  VALIDATION_RULES,
}