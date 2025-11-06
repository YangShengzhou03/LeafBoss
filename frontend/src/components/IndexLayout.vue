<template>
  <div class="index-layout">
    <header class="header">
      <div class="container">
        <div class="logo-area">
          <h1 class="logo">LeafCard</h1>
        </div>
        <div class="auth-section">
          <div class="auth-buttons" v-if="!isAuthenticated">
            <el-button type="default" class="register-btn" @click="handleRegister">注册</el-button>
            <el-button type="primary" class="login-btn" @click="handleLogin">登录</el-button>
          </div>
          <div class="user-info" v-else>
            <el-dropdown @command="handleUserCommand" trigger="click">
              <span class="user-dropdown">
                <el-avatar :size="32" :src="userAvatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span class="username">{{ displayName }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="dashboard">进入管理后台</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">LeafCard</h1>
            <p class="hero-description">枫叶卡管系统 - 卡密管理系统</p>
            <div class="cta-buttons">
            <el-button type="primary" size="large" class="start-btn" @click="handleStart">
              {{ isAuthenticated ? '进入管理后台' : '立即开始使用' }}
            </el-button>
          </div>
          </div>
        </div>
      </section>

      <section id="features" class="features-section">
        <div class="container">
          <h2>LeafCard - 枫叶卡管系统的特色功能</h2>
          <div class="features-grid">
            <div class="feature-card" v-for="feature in features" :key="feature.id">
              <div class="feature-icon">
                <el-icon :size="40"><component :is="feature.icon" /></el-icon>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>枫叶卡管系统</h3>
            <p>卡密管理系统</p>
          </div>
          <div class="footer-section">
            <h4>产品功能</h4>
            <ul>
              <li><a href="#features" @click.prevent="scrollToSection('features')">功能特色</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>帮助支持</h4>
            <ul>
              <li><a href="/user-guide" target="_blank">使用指南</a></li>
              <li><a href="/contact-us" target="_blank">联系我们</a></li>
              <li><a href="/faq" target="_blank">常见问题</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>法律信息</h4>
            <ul>
              <li><a href="/author-info" target="_blank">作者介绍</a></li>
              <li><a href="/privacy-policy" target="_blank">隐私保护</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024-2025 LeafCard - 枫叶卡管系统</p>
          <div class="icp-info">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              赣ICP备2025075576号
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, ArrowDown, Key, Box, DataLine } from '@element-plus/icons-vue'
import store from '@/utils/store.js'

const router = useRouter()

// 计算属性
const isAuthenticated = computed(() => store.state.isAuthenticated)
const currentUser = computed(() => store.state.user)
const displayName = computed(() => {
  return currentUser.value?.nickname || currentUser.value?.username || currentUser.value?.email || '管理员'
})
const userAvatar = computed(() => {
  return currentUser.value?.avatar || ''
})

// 功能特色数据
const features = ref([
  {
    id: 1,
    icon: Key,
    title: '卡密管理',
    description: '批量生成、验证和管理卡密，支持多种格式和自定义规则。'
  },
  {
    id: 2,
    icon: Box,
    title: '商品管理',
    description: '灵活的商品和规格管理，支持多种产品类型和授权策略。'
  },
  {
    id: 3,
    icon: DataLine,
    title: '数据分析',
    description: '详细的使用数据统计和分析，帮助您做出更好的管理决策。'
  }
])

// 滚动到指定部分
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 处理用户下拉菜单命令
const handleUserCommand = async (command) => {
  try {
    if (command === 'logout') {
      await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
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
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 处理登录
const handleLogin = () => {
  router.push('/login')
}

// 处理注册
const handleRegister = () => {
  router.push('/login?mode=register')
}

// 处理开始使用
const handleStart = () => {
  try {
    if (isAuthenticated.value) {
      // 已登录，根据用户角色跳转到对应页面
      if (store.state.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/user')
      }
    } else {
      // 未登录，跳转到登录页面
      router.push('/login')
    }
  } catch (error) {
    ElMessage.error('页面跳转失败，请重试')
  }
}


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
.demo-btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.start-btn:hover,
.demo-btn:hover {
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