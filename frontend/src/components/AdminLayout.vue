<template>
  <el-watermark :content="watermarkText" :font="{ color: 'rgba(0, 0, 0, 0.15)', fontSize: 16 }" :z-index="9"
    :rotate="-15" :gap="[100, 100]">
    <div class="admin-layout">
      <header class="admin-header">
        <div class="header-left">
          <el-button class="mobile-toggle" @click="showDrawer = true" v-if="isMobile">
            <el-icon><Menu /></el-icon>
          </el-button>
          <h1 class="logo">LEAF-BOSS</h1>
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
        <aside class="admin-sidebar" v-if="!isMobile">
          <el-menu :default-active="activeMenu" class="admin-menu" router unique-opened
            background-color="#ffffff" text-color="#061b31" active-text-color="#533afd">
            <el-menu-item index="/admin">
              <el-icon>
                <Monitor />
              </el-icon>
              <template #title>管理员仪表盘</template>
            </el-menu-item>

            <el-sub-menu index="personnel-management">
              <template #title>
                <el-icon>
                  <User />
                </el-icon>
                <span>用户操作</span>
              </template>
              <el-menu-item index="/admin/admins">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <template #title>管理员列表</template>
              </el-menu-item>
              <el-menu-item index="/admin/users">
                <el-icon>
                  <User />
                </el-icon>
                <template #title>用户列表</template>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="product-management">
              <template #title>
                <el-icon>
                  <Goods />
                </el-icon>
                <span>商品操作</span>
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

            <el-sub-menu index="card-management">
              <template #title>
                <el-icon>
                  <Key />
                </el-icon>
                <span>卡密操作</span>
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
              <el-menu-item index="/admin/card-generate">
                <el-icon>
                  <Plus />
                </el-icon>
                <template #title>卡密生成</template>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="jobs-management">
              <template #title>
                <el-icon>
                  <Briefcase />
                </el-icon>
                <span>海投操作</span>
              </template>
              <el-menu-item index="/admin/jobs/companies">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
                <template #title>公司操作</template>
              </el-menu-item>
              <el-menu-item index="/admin/jobs/boss-reviews">
                <el-icon>
                  <ChatDotRound />
                </el-icon>
                <template #title>评论操作</template>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/admin/logs">
              <el-icon>
                <Document />
              </el-icon>
              <template #title>系统操作</template>
            </el-menu-item>
          </el-menu>
        </aside>



        <el-drawer v-model="showDrawer" direction="ltr" size="260px" :with-header="false" class="mobile-drawer"
          :body-style="{ padding: 0, backgroundColor: '#ffffff' }" v-if="isMobile">
          <div class="drawer-header">
            <h2 class="drawer-logo">LEAF-BOSS</h2>
          </div>
          <el-menu :default-active="activeMenu" class="admin-menu" router unique-opened @select="showDrawer = false"
            background-color="#ffffff" text-color="#061b31" active-text-color="#533afd">
            <el-menu-item index="/admin">
              <el-icon>
                <Monitor />
              </el-icon>
              <template #title>管理员仪表盘</template>
            </el-menu-item>

            <el-sub-menu index="personnel-management">
              <template #title>
                <el-icon>
                  <User />
                </el-icon>
                <span>用户操作</span>
              </template>
              <el-menu-item index="/admin/admins">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <template #title>管理员列表</template>
              </el-menu-item>
              <el-menu-item index="/admin/users">
                <el-icon>
                  <User />
                </el-icon>
                <template #title>用户列表</template>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="product-management">
              <template #title>
                <el-icon>
                  <Goods />
                </el-icon>
                <span>商品操作</span>
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

            <el-sub-menu index="card-management">
              <template #title>
                <el-icon>
                  <Key />
                </el-icon>
                <span>卡密操作</span>
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
              <el-menu-item index="/admin/card-generate">
                <el-icon>
                  <Plus />
                </el-icon>
                <template #title>卡密生成</template>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="jobs-management">
              <template #title>
                <el-icon>
                  <Briefcase />
                </el-icon>
                <span>海投操作</span>
              </template>
              <el-menu-item index="/admin/jobs/companies">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
                <template #title>公司操作</template>
              </el-menu-item>
              <el-menu-item index="/admin/jobs/boss-reviews">
                <el-icon>
                  <ChatDotRound />
                </el-icon>
                <template #title>评论操作</template>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/admin/logs">
              <el-icon>
                <Document />
              </el-icon>
              <template #title>系统操作</template>
            </el-menu-item>
          </el-menu>
        </el-drawer>

        <main class="admin-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </el-watermark>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, UserFilled, ArrowDown, Monitor, Document, Key, Goods, List, Operation, Check, Plus, Briefcase, OfficeBuilding, ChatDotRound, Menu } from '@element-plus/icons-vue'
