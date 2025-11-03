<template>
  <el-container class="layout-container">
    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobile && !isCollapse" 
      class="mobile-mask" 
      @click="closeSidebar"
    ></div>
    
    <!-- 侧边栏 -->
    <el-aside 
      :width="sidebarWidth" 
      :class="{ 'mobile-sidebar': isMobile }"
    >
      <div class="logo">
        <h2>{{ isCollapse ? '枫' : '枫叶卡管' }}</h2>
      </div>
      <el-menu
        :default-active="$route.path"
        class="sidebar-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <template #title>
            <span>仪表板</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/cards">
          <el-icon><CreditCard /></el-icon>
          <template #title>
            <span>卡管理</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            :icon="isCollapse ? 'Expand' : 'Fold'"
            @click="toggleSidebar"
            circle
            size="small"
            class="sidebar-toggle"
          />
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <!-- 全屏切换 -->
          <el-tooltip content="全屏" placement="bottom">
            <el-button 
              :icon="isFullscreen ? 'FullScreen' : 'FullScreen'" 
              circle 
              size="small"
              @click="toggleFullscreen"
            />
          </el-tooltip>
          
          <!-- 消息通知 -->
          <el-dropdown trigger="click" class="notification-dropdown">
            <el-badge :value="3" class="notification-badge">
              <el-button icon="Bell" circle size="small" />
            </el-badge>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>您有3条新消息</el-dropdown-item>
                <el-dropdown-item divided>查看全部</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 用户信息 -->
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <span class="user-info">
              <el-avatar :size="32" :src="userAvatar" class="user-avatar" />
              <span class="username">{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

// 响应式状态
const isCollapse = computed(() => appStore.sidebar.opened)
const sidebarWidth = computed(() => isCollapse.value ? '64px' : '200px')
const isMobile = ref(false)
const isFullscreen = ref(false)
const screenWidth = ref(0)

// 用户信息
const username = computed(() => userStore.userInfo?.username || '管理员')
const userAvatar = computed(() => userStore.userInfo?.avatar || '')

// 页面标题映射
const currentTitle = computed(() => {
  const titleMap: Record<string, string> = {
    '/dashboard': '仪表板',
    '/cards': '卡管理',
    '/cards/new': '新增卡片',
    '/cards/edit': '编辑卡片',
    '/cards/detail': '卡片详情',
    '/login': '登录',
    '/register': '注册',
    '/404': '页面不存在'
  }
  
  // 从路由元信息获取标题
  const routeTitle = route.meta?.title as string
  return routeTitle || titleMap[route.path] || '枫叶卡管'
})

// 检测屏幕尺寸
const checkScreenSize = () => {
  screenWidth.value = window.innerWidth
  isMobile.value = screenWidth.value < 768
  
  // 移动端自动折叠侧边栏
  if (isMobile.value && !isCollapse.value) {
    appStore.toggleSidebar(true)
  }
}

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 关闭侧边栏（移动端）
const closeSidebar = () => {
  if (isMobile.value) {
    appStore.toggleSidebar(true)
  }
}

// 全屏切换
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await userStore.logout()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        // 用户取消操作
      }
      break
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkScreenSize()
}

// 监听全屏变化
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
}

/* 移动端遮罩层 */
.mobile-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s ease-in-out;
  position: relative;
  z-index: 2000;
}

/* 移动端侧边栏样式 */
.el-aside.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 2000;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.el-aside.mobile-sidebar:not(.el-menu--collapse) {
  transform: translateX(0);
}

.el-aside.mobile-sidebar.el-menu--collapse {
  transform: translateX(-100%);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-bottom: 1px solid #2c3e50;
  transition: all 0.3s;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu {
  border: none;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

/* 头部样式 */
.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.sidebar-toggle {
  transition: all 0.3s;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-dropdown,
.user-dropdown {
  display: flex;
  align-items: center;
}

.notification-badge :deep(.el-badge__content) {
  transform: scale(0.8);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.user-info:hover {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
}

.user-avatar {
  flex-shrink: 0;
}

.username {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    padding: 16px;
  }
}

@media (max-width: 992px) {
  .header {
    padding: 0 16px;
  }
  
  .header-left {
    gap: 12px;
  }
  
  .header-right {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .layout-container {
    min-width: 320px;
  }
  
  .header {
    padding: 0 12px;
    height: 56px;
  }
  
  .header-left {
    gap: 8px;
  }
  
  .breadcrumb {
    font-size: 12px;
  }
  
  .header-right {
    gap: 6px;
  }
  
  .user-info {
    padding: 6px 8px;
  }
  
  .username {
    display: none;
  }
  
  .main-content {
    padding: 12px;
    height: calc(100vh - 56px);
  }
  
  .sidebar-toggle {
    transform: scale(0.9);
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0 8px;
  }
  
  .header-left {
    gap: 6px;
  }
  
  .breadcrumb {
    font-size: 11px;
  }
  
  .header-right {
    gap: 4px;
  }
  
  .user-info {
    padding: 4px 6px;
  }
  
  .main-content {
    padding: 8px;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .header {
    background-color: #1f1f1f;
    border-bottom-color: #2d2d2d;
  }
  
  .main-content {
    background-color: #141414;
  }
  
  .user-info:hover {
    background-color: #2a2a2a;
    border-color: #3a3a3a;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .header {
    border-bottom-width: 2px;
  }
  
  .logo {
    border-bottom-width: 2px;
  }
}

/* 减少动画支持 */
@media (prefers-reduced-motion: reduce) {
  .el-aside,
  .fade-transform-leave-active,
  .fade-transform-enter-active,
  .user-info {
    transition: none;
  }
}
</style>