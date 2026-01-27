import { createRouter, createWebHistory } from 'vue-router';
import store from '@/utils/store.js';
import * as utils from '@/utils/utils.js';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: {
      title: '管理员登录 - LEAF-BOSS',
      requiresAuth: false
    }
  },

  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/components/IndexLayout.vue'),
    meta: {
      title: 'LEAF-BOSS - 业务运营支撑系统',
      requiresAuth: false
    }
  },

  {
    path: '/admin',
    component: () => import('@/components/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardPage.vue'),
        meta: {
          title: 'LEAF-BOSS - 管理员仪表盘',
          requiresAuth: true
        }
      },
      {
        path: 'admins',
        name: 'AdminUsers',
        component: () => import('@/views/admin/AdminsPage.vue'),
        meta: {
          title: 'LEAF-BOSS - 管理人员',
          requiresAuth: true
        }
      },
      {
        path: 'users',
        name: 'CustomerUsers',
        component: () => import('@/views/admin/CustomerUsersPage.vue'),
        meta: {
          title: 'LEAF-BOSS - 用户管理',
          requiresAuth: true
        }
      },

      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('@/views/admin/LogsPage.vue'),
        meta: {
          title: 'LEAF-BOSS - 操作日志',
          requiresAuth: true
        }
      },
      {
        path: 'products',
        name: 'ProductManagement',
        component: () => import('@/views/admin/ProductManagement.vue'),
        meta: {
          title: 'LEAF-BOSS - 商品管理',
          requiresAuth: true
        }
      },
      {
        path: 'card-keys',
        name: 'CardKeyManagement',
        component: () => import('@/views/admin/card/CardKeyManagement.vue'),
        meta: {
          title: 'LEAF-BOSS - 密钥管理',
          requiresAuth: true
        }
      },
      {
        path: 'card-verify',
        name: 'CardKeyVerifyAdmin',
        component: () => import('@/views/admin/card/CardKeyVerify.vue'),
        meta: {
          title: 'LEAF-BOSS - 密钥验证',
          requiresAuth: true
        }
      },
      {
        path: 'card-generate',
        name: 'CardKeyGenerate',
        component: () => import('@/views/admin/card/CardKeyGenerate.vue'),
        meta: {
          title: 'LEAF-BOSS - 密钥生成',
          requiresAuth: true
        }
      },
      {
        path: 'profile',
        name: 'ProfilePage',
        component: () => import('@/views/admin/ProfilePage.vue'),
        meta: {
          title: 'LEAF-BOSS - 个人资料',
          requiresAuth: true
        }
      },
      {
        path: 'product-specs',
        name: 'ProductSpecManagement',
        component: () => import('@/views/admin/ProductSpecManagement.vue'),
        meta: {
          title: 'LEAF-BOSS - 规格管理',
          requiresAuth: true
        }
      },
      {
        path: 'jobs/companies',
        name: 'CompanyManagement',
        component: () => import('@/views/admin/jobs/CompanyManagement.vue'),
        meta: {
          title: 'LEAF-BOSS - 公司管理',
          requiresAuth: true
        }
      },
      {
        path: 'jobs/boss-reviews',
        name: 'BossReviewManagement',
        component: () => import('@/views/admin/jobs/BossReviewManagement.vue'),
        meta: {
          title: 'LEAF-BOSS - 评论管理',
          requiresAuth: true
        }
      },
    ]
  },

  {
    path: '/share/:id?',
    name: 'SharePage',
    component: () => import('@/components/IndexLayout.vue'),
    meta: {
      title: 'LEAF-BOSS - 业务运营支撑系统',
      requiresAuth: false
    }
  },

  {
    path: '/user-guide',
    name: 'UserGuidePage',
    component: () => import('@/views/index/UserGuidePage.vue'),
    meta: {
      title: '使用指南 - LEAF-BOSS',
      requiresAuth: false
    }
  },
  {
    path: '/contact-us',
    name: 'ContactUsPage',
    component: () => import('@/views/index/ContactUsPage.vue'),
    meta: {
      title: '联系我们 - LEAF-BOSS',
      requiresAuth: false
    }
  },
  {
    path: '/faq',
    name: 'FAQPage',
    component: () => import('@/views/index/FaqPage.vue'),
    meta: {
      title: '常见问题 - LEAF-BOSS',
      requiresAuth: false
    }
  },

  {
    path: '/author-info',
    name: 'AuthorInfoPage',
    component: () => import('@/views/index/AuthorInfoPage.vue'),
    meta: {
      title: '作者介绍 - LEAF-BOSS',
      requiresAuth: false
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyPage',
    component: () => import('@/views/index/PrivacyPolicyPage.vue'),
    meta: {
      title: '隐私保护 - LEAF-BOSS',
      requiresAuth: false
    }
  },

  {
    path: '/verify',
    name: 'CardKeyVerify',
    component: () => import('@/views/admin/card/CardKeyVerify.vue'),
    meta: {
      title: 'LEAF-BOSS - 授权密钥验证',
      requiresAuth: false
    }
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (to.meta.requiresAuth) {
    const isAuthenticated = await store.checkAuthStatus();

    if (!isAuthenticated) {
      store.clearUser();
      next('/login');
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      next();
      return;
    }

    if (!store.state.user) {
      try {
        await store.fetchCurrentUser();
      } catch (error) {
        store.clearUser();
        next('/login');
        return;
      }
    }
  }

  if (to.path === '/login' && utils.isLoggedIn()) {
    const isAuthenticated = await store.checkAuthStatus();
    if (isAuthenticated) {
      next('/admin');
      return;
    } else {
      store.clearUser();
    }
  }

  next();
});

export default router;