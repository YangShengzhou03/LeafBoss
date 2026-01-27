<template>
  <div class="index-layout">
    <header class="header" role="banner">
      <div class="container">
        <div class="logo-area">
          <h1 class="logo" aria-label="LEAF-BOSS - 业务运营支撑系统">LEAF-BOSS</h1>
        </div>
        <nav class="auth-section" role="navigation" aria-label="用户导航">
          <div class="auth-buttons" v-if="!isAuthenticated" role="group" aria-label="登录注册选项">
            <el-button type="default" class="register-btn" @click="handleRegister" aria-label="注册新账户">
              注册
            </el-button>
            <el-button type="primary" class="login-btn" @click="handleLogin" aria-label="登录系统">
              登录
            </el-button>
          </div>
          <div class="user-info" v-else role="group" aria-label="用户菜单">
            <el-dropdown @command="handleUserCommand" trigger="click" aria-label="用户操作菜单">
              <span class="user-dropdown" role="button" tabindex="0">
                <el-avatar :size="32" :src="userAvatar" :alt="`${displayName}的头像`">
                  <el-icon>
                    <User />
                  </el-icon>
                </el-avatar>
                <span class="username">{{ displayName }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu role="menu">
                  <el-dropdown-item command="dashboard" role="menuitem">
                    进入管理后台
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout" role="menuitem">
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </nav>
      </div>
    </header>

    <main class="main-content" role="main">
      <section class="hero-section" aria-labelledby="hero-title">
        <div class="container">
          <div class="hero-content">
            <h1 id="hero-title" class="hero-title">LEAF-BOSS</h1>
            <p class="hero-description">
              专业的业务运营支撑系统
            </p>
            <div class="cta-buttons" role="group" aria-label="主要操作">
              <el-button type="primary" size="large" class="start-btn" @click="handleStart"
                :aria-label="isAuthenticated ? '进入管理后台' : '登录系统'">
                {{ isAuthenticated ? '进入管理后台' : '登录系统' }}
              </el-button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="features-section" aria-labelledby="features-title">
        <div class="container">
          <h2 id="features-title" class="section-title">业务运营支撑系统功能</h2>
          <div class="features-grid" role="list">
            <article class="feature-card" v-for="feature in features" :key="feature.id" role="listitem"
              :aria-labelledby="`feature-${feature.id}`">
              <div class="feature-icon" :aria-label="`${feature.title}图标`">
                <el-icon :size="40">
                  <component :is="feature.icon" />
                </el-icon>
              </div>
              <h3 :id="`feature-${feature.id}`">{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-content">
          <section class="footer-section" aria-labelledby="footer-about">
            <h3 id="footer-about">LEAF-BOSS</h3>
            <p>专业的业务运营支撑系统</p>
          </section>
          <nav class="footer-section" aria-labelledby="footer-products">
            <h4 id="footer-products">产品功能</h4>
            <ul role="list">
              <li role="listitem">
                <a href="#features" @click.prevent="scrollToSection('features')" aria-label="查看功能特色">
                  功能特色
                </a>
              </li>
            </ul>
          </nav>
          <nav class="footer-section" aria-labelledby="footer-support">
            <h4 id="footer-support">帮助支持</h4>
            <ul role="list">
              <li role="listitem">
                <a href="/user-guide" target="_blank" rel="noopener noreferrer" aria-label="查看使用指南">
                  使用指南
                </a>
              </li>
              <li role="listitem">
                <a href="/contact-us" target="_blank" rel="noopener noreferrer" aria-label="联系我们">
                  联系我们
                </a>
              </li>
              <li role="listitem">
                <a href="/faq" target="_blank" rel="noopener noreferrer" aria-label="查看常见问题">
                  常见问题
                </a>
              </li>
            </ul>
          </nav>
          <nav class="footer-section" aria-labelledby="footer-legal">
            <h4 id="footer-legal">法律信息</h4>
            <ul role="list">
              <li role="listitem">
                <a href="/author-info" target="_blank" rel="noopener noreferrer" aria-label="查看作者介绍">
                  作者介绍
                </a>
              </li>
              <li role="listitem">
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" aria-label="查看隐私保护政策">
                  隐私保护
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024-2026 LEAF-BOSS - 业务运营支撑系统</p>
          <div class="icp-info">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"
              aria-label="查看ICP备案信息：赣ICP备2025075576号">
              赣ICP备2025075576号
            </a>
            <a href="https://beian.mps.gov.cn/#/query/webSearch?code=36010802001254" rel="noreferrer"
              target="_blank">赣公网安备36010802001254号</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, ArrowDown, Key, Box, DataLine } from '@element-plus/icons-vue'
import store from '@/utils/store.js'

const router = useRouter()

const isAuthenticated = computed(() => store.state.isAuthenticated)
const currentUser = computed(() => store.state.user)
const displayName = computed(() => {
  const user = currentUser.value
  if (!user) return '管理员'
  return user.nickname || user.username || user.email || '管理员'
})
const userAvatar = computed(() => currentUser.value?.avatar || '')

const FEATURES_DATA = [
  {
    id: 1,
    icon: Key,
    title: '授权密钥管理',
    description: '完整的授权密钥生命周期管理，支持创建、验证、激活、禁用等操作。'
  },
  {
    id: 2,
    icon: Box,
    title: '产品规格管理',
    description: '灵活的产品和规格配置，支持多种产品类型和授权方案。'
  },
  {
    id: 3,
    icon: DataLine,
    title: '数据统计分析',
    description: '全面的数据统计和分析功能，实时监控系统使用情况。'
  }
]

const features = ref(FEATURES_DATA)

let scrollTimeout = null
const scrollToSection = (sectionId) => {
  if (scrollTimeout) clearTimeout(scrollTimeout)

  scrollTimeout = setTimeout(() => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, 50)
}

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
})

