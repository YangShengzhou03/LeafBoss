// 基础类型定义

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 用户相关类型
export interface UserInfo {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  nickname?: string
  role: string
  status: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface LoginParams {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterParams {
  username: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  nickname?: string
}

export interface UserListParams {
  username?: string
  email?: string
  role?: string
  status?: boolean
  startDate?: string
  endDate?: string
}

export interface CreateUserParams {
  username: string
  email: string
  password: string
  phone?: string
  nickname?: string
  role: string
}

export interface UpdateUserParams {
  email?: string
  phone?: string
  nickname?: string
  avatar?: string
  role?: string
  status?: boolean
}

// 权限相关类型
export interface Permission {
  id: number
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  parentId?: number
  path?: string
  icon?: string
  sort: number
  description?: string
  children?: Permission[]
}

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

// 系统设置类型
export interface SystemConfig {
  siteName: string
  siteDescription: string
  siteLogo: string
  siteFavicon: string
  copyright: string
  icp: string
  contactEmail: string
  contactPhone: string
  allowRegister: boolean
  allowComment: boolean
  maintenanceMode: boolean
}

// 文件上传类型
export interface UploadFile {
  id: number
  name: string
  url: string
  size: number
  type: string
  uploader: string
  createdAt: string
}

export interface UploadResponse {
  file: UploadFile
  url: string
}

// 通知消息类型
export interface Notification {
  id: number
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

// 操作日志类型
export interface OperationLog {
  id: number
  userId: number
  username: string
  operation: string
  method: string
  url: string
  ip: string
  userAgent: string
  params?: string
  result: string
  status: boolean
  duration: number
  createdAt: string
}

// 仪表盘统计类型
export interface DashboardStats {
  userStats: {
    total: number
    active: number
    todayRegistered: number
  }
  systemStats: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    onlineUsers: number
  }
  businessStats: {
    totalOrders: number
    todayOrders: number
    totalRevenue: number
    todayRevenue: number
  }
}

// 通用查询参数
export interface QueryParams {
  keyword?: string
  status?: boolean
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 表单验证类型
export interface FormRules {
  [key: string]: Array<{
    required?: boolean
    message: string
    trigger: 'blur' | 'change' | 'submit'
    validator?: (rule: any, value: any, callback: any) => void
    pattern?: RegExp
    min?: number
    max?: number
  }>
}

// 组件属性类型
export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean | 'custom'
  fixed?: boolean | 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  showOverflowTooltip?: boolean
  formatter?: (row: any, column: any, cellValue: any, index: number) => any
}

export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
  children?: SelectOption[]
}

// 路由元信息类型
export interface RouteMeta {
  title: string
  icon?: string
  requiresAuth?: boolean
  roles?: string[]
  keepAlive?: boolean
  hidden?: boolean
  breadcrumb?: boolean
}

// 错误信息
export interface ErrorInfo {
  code: string
  message: string
  details?: any
}

// 菜单项
export interface MenuItem {
  id: number
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
  permission?: string
  sort: number
  hidden?: boolean
}