import { createRouter, createWebHistory } from 'vue-router';
import IndexLayout from '@/components/IndexLayout.vue';
import LoginPage from '@/views/LoginPage.vue';
import AdminLayout from '@/components/AdminLayout.vue';
import UserGuidePage from '@/views/index/UserGuidePage.vue';
import ContactUsPage from '@/views/index/ContactUsPage.vue';
import FAQPage from '@/views/index/FaqPage.vue';
import AuthorInfoPage from '@/views/index/AuthorInfoPage.vue';
import PrivacyPolicyPage from '@/views/index/PrivacyPolicyPage.vue';
import store from '@/utils/store.js';
import * as utils from '@/utils/utils.js';
import ProductDashboard from '@/views/admin/ProductDashboard.vue';
import ProductManagement from '@/views/admin/ProductManagement.vue';
import ProductSpecManagement from '@/views/admin/ProductSpecManagement.vue';
import CardKeyManagement from '@/views/admin/CardKeyManagement.vue';

const routes = [
  // 未登录布局（首页 + 登录/注册）
  {
    path: '/',
    component: IndexLayout,
    meta: { title: '枫叶网盘', requiresAuth: false }
  },

  // 登录页面
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      title: '登录 - 枫叶网盘',
      requiresAuth: false
    }
  },

  // 管理员布局（管理员专属页面）
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
          title: '枫叶网盘 - 管理员仪表盘',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersPage.vue'),
        meta: {
          title: '枫叶网盘 - 用户管理',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'system',
        name: 'AdminSystem',
        component: () => import('@/views/admin/SystemPage.vue'),
        meta: {
          title: '枫叶网盘 - 系统设置',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('@/views/admin/LogsPage.vue'),
        meta: {
          title: '枫叶网盘 - 操作日志',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'product-dashboard',
        name: 'ProductDashboard',
        component: ProductDashboard,
        meta: {
          title: '枫叶卡管 - 产品仪表盘',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'product-management',
        name: 'ProductManagement',
        component: ProductManagement,
        meta: {
          title: '枫叶卡管 - 产品管理',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'product-spec-management',
        name: 'ProductSpecManagement',
        component: ProductSpecManagement,
        meta: {
          title: '枫叶卡管 - 产品规格管理',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'card-key-management',
        name: 'CardKeyManagement',
        component: CardKeyManagement,
        meta: {
          title: '枫叶卡管 - 卡密管理',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
    ]
  },

  // 帮助支持页面
  {
    path: '/user-guide',
    name: 'UserGuidePage',
    component: UserGuidePage,
    meta: {
      title: '使用指南 - 枫叶网盘',
      requiresAuth: false
    }
  },
  {
    path: '/contact-us',
    name: 'ContactUsPage',
    component: ContactUsPage,
    meta: {
      title: '联系我们 - 枫叶网盘',
      requiresAuth: false
    }
  },
  {
    path: '/faq',
    name: 'FAQPage',
    component: FAQPage,
    meta: {
      title: '常见问题 - 枫叶网盘',
      requiresAuth: false
    }
  },

  // 法律信息页面
  {
    path: '/author-info',
    name: 'AuthorInfoPage',
    component: AuthorInfoPage,
    meta: {
      title: '作者介绍 - 枫叶网盘',
      requiresAuth: false
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyPage',
    component: PrivacyPolicyPage,
    meta: {
      title: '隐私保护 - 枫叶网盘',
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
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 检查是否有token
    if (!utils.isLoggedIn()) {
      // 没有token，重定向到登录页
      next('/login');
      return;
    }

    // 如果有token但没有用户信息，尝试获取用户信息
    if (!store.state.user) {
      try {
        await store.fetchCurrentUser();
        await store.fetchStorageInfo();
      } catch (error) {
        // 只有在token无效或过期时才清除token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          utils.removeToken();
        }
        next('/login');
        return;
      }
    }

    // 检查是否需要管理员权限
    if (to.meta.requiresAdmin && !store.state.isAdmin) {
      // 需要管理员权限但用户不是管理员，重定向到用户首页
      next('/user');
      return;
    }
  }

  // 如果已登录且访问登录页，重定向到对应的首页
  if (to.path === '/login' && utils.isLoggedIn()) {
    if (store.state.isAdmin) {
      next('/admin');
    } else {
      next('/user');
    }
    return;
  }

  next();
});

export default router;