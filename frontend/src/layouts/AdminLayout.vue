<template>
  <el-container class="admin-layout">
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
                <el-dropdown-item divided class="menu-item logout" @click="handleLogout">
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
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  User,
  ArrowDown,
  Setting,
  SwitchButton,
  ElementPlus,
  DataBoard,
  Goods,
  List,
  CreditCard,
  Document,
  Search
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)
const currentRouteTitle = computed(() => route.meta.title || '页面')

// 用户信息
const userAvatar = ref('')

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await authStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('退出登录失败')
    }
  }
}
</script>

<style scoped>
.admin-layout {
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
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
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
  border-radius: 4px;
  min-width: 160px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.user-avatar {
  flex-shrink: 0;
  border: 2px solid #e6e6e6;
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
  flex-shrink: 0;
}

.main-content {
  background-color: #f5f7fa;
  padding: 24px;
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
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  padding: 8px 0;
  min-width: 160px;
}

:deep(.user-menu .menu-item) {
  padding: 10px 16px;
  line-height: 1.4;
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