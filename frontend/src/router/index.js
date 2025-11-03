import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'

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
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { title: '忘记密码', requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
    meta: { title: '重置密码', requiresAuth: false }
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
      // 卡分类管理
      {
        path: 'categories',
        name: 'CategoryManagement',
        component: () => import('@/views/categories/CategoryList.vue'),
        meta: { title: '分类管理', requiresAuth: true, permissions: ['admin', 'manager'] }
      },
      {
        path: 'categories/add',
        name: 'CategoryAdd',
        component: () => import('@/views/categories/CategoryForm.vue'),
        meta: { title: '添加分类', requiresAuth: true, permissions: ['admin', 'manager'] }
      },
      {
        path: 'categories/edit/:id',
        name: 'CategoryEdit',
        component: () => import('@/views/categories/CategoryForm.vue'),
        meta: { title: '编辑分类', requiresAuth: true, permissions: ['admin', 'manager'] }
      },
      // 卡管理
      {
        path: 'cards',
        name: 'CardList',
        component: () => import('@/views/cards/CardList.vue'),
        meta: { title: '卡列表', requiresAuth: true }
      },
      {
        path: 'cards/add',
        name: 'CardAdd',
        component: () => import('@/views/cards/CardForm.vue'),
        meta: { title: '添加卡', requiresAuth: true }
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
      },
      // 用户管理（仅管理员）
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/views/users/UserList.vue'),
        meta: { title: '用户管理', requiresAuth: true, permissions: ['admin'] }
      },
      // 系统设置（管理员和经理）
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/Settings.vue'),
        meta: { title: '系统设置', requiresAuth: true, permissions: ['admin', 'manager'] }
      },
      // 回收站
      {
        path: 'trash',
        name: 'Trash',
        component: () => import('@/views/TrashList.vue'),
        meta: { title: '回收站', requiresAuth: true }
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

// 设置路由守卫
setupRouterGuards(router)

export default router