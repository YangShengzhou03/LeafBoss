import { defineStore } from 'pinia'
import type { UserInfo, Permission } from '@/types'

// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string
  role: string
  permissions: Permission[]
  createTime: string
}

// 应用状态接口
interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  }
  device: 'desktop' | 'mobile'
  size: 'default' | 'large' | 'small'
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    sidebar: {
      opened: localStorage.getItem('sidebarStatus') ? localStorage.getItem('sidebarStatus') === '1' : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: localStorage.getItem('size') || 'default' as 'default' | 'large' | 'small'
  }),
  
  getters: {
    isMobile: (state) => state.device === 'mobile',
    sidebarOpened: (state) => state.sidebar.opened
  },
  
  actions: {
    toggleSidebar(withoutAnimation?: boolean) {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = withoutAnimation || false
      if (this.sidebar.opened) {
        localStorage.setItem('sidebarStatus', '1')
      } else {
        localStorage.setItem('sidebarStatus', '0')
      }
    },
    
    closeSidebar(withoutAnimation: boolean) {
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
      localStorage.setItem('sidebarStatus', '0')
    },
    
    toggleDevice(device: 'desktop' | 'mobile') {
      this.device = device
    },
    
    setSize(size: 'default' | 'large' | 'small') {
      this.size = size
      localStorage.setItem('size', size)
    }
  }
})

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
    permissions: [] as string[],
    roles: [] as string[]
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || '',
    avatar: (state) => state.userInfo?.avatar || '',
    role: (state) => state.userInfo?.role || ''
  },
  
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.roles = [userInfo.role]
      this.permissions = userInfo.permissions.map(p => p.code)
    },
    
    clearUserInfo() {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      this.roles = []
      localStorage.removeItem('token')
    },
    
    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission)
    },
    
    hasRole(role: string): boolean {
      return this.roles.includes(role)
    },
    
    logout() {
      this.clearUserInfo()
    }
  }
})

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [] as any[],
    addRoutes: [] as any[]
  }),
  
  actions: {
    setRoutes(routes: any[]) {
      this.routes = routes
    },
    
    setAddRoutes(routes: any[]) {
      this.addRoutes = routes
    },
    
    generateRoutes(permissions: string[]) {
      // 根据权限动态生成路由
      const accessedRoutes = this.filterAsyncRoutes([], permissions)
      this.setRoutes(accessedRoutes)
      this.setAddRoutes(accessedRoutes)
      return accessedRoutes
    },
    
    filterAsyncRoutes(routes: any[], permissions: string[]) {
      const res: any[] = []
      
      routes.forEach(route => {
        const tmp = { ...route }
        if (this.hasPermission(permissions, tmp)) {
          if (tmp.children) {
            tmp.children = this.filterAsyncRoutes(tmp.children, permissions)
          }
          res.push(tmp)
        }
      })
      
      return res
    },
    
    hasPermission(permissions: string[], route: any) {
      if (route.meta && route.meta.permissions) {
        return permissions.some(permission => route.meta.permissions.includes(permission))
      }
      return true
    }
  }
})