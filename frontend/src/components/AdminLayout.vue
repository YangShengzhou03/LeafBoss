<template>
  <div class="admin-layout">
      <!-- 顶部导航栏 -->
      <header class="admin-header">
        <div class="header-left">
          <h1 class="logo">枫叶卡管 - 卡密管理系统</h1>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="user-info">
              <el-avatar :size="32" :src="userAvatar">
                <el-icon>
                  <User />
                </el-icon>
              </el-avatar>
              <span class="username">{{ store.state.user?.username || '管理员' }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <div class="admin-container">
        <!-- 侧边栏 -->
        <aside class="admin-sidebar">
          <el-menu 
            :default-active="activeMenu" 
            class="admin-menu" 
            router 
            unique-opened
          >
            <el-menu-item index="/admin">
              <el-icon>
                <Monitor />
              </el-icon>
              <template #title>管理员仪表盘</template>
            </el-menu-item>

            <el-menu-item index="/admin/users">
              <el-icon>
                <User />
              </el-icon>
              <template #title>用户管理</template>
            </el-menu-item>

            <!-- 商品管理展开菜单 -->
            <el-sub-menu index="product-management">
              <template #title>
                <el-icon>
                  <Goods />
                </el-icon>
                <span>商品管理</span>
              </template>
              <el-menu-item index="/admin/products">
                <el-icon>
                  <List />
                </el-icon>
                <template #title>商品列表</template>
              </el-menu-item>
              <el-menu-item index="/admin/product-specs">
                <el-icon>
                  <Operation />
                </el-icon>
                <template #title>规格管理</template>
              </el-menu-item>
            </el-sub-menu>

            <!-- 卡密管理展开菜单 -->
            <el-sub-menu index="card-management">
              <template #title>
                <el-icon>
                  <Key />
                </el-icon>
                <span>卡密管理</span>
              </template>
              <el-menu-item index="/admin/card-keys">
                <el-icon>
                  <List />
                </el-icon>
                <template #title>卡密列表</template>
              </el-menu-item>
              <el-menu-item index="/admin/card-verify">
                <el-icon>
                  <Check />
                </el-icon>
                <template #title>卡密验证</template>
              </el-menu-item>
            </el-sub-menu>



            <el-menu-item index="/admin/logs">
              <el-icon>
                <Document />
              </el-icon>
              <template #title>操作日志</template>
            </el-menu-item>
          </el-menu>
        </aside>

        <!-- 主内容区域 -->
        <main class="admin-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, ArrowDown, Monitor, Document, Key, Goods, List, Operation, Check } from '@element-plus/icons-vue'
import store from '@/utils/store.js'

const router = useRouter()
const route = useRoute()

// 当前使用的菜单项
const activeMenu = computed(() => route.path)

// 用户头像
const userAvatar = computed(() => {
  return store.state.user?.avatar || ''
})

// 处理下拉菜单命令
const handleCommand = async (command) => {
  try {
    if (command === 'logout') {
      // 确认退出登录
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
      router.push('/login')
    } else if (command === 'profile') {
      // 跳转到个人资料页面
      router.push('/profile')
    }
  } catch (error) {
    // 用户取消操作或发生错误
    if (error !== 'cancel') {
      console.error('操作失败:', error)
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 组件挂载时初始化
onMounted(async () => {
  try {
    // 确保用户信息已加载
    if (!store.state.user) {
      await store.fetchCurrentUser()
    }
    
    // 等待用户信息加载完成
    await nextTick()
  } catch (error) {
    console.error('初始化失败:', error)
    ElMessage.error('初始化失败，请刷新页面重试')
  }
})
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.admin-header {
  height: 64px;
  background-color: #304156;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #ddd;
  position: relative;
  z-index: 10;
}

.header-left .logo {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.header-right .user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.header-right .user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  margin: 0 10px;
  font-weight: 500;
}

.admin-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.admin-sidebar {
  width: 240px;
  background-color: #2c3e50;
  border-right: 1px solid #34495e;
}

.admin-menu {
  height: 100%;
  border-right: none;
  background-color: transparent;
}

.admin-menu :deep(.el-menu-item),
.admin-menu :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
  color: #bdc3c7;
  margin: 0;
  border-radius: 0;
}

.admin-menu :deep(.el-menu-item:hover),
.admin-menu :deep(.el-sub-menu__title:hover) {
  background-color: #34495e;
  color: #fff;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background-color: #3498db;
  color: #fff;
  font-weight: 500;
}

.admin-menu :deep(.el-sub-menu .el-menu-item) {
  background-color: #2c3e50;
  padding-left: 50px !important;
}

.admin-menu :deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #34495e;
}

.admin-menu :deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: #2980b9;
}

.admin-menu :deep(.el-menu-item .el-icon),
.admin-menu :deep(.el-sub-menu__title .el-icon) {
  font-size: 18px;
  margin-right: 12px;
  color: inherit;
}

.admin-main {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片容器统一样式 */
.admin-main :deep(.el-card) {
  border-radius: 6px;
  border: 1px solid #e6e8eb;
  overflow: hidden;
  margin-bottom: 16px;
}

.admin-main :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e6e8eb;
  background-color: #fafbfc;
}

.admin-main :deep(.el-card__body) {
  padding: 20px;
}

/* 表单间距优化 */
.admin-main :deep(.el-form) {
  margin-bottom: 16px;
}

.admin-main :deep(.el-form-item) {
  margin-bottom: 16px;
}

.admin-main :deep(.el-table) {
  margin-top: 16px;
}

.admin-main :deep(.pagination) {
  margin-top: 20px;
}

.admin-main :deep(.card-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 200px;
  }
  
  .admin-menu :deep(.el-menu-item) {
    margin: 0;
  }
}

@media (max-width: 768px) {
  .admin-header {
    height: 60px;
    padding: 0 16px;
  }

  .header-left .logo {
    font-size: 18px;
  }
  
  .username {
    display: none;
  }
  
  .admin-sidebar {
    width: 240px;
  }
  
  .admin-menu :deep(.el-menu-item) {
    margin: 0;
    padding: 0 20px !important;
  }
  
  .admin-menu :deep(.el-menu-item span) {
    display: inline;
  }
  
  .admin-menu :deep(.el-menu-item .el-icon) {
    margin-right: 12px;
    font-size: 18px;
  }

  .admin-main {
    padding: 16px;
  }
  
  .admin-main :deep(.el-card) {
    margin-bottom: 12px;
  }
  
  .admin-main :deep(.el-card__header) {
    padding: 14px 16px;
  }
  
  .admin-main :deep(.el-card__body) {
    padding: 16px;
  }
  
  .admin-main :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .admin-header {
    padding: 0 12px;
  }
  
  .header-left .logo {
    font-size: 16px;
  }
  
  .admin-main {
    padding: 12px;
  }
  
  .admin-main :deep(.el-card) {
    margin-bottom: 8px;
  }
  
  .admin-main :deep(.el-card__header) {
    padding: 12px;
  }
  
  .admin-main :deep(.el-card__body) {
    padding: 12px;
  }
  
  .admin-main :deep(.el-form-item) {
    margin-bottom: 8px;
  }
}
</style>