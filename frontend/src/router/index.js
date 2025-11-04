import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'product',
        redirect: '/admin/product/goods'
      },
      {
        path: 'product/goods',
        name: 'ProductGoods',
        component: () => import('@/views/ProductGoods.vue'),
        meta: { title: '商品管理' }
      },
      {
        path: 'product/categories',
        name: 'ProductCategories',
        component: () => import('@/views/ProductCategories.vue'),
        meta: { title: '商品分类' }
      },
      {
        path: 'product/specifications',
        name: 'ProductSpecifications',
        component: () => import('@/views/ProductSpecifications.vue'),
        meta: { title: '规格管理' }
      },
      {
        path: 'cards',
        redirect: '/admin/cards/list'
      },
      {
        path: 'cards/list',
        name: 'CardsList',
        component: () => import('@/views/Cards.vue'),
        meta: { title: '卡密列表' }
      },
      {
        path: 'cards/validation',
        name: 'CardsValidation',
        component: () => import('@/views/Validation.vue'),
        meta: { title: '卡密验证' }
      },
      {
        path: 'cards/logs',
        name: 'CardLogs',
        component: () => import('@/views/CardLogs.vue'),
        meta: { title: '卡密记录' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { title: '用户管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 认证检查和设置页面标题
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Leaf Card`
  }
  
  // 检查是否需要认证
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 如果未认证且不是登录页面，重定向到登录页
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // 如果已认证但访问登录页，重定向到仪表盘
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router