import store from '@/utils/store.js'

const router = useRouter()
const route = useRoute()

const isMobile = ref(false)
const showDrawer = ref(false)

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    showDrawer.value = false
  }
}

const activeMenu = computed(() => route.path)

const userAvatar = computed(() => {
  return store.state.user?.avatar || ''
})

const watermarkText = computed(() => {
  const user = store.state.user
  if (user?.email) {
    return user.email
  }
  return 'LEAF-BOSS'
})

const handleCommand = async (command) => {
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
      router.push('/login')
    } else if (command === 'profile') {
      router.push('/admin/profile')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请重试')
    }
  }
}

onMounted(async () => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
  try {
    if (!store.state.user) {
      await store.fetchCurrentUser()
    }
  } catch (error) {
    ElMessage.error('初始化失败，请刷新页面重试')
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-feature-settings: "ss01";
}

.admin-header {
  height: 48px;
  background-color: #ffffff;
  color: #061b31;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: relative;
  z-index: 1001;
  border-bottom: 1px solid #e5edf5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-toggle {
  background: transparent;
  border: none;
  color: #061b31;
  font-size: 24px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.mobile-toggle:hover {
  background-color: rgba(83, 58, 253, 0.06);
}

.header-left .logo {
  margin: 0;
  font-size: 20px;
  font-weight: 400;
  color: #533afd;
  letter-spacing: -0.2px;
}

.header-right .user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #061b31;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.header-right .user-info:hover {
  background-color: rgba(83, 58, 253, 0.06);
}

.username {
  margin: 0 10px;
  font-weight: 400;
  font-size: 14px;
  color: #061b31;
}

.admin-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.admin-sidebar {
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e5edf5;
  transition: width 0.3s;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

/* 滚动条样式 */
.admin-sidebar::-webkit-scrollbar {
  width: 6px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.admin-menu {
  height: 100%;
  padding: 8px;
  border-right: none;
}

/* 菜单项圆角优化 */
.admin-menu :deep(.el-menu-item) {
  margin: 2px 4px;
  border-radius: 8px !important;
}

.admin-menu :deep(.el-sub-menu__title) {
  margin: 2px 4px;
  border-radius: 8px !important;
}

/* 悬停效果 */
.admin-menu :deep(.el-menu-item:hover),
.admin-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(83, 58, 253, 0.06) !important;
}

/* 激活状态优化 */
.admin-menu :deep(.el-menu-item.is-active) {
  background-color: rgba(83, 58, 253, 0.1) !important;
}

/* 子菜单容器圆角 */
.admin-menu :deep(.el-sub-menu .el-menu) {
  margin: 4px 8px;
  border-radius: 8px;
  background: transparent !important;
}

/* 子菜单项样式 */
.admin-menu :deep(.el-sub-menu .el-menu-item) {
  margin: 1px 4px;
  border-radius: 6px !important;
  background-color: transparent !important;
}

/* 子菜单项悬停 */
.admin-menu :deep(.el-sub-menu .el-menu-item:hover) {
  background-color: rgba(83, 58, 253, 0.06) !important;
}

/* 子菜单项激活 */
.admin-menu :deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: rgba(83, 58, 253, 0.1) !important;
}

.mobile-drawer {
  --el-drawer-padding-primary: 0;
}

.drawer-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5edf5;
}

.drawer-logo {
  margin: 0;
  font-size: 18px;
  color: #533afd;
  font-weight: 400;
  letter-spacing: -0.18px;
}

.admin-main {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  background-color: #f8fafc;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .admin-sidebar {
    width: 180px;
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

  .admin-main {
    padding: 12px;
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
    padding: 8px;
  }
}
</style>
