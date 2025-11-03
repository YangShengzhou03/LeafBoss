import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'

// 路由元信息类型定义
interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  permissions?: string[]
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册', requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表板', requiresAuth: true }
      },
      {
        path: 'cards',
        name: 'CardManagement',
        component: () => import('@/views/cards/CardList.vue'),
        meta: { title: '卡管理', requiresAuth: true }
      },
      {
        path: 'cards/add',
        name: 'CardAdd',
        component: () => import('@/views/cards/CardForm.vue'),
        meta: { title: '新增卡', requiresAuth: true }
      },
      {
        path: 'cards/edit/:id',
        name: 'CardEdit',
        component: () => import('@/views/cards/CardForm.vue'),
        meta: { title: '编辑卡', requiresAuth: true }
      },
      {
        path: 'cards/detail/:id',
        name: 'CardDetail',
        component: () => import('@/views/cards/CardDetail.vue'),
        meta: { title: '卡详情', requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 卡管家`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!userStore.token) {
      ElMessage.warning('请先登录')
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
    
    // 检查权限
    if (to.meta.permissions && to.meta.permissions.length > 0) {
      const hasPermission = userStore.permissions?.some(permission => 
        to.meta.permissions?.includes(permission)
      )
      
      if (!hasPermission) {
        ElMessage.error('权限不足')
        return from.fullPath ? false : { name: 'Dashboard' }
      }
    }
  }
  
  // 如果已登录且访问登录页，重定向到首页
  if (to.name === 'Login' && userStore.token) {
    return { name: 'Dashboard' }
  }
})

// 路由错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  ElMessage.error('页面加载失败，请刷新重试')
})

export default router