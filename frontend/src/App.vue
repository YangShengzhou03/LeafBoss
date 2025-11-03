<template>
  <el-container class="app-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar-container">
      <div class="logo">
        <el-icon><ElementPlus /></el-icon>
        <span class="logo-text">Leaf Card</span>
      </div>
      <el-menu
        :default-active="activeMenu"
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
          <el-menu-item index="/cards/logs">
            <el-icon><Document /></el-icon>
            <span>卡密记录</span>
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
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <!-- 通知图标 -->
          <el-badge :value="3" :max="99" class="notification-badge">
            <el-button text circle class="header-icon">
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>
          
          <!-- 全屏切换 -->
          <el-tooltip content="全屏" placement="bottom">
            <el-button text circle class="header-icon">
              <el-icon><FullScreen /></el-icon>
            </el-button>
          </el-tooltip>
          
          <!-- 主题切换 -->
          <el-tooltip content="切换主题" placement="bottom">
            <el-button text circle class="header-icon">
              <el-icon><Moon /></el-icon>
            </el-button>
          </el-tooltip>
          
          <!-- 用户信息 -->
          <el-dropdown trigger="click" class="user-dropdown">
            <div class="user-info">
              <el-avatar :size="36" :src="userAvatar" class="user-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="user-details">
                <span class="user-name">管理员</span>
                <span class="user-role">超级管理员</span>
              </div>
              <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-menu">
                <el-dropdown-item class="menu-item">
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item class="menu-item">
                  <el-icon><Setting /></el-icon>
                  <span>系统设置</span>
                </el-dropdown-item>
                <el-dropdown-item class="menu-item">
                  <el-icon><Help /></el-icon>
                  <span>帮助文档</span>
                </el-dropdown-item>
                <el-dropdown-item divided class="menu-item logout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Bell,
  FullScreen,
  Moon,
  User,
  ArrowDown,
  Setting,
  Help,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)
const currentRouteTitle = computed(() => route.meta.title || '页面')

// 用户信息
const userAvatar = ref('')
</script>

<style scoped>
.app-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar-container {
  position: relative;
  z-index: 100;
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

.logo-text {
  white-space: nowrap;
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.header-icon:hover {
  background-color: #f5f7fa;
  color: #409eff;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-icon:active {
  transform: scale(0.95);
}

.notification-badge {
  margin-right: 0;
}

.notification-badge :deep(.el-badge__content) {
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #409eff;
}

.user-dropdown {
  margin-left: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.user-info:hover {
  background-color: #f0f2f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.user-avatar {
  flex-shrink: 0;
  border: 2px solid #e6e6e6;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info:hover .user-avatar {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  margin-top: 2px;
}

.dropdown-arrow {
  color: #c0c4cc;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.user-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

:deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;
  position: relative;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 8px;
  flex-shrink: 0;
}

/* 用户下拉菜单样式 */
:deep(.user-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  padding: 8px 0;
  min-width: 160px;
}

:deep(.user-menu .menu-item) {
  padding: 10px 16px;
  line-height: 1.4;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.user-menu .menu-item:hover) {
  background-color: #f5f7fa;
}

:deep(.user-menu .menu-item .el-icon) {
  font-size: 16px;
  color: #606266;
}

:deep(.user-menu .menu-item.logout) {
  color: #f56c6c;
}

:deep(.user-menu .menu-item.logout .el-icon) {
  color: #f56c6c;
}

/* 优化子菜单过渡效果 */
:deep(.el-sub-menu__title) {
  height: 56px;
  line-height: 56px;
}

:deep(.el-sub-menu__title .el-icon) {
  margin-right: 8px;
  flex-shrink: 0;
}
</style>
