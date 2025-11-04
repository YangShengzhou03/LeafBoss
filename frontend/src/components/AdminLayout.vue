<template>
  <el-watermark v-bind="watermarkOptions">
    <div class="admin-layout">
      <!-- 顶部导航栏 -->
      <header class="admin-header">
        <div class="header-left">
          <h1 class="logo">枫叶卡管 - 管理员控制台</h1>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userAvatar">
                <el-icon>
                  <User />
                </el-icon>
              </el-avatar>
              <span class="username">{{ store.state.user?.nickname || store.state.user?.email || '管理员' }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="userMode">切换到用户模式</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <div class="admin-container">
        <!-- 侧边栏 -->
        <aside class="admin-sidebar">
          <el-menu :default-active="activeMenu" class="admin-menu" router unique-opened>
            <el-menu-item index="/admin">
              <el-icon>
                <Monitor />
              </el-icon>
              <span>管理员仪表盘</span>
            </el-menu-item>

            <el-menu-item index="/admin/users">
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </el-menu-item>

            <el-menu-item index="/admin/system">
              <el-icon>
                <Setting />
              </el-icon>
              <span>系统设置</span>
            </el-menu-item>

            <el-menu-item index="/admin/logs">
              <el-icon>
                <Document />
              </el-icon>
              <span>操作日志</span>
            </el-menu-item>
            
            <el-menu-item index="/admin/card-keys">
              <el-icon>
                <Key />
              </el-icon>
              <span>卡密管理</span>
            </el-menu-item>
          </el-menu>
        </aside>

        <!-- 主内容区域 -->
        <main class="admin-main">
          <router-view />
        </main>
      </div>
    </div>
  </el-watermark>
</template>

<script setup>
import { ref, computed, onMounted, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, ArrowDown, Monitor, Setting, Document, Key } from '@element-plus/icons-vue'
import store from '@/utils/store.js'

// 控制水印显示
const showWatermark = ref(false)

const router = useRouter()
const route = useRoute()

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 用户头像
const userAvatar = computed(() => {
  return store.state.user?.avatar || ''
})

// 水印内容
const watermarkContent = computed(() => {
  const content = store.state.user?.email || store.state.user?.nickname || '管理员'
  return content
})

// 水印字体配置
const watermarkFont = reactive({
  color: 'rgba(0, 0, 0, 0.1)',
  fontSize: 16,
  fontWeight: 'normal'
})

// 水印配置选项
const watermarkOptions = reactive({
  content: watermarkContent,
  font: watermarkFont,
  width: 180,
  height: 80,
  rotate: -20,
  gap: [60, 60],
  offset: [30, 30],
  zIndex: 9999
})

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    // 退出登录
    store.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } else if (command === 'userMode') {
    // 切换到用户模式
    router.push('/user')
  }
}

// 组件挂载时刷新存储信息
onMounted(async () => {
  // 确保用户信息已加载
  if (!store.state.user) {
    await store.fetchCurrentUser()
  }
  
  // 等待用户信息加载完成后显示水印
  await nextTick()
  showWatermark.value = true
})
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.admin-header {
  height: 60px;
  background-color: #304156;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
}

.header-left .logo {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}

.header-right .user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #fff;
}

.username {
  margin: 0 8px;
}

.admin-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.admin-sidebar {
  width: 220px;
  background-color: #304156;
  border-right: 1px solid #e6e6e6;
}

.admin-menu {
  height: 100%;
  border-right: none;
  background-color: transparent;
}

.admin-menu :deep(.el-menu-item) {
  height: 46px;
  line-height: 46px;
  color: #bdc3c7;
}

.admin-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background-color: #409EFF;
  color: #fff;
}

.admin-menu :deep(.el-menu-item .el-icon) {
  font-size: 16px;
  margin-right: 8px;
}

.admin-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

/* 卡片容器统一样式 */
.admin-main :deep(.el-card) {
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.admin-main :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fafafa;
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
@media (max-width: 768px) {
  .admin-sidebar {
    width: 200px;
  }

  .admin-header {
    padding: 0 16px;
  }

  .header-left .logo {
    font-size: 16px;
  }

  .admin-main {
    padding: 16px;
  }
}
</style>
