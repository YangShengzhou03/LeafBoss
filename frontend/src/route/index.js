import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/components/AdminLayout.vue';
import IndexLayout from '@/components/IndexLayout.vue';
import LoginPage from '@/views/LoginPage.vue';
import UserGuidePage from '@/views/index/UserGuidePage.vue';
import ContactUsPage from '@/views/index/ContactUsPage.vue';
import FAQPage from '@/views/index/FaqPage.vue';
import AuthorInfoPage from '@/views/index/AuthorInfoPage.vue';
import PrivacyPolicyPage from '@/views/index/PrivacyPolicyPage.vue';
import store from '@/utils/store.js';
import * as utils from '@/utils/utils.js';

const routes = [
  // 登录页面
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      title: '管理员登录 - 枫叶卡管',
      requiresAuth: false
    }
  },
  
  // 首页
  {
    path: '/',
    name: 'HomePage',
    component: IndexLayout,
    meta: {
      title: '枫叶卡管 - 企业级卡密管理系统',
      requiresAuth: false
    }
  },

  // 管理员布局
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardPage.vue'),
        meta: {
          title: '枫叶卡管 - 管理员仪表盘',
          requiresAuth: true
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersPage.vue'),
        meta: {
          title: '枫叶卡管 - 用户管理',
          requiresAuth: true
        }
      },
      {
        path: 'system',
        name: 'AdminSystem',
        component: () => import('@/views/admin/SystemPage.vue'),
        meta: {
          title: '枫叶卡管 - 系统设置',
          requiresAuth: true
        }
      },
      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('@/views/admin/LogsPage.vue'),
        meta: {
          title: '枫叶卡管 - 操作日志',
          requiresAuth: true
        }
      },
      {
        path: 'card-keys',
        name: 'CardKeyManagement',
        component: () => import('@/views/admin/CardKeyManagement.vue'),
        meta: {
          title: '枫叶卡管 - 卡密管理',
          requiresAuth: true
        }
      },
    ]
  },
  
  // 首页/分享链接
  {
    path: '/share/:id?',
    name: 'SharePage',
    component: IndexLayout,
    meta: {
      title: '枫叶卡管 - 企业级卡密管理系统',
      requiresAuth: false
    }
  },

  // 帮助支持页面
  {
    path: '/user-guide',
    name: 'UserGuidePage',
    component: UserGuidePage,
    meta: {
      title: '使用指南 - 枫叶卡管',
      requiresAuth: false
    }
  },
  {
    path: '/contact-us',
    name: 'ContactUsPage',
    component: ContactUsPage,
    meta: {
      title: '联系我们 - 枫叶卡管',
      requiresAuth: false
    }
  },
  {
    path: '/faq',
    name: 'FAQPage',
    component: FAQPage,
    meta: {
      title: '常见问题 - 枫叶卡管',
      requiresAuth: false
    }
  },

  // 法律信息页面
  {
    path: '/author-info',
    name: 'AuthorInfoPage',
    component: AuthorInfoPage,
    meta: {
      title: '作者介绍 - 枫叶卡管',
      requiresAuth: false
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyPage',
    component: PrivacyPolicyPage,
    meta: {
      title: '隐私保护 - 枫叶卡管',
      requiresAuth: false
    }
  },

  // 错误路径重定向（仅保留这一条）
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    const token = localStorage.getItem('token');
    if (!token) {
      // 未登录，重定向到登录页
      next('/login');
      return;
    }
    
    // 验证token是否有效
    try {
      const decoded = utils.parseJWT(token);
      // 检查token是否过期
      if (decoded.exp * 1000 < Date.now()) {
        // token已过期，清除并重定向到登录页
        localStorage.removeItem('token');
        next('/login');
        return;
      }
      
      // 更新store中的用户信息
      if (store.state.user === null) {
        store.setUser({
          id: decoded.id,
          username: decoded.username,
          role: decoded.role
        });
      }
      
      // 检查用户角色权限（管理员页面需要admin角色）
      if (to.meta.requiresAdmin && decoded.role !== 'admin') {
        // 权限不足，重定向到首页
        next('/');
        return;
      }
    } catch (error) {
      // token无效，清除并重定向到登录页
      localStorage.removeItem('token');
      next('/login');
      return;
    }
  }
  
  // 如果已登录且访问登录页，重定向到首页
  if (to.path === '/login' && localStorage.getItem('token')) {
    next('/');
    return;
  }

  next();
});

export default router;