const handleError = (message, error) => {
  console.error(message, error)
  ElMessage.error(message)
}

const handleUserCommand = async (command) => {
  try {
    if (command === 'logout') {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          lockScroll: false
        }
      )

      await store.logout()
      ElMessage.success('已退出登录')
      router.push('/')
    } else if (command === 'dashboard') {
      handleStart()
    }
  } catch (error) {
    if (error !== 'cancel') {
      handleError('操作失败，请重试', error)
    }
  }
}

const handleLogin = () => {
  try {
    router.push('/login')
  } catch (error) {
    handleError('页面跳转失败', error)
  }
}

const handleRegister = () => {
  try {
    router.push('/login?mode=register')
  } catch (error) {
    handleError('页面跳转失败', error)
  }
}

const handleStart = () => {
  try {
    if (!isAuthenticated.value) {
      router.push('/login')
      return
    }

    const targetRoute = store.state.isAdmin ? '/admin' : '/user'
    router.push(targetRoute)
  } catch (error) {
    handleError('页面跳转失败，请重试', error)
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    const target = event.target
    if (target.classList.contains('user-dropdown')) {
      event.preventDefault()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

</script>

<style scoped>
/* 简约精致的整体布局 */
.index-layout {
  font-family: 'Inter', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  color: #1f2937;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

/* 简约精致的顶部导航 */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #f3f4f6;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.95);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  height: 64px;
}

.logo {
  color: #3b82f6;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.auth-section {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.register-btn {
  border-color: #3b82f6;
  color: #3b82f6;
  font-weight: 500;
}

.login-btn {
  background-color: #3b82f6;
  border-color: #3b82f6;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #374151;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  gap: 8px;
}

.user-dropdown:hover {
  background-color: #f9fafb;
}

.username {
  font-weight: 500;
  font-size: 14px;
}

/* 简约美观的主内容区域 */
.main-content {
  flex: 1;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 120px 0 80px;
  position: relative;
}

.hero-section .container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  max-width: 600px;
}

.hero-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #111827;
  letter-spacing: -1px;
}

.hero-description {
  font-size: 16px;
  margin-bottom: 40px;
  color: #6b7280;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.start-btn,
.down-btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.start-btn:hover,
.down-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* 功能特色区域 */
.features-section {
  padding: 80px 0;
  background-color: #ffffff;
}

.features-section h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 40px;
  color: #111827;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  background: #ffffff;
  border: 1px solid #f3f4f6;
  padding: 32px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-color: #e5e7eb;
}

.feature-icon {
  color: #3b82f6;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111827;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
  font-size: 15px;
}

/* 简约的页脚 */
.footer {
  background-color: #111827;
  color: #d1d5db;
  padding: 48px 0 24px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 16px;
  color: #ffffff;
  font-weight: 600;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 14px;
}

.footer-section a:hover {
  color: #3b82f6;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

.footer-bottom p {
  margin: 0;
}

.icp-info {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.icp-info a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 13px;
}

.icp-info a:hover {
  color: #3b82f6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .header .container {
    padding: 12px 16px;
    height: 56px;
  }

  .logo {
    font-size: 20px;
  }

  .hero-section {
    padding: 80px 0 60px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-description {
    font-size: 16px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>