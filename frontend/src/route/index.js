import { createRouter, createWebHistory } from 'vue-router';
import store from '@/utils/store.js';
import * as utils from '@/utils/utils.js';

const routes = [
  // 登录页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: {
      title: '管理员登录 - LeafCard',
      requiresAuth: false
    }
  },
  
  // 首页
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/components/IndexLayout.vue'),
    meta: {
      title: 'LeafCard - 枫叶卡管系统',
      requiresAuth: false
    }
  },

  // 管理员布局
  {
    path: '/admin',
    component: () => import('@/components/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardPage.vue'),
        meta: {
          title: 'LeafCard - 管理员仪表盘',
          requiresAuth: true
        }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersPage.vue'),
        meta: {
          title: 'LeafCard - 用户管理',
          requiresAuth: true
        }
      },
      
      {
        path: 'logs',
        name: 'AdminLogs',
        component: () => import('@/views/admin/LogsPage.vue'),
        meta: {
          title: 'LeafCard - 操作日志',
          requiresAuth: true
        }
      },
      {
        path: 'products',
        name: 'ProductManagement',
        component: () => import('@/views/admin/ProductManagement.vue'),
        meta: {
          title: 'LeafCard - 商品管理',
          requiresAuth: true
        }
      },
      {
        path: 'card-keys',
        name: 'CardKeyManagement',
        component: () => import('@/views/admin/CardKeyManagement.vue'),
        meta: {
          title: 'LeafCard - 卡密管理',
          requiresAuth: true
        }
      },
      {
        path: 'card-verify',
        name: 'CardKeyVerifyAdmin',
        component: () => import('@/views/admin/CardKeyVerify.vue'),
        meta: {
          title: 'LeafCard - 卡密验证',
          requiresAuth: true
        }
      },
      {
        path: 'card-generate',
        name: 'CardKeyGenerate',
        component: () => import('@/views/admin/CardKeyGenerate.vue'),
        meta: {
          title: 'LeafCard - 卡密生成',
          requiresAuth: true
        }
      },
      {
        path: 'profile',
        name: 'ProfilePage',
        component: () => import('@/views/admin/ProfilePage.vue'),
        meta: {
          title: 'LeafCard - 个人资料',
          requiresAuth: true
        }
      },
      {
        path: 'product-specs',
        name: 'ProductSpecManagement',
        component: () => import('@/views/admin/ProductSpecManagement.vue'),
        meta: {
          title: 'LeafCard - 规格管理',
          requiresAuth: true
        }
      },
    ]
  },
  
  // 首页/分享链接
  {
    path: '/share/:id?',
    name: 'SharePage',
    component: () => import('@/components/IndexLayout.vue'),
    meta: {
      title: 'LeafCard - 枫叶卡管系统',
      requiresAuth: false
    }
  },

  // 帮助支持页面
  {
    path: '/user-guide',
    name: 'UserGuidePage',
    component: () => import('@/views/index/UserGuidePage.vue'),
    meta: {
      title: '使用指南 - LeafCard',
      requiresAuth: false
    }
  },
  {
    path: '/contact-us',
    name: 'ContactUsPage',
    component: () => import('@/views/index/ContactUsPage.vue'),
    meta: {
      title: '联系我们 - LeafCard',
      requiresAuth: false
    }
  },
  {
    path: '/faq',
    name: 'FAQPage',
    component: () => import('@/views/index/FaqPage.vue'),
    meta: {
      title: '常见问题 - LeafCard',
      requiresAuth: false
    }
  },

  // 法律信息页面
  {
    path: '/author-info',
    name: 'AuthorInfoPage',
    component: () => import('@/views/index/AuthorInfoPage.vue'),
    meta: {
      title: '作者介绍 - LeafCard',
      requiresAuth: false
    }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicyPage',
    component: () => import('@/views/index/PrivacyPolicyPage.vue'),
    meta: {
      title: '隐私保护 - LeafCard',
      requiresAuth: false
    }
  },

  // 卡密验证页面
  {
    path: '/verify',
    name: 'CardKeyVerify',
    component: () => import('@/views/admin/CardKeyVerify.vue'),
    meta: {
      title: 'LeafCard - 卡密验证',
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
    
    // 开发环境：跳过token验证（后端未就绪）
    if (process.env.NODE_ENV === 'development') {
      // 直接设置用户为管理员（开发环境）
      if (store.state.user === null) {
        store.setUser({
          id: 1,
          username: 'admin',
          nickname: '管理员',
          role: 'admin',
          avatar: 'https://picsum.photos/id/1005/200/200'
        });
      }
      next();
      return;
    }
    
    // 生产环境：验证token是否有效
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