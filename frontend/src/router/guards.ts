import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores'
import { AuthUtil } from '@/services/auth'
import { AppStorage } from '@/utils/storage'

// 白名单路由（不需要登录即可访问）
const WHITE_LIST = ['/login', '/register', '/forgot-password', '/reset-password']

// 需要特定权限的路由配置
const PERMISSION_ROUTES = {
  '/admin': ['admin'],
  '/user-management': ['admin'],
  '/system-settings': ['admin', 'manager']
}

/**
 * 检查用户是否有权限访问路由
 */
function checkPermission(routePath: string, userRoles: string[]): boolean {
  const requiredRoles = PERMISSION_ROUTES[routePath as keyof typeof PERMISSION_ROUTES]
  
  if (!requiredRoles) {
    return true // 没有权限要求，允许访问
  }
  
  return requiredRoles.some(role => userRoles.includes(role))
}

/**
 * 路由守卫设置
 */
export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    const appStore = useAppStore()
    const token = appStore.token
    
    // 检查token是否存在且有效
    if (token) {
      if (AuthUtil.isTokenExpired(token)) {
        // token过期，清除存储并跳转到登录页
        appStore.clearAuth()
        AppStorage.clearAuth()
        ElMessage.warning('登录已过期，请重新登录')
        next('/login')
        return
      }
      
      // 如果已经登录，尝试访问登录页，则重定向到首页
      if (to.path === '/login') {
        next('/dashboard')
        return
      }
      
      // 检查用户权限
      const userRoles = appStore.userInfo?.roles || []
      if (!checkPermission(to.path, userRoles)) {
        ElMessage.error('您没有权限访问此页面')
        next(from.path || '/dashboard')
        return
      }
      
      next()
    } else {
      // 没有token
      if (WHITE_LIST.includes(to.path)) {
        next() // 在白名单中，允许访问
      } else {
        // 不在白名单中，重定向到登录页
        ElMessage.warning('请先登录')
        next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      }
    }
  })
  
  // 全局后置守卫
  router.afterEach((to) => {
    // 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - Leaf Card`
    } else {
      document.title = 'Leaf Card'
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0)
  })
  
  // 路由错误处理
  router.onError((error) => {
    console.error('路由错误:', error)
    ElMessage.error('页面加载失败，请刷新重试')
  })
}

/**
 * 检查当前用户是否有指定权限
 */
export function hasPermission(permission: string | string[]): boolean {
  const appStore = useAppStore()
  const userRoles = appStore.userInfo?.roles || []
  
  if (typeof permission === 'string') {
    return userRoles.includes(permission)
  }
  
  if (Array.isArray(permission)) {
    return permission.some(role => userRoles.includes(role))
  }
  
  return false
}

/**
 * 检查当前用户是否有任意指定权限
 */
export function hasAnyPermission(permissions: string[]): boolean {
  const appStore = useAppStore()
  const userRoles = appStore.userInfo?.roles || []
  
  return permissions.some(permission => userRoles.includes(permission))
}

/**
 * 检查当前用户是否有所有指定权限
 */
export function hasAllPermissions(permissions: string[]): boolean {
  const appStore = useAppStore()
  const userRoles = appStore.userInfo?.roles || []
  
  return permissions.every(permission => userRoles.includes(permission))
}

/**
 * 权限指令工具函数
 */
export const permissionDirective = {
  mounted(el: HTMLElement, binding: any) {
    const { value } = binding
    
    if (value && !hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}