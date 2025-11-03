<template>
  <el-container class="app-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarWidth">
      <div class="logo">
        <el-icon><ElementPlus /></el-icon>
        <span v-show="!isCollapsed">Leaf Card</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        router
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-sub-menu index="/product">
          <template #title>
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/product/goods">
            <el-icon><Goods /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="/product/specifications">
            <el-icon><List /></el-icon>
            <span>规格管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/cards">
          <template #title>
            <el-icon><CreditCard /></el-icon>
            <span>卡密管理</span>
          </template>
          <el-menu-item index="/cards/list">
            <el-icon><List /></el-icon>
            <span>卡密列表</span>
          </el-menu-item>
          <el-menu-item index="/cards/validation">
            <el-icon><Search /></el-icon>
            <span>卡密验证</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            :icon="isCollapsed ? 'Expand' : 'Fold'"
            @click="toggleSidebar"
            circle
            size="small"
          />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" :icon="User" />
              <span>管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 页面内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()

const isCollapsed = computed(() => !appStore.sidebarOpened)
const sidebarWidth = computed(() => isCollapsed.value ? '64px' : '200px')
const activeMenu = computed(() => route.path)
const currentRouteTitle = computed(() => route.meta.title || '页面')

const toggleSidebar = () => {
  appStore.toggleSidebar()
}
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #2b2f3a;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.sidebar-menu {
  border: none;
  height: calc(100vh - 60px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
}

:deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 8px;
}
</style>
