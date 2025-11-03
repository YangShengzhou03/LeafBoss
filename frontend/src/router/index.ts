import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/cards'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    children: [
      {
        path: 'cards',
        name: 'CardManagement',
        component: () => import('@/views/cards/CardList.vue'),
        meta: { title: '卡管理' }
      },
      {
        path: 'cards/add',
        name: 'CardAdd',
        component: () => import('@/views/cards/CardForm.vue'),
        meta: { title: '新增卡' }
      },
      {
        path: 'cards/edit/:id',
        name: 'CardEdit',
        component: () => import('@/views/cards/CardForm.vue'),
        meta: { title: '编辑卡' }
      },
      {
        path: 'cards/detail/:id',
        name: 'CardDetail',
        component: () => import('@/views/cards/CardDetail.vue'),
        meta: { title: '卡详情' }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表板' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router