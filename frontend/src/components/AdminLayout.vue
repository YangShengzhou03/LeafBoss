<template>
  <el-watermark :content="watermarkText" :font="{ color: 'rgba(0, 0, 0, 0.15)', fontSize: 16 }" :z-index="9"
    :rotate="-15" :gap="[100, 100]">
    <div class="admin-layout">
      <header class="admin-header">
        <div class="header-left">
          <el-button class="mobile-toggle" @click="showDrawer = true" v-if="isMobile">
            <el-icon><Menu /></el-icon>
          </el-button>
          <h1 class="logo">LEAFBOSS <span class="logo-sub">- 业务运营支撑系统</span></h1>
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
        <!-- Desktop Sidebar -->
        <aside class="admin-sidebar" v-if="!isMobile">
          <el-menu :default-active="activeMenu" class="admin-menu" router unique-opened>
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
                <span>人员管理</span>
              </template>
              <el-menu-item index="/admin/admins">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <template #title>管理人员</template>
              </el-menu-item>
              <el-menu-item index="/admin/users">
                <el-icon>
                  <User />
                </el-icon>
                <template #title>用户管理</template>
              </el-menu-item>
            </el-sub-menu>

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
                <span>海投助手</span>
              </template>
              <el-menu-item index="/admin/jobs/companies">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
                <template #title>公司管理</template>
              </el-menu-item>
              <el-menu-item index="/admin/jobs/boss-reviews">
                <el-icon>
                  <ChatDotRound />
                </el-icon>
                <template #title>评论管理</template>
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

        <!-- Mobile Drawer Sidebar -->
        <el-drawer v-model="showDrawer" direction="ltr" size="240px" :with-header="false" class="mobile-drawer"
          :body-style="{ padding: '0', backgroundColor: '#2c3e50' }" v-if="isMobile">
          <div class="drawer-header">
            <h2 class="drawer-logo">LEAFBOSS</h2>
          </div>
          <el-menu :default-active="activeMenu" class="admin-menu" router unique-opened @select="showDrawer = false">
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
                <span>人员管理</span>
              </template>
              <el-menu-item index="/admin/admins">
                <el-icon>
                  <UserFilled />
                </el-icon>
                <template #title>管理人员</template>
              </el-menu-item>
              <el-menu-item index="/admin/users">
                <el-icon>
                  <User />
                </el-icon>
                <template #title>用户管理</template>
              </el-menu-item>
            </el-sub-menu>

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
                <span>海投助手</span>
              </template>
              <el-menu-item index="/admin/jobs/companies">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
                <template #title>公司管理</template>
              </el-menu-item>
              <el-menu-item index="/admin/jobs/boss-reviews">
                <el-icon>
                  <ChatDotRound />
                </el-icon>
                <template #title>评论管理</template>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/admin/logs">
              <el-icon>
                <Document />
              </el-icon>
              <template #title>操作日志</template>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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

    await nextTick()
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
  z-index: 1001; /* Higher than el-drawer overlay if needed */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-toggle {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 24px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-left .logo {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.logo-sub {
  font-size: 14px;
  font-weight: 400;
  opacity: 0.8;
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
  position: relative;
}

.admin-sidebar {
  width: 240px;
  background-color: #2c3e50;
  border-right: 1px solid #34495e;
  transition: width 0.3s;
  flex-shrink: 0;
}

.admin-menu {
  height: 100%;
  border-right: none;
  background-color: #304156;
}

/* Mobile Drawer Styles */
.mobile-drawer {
  --el-drawer-padding-primary: 0 !important;
}

.mobile-drawer :deep(.el-drawer) {
  background-color: #2c3e50;
}

.drawer-header {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #304156;
  border-bottom: 1px solid #34495e;
}

.drawer-logo {
  margin: 0;
  font-size: 18px;
  color: #fff;
  font-weight: 600;
}

.admin-menu :deep(.el-menu) {
  background-color: #2c3e50;
  border-right: none;
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
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
  width: 100%;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.admin-main :deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #e6e8eb;
  overflow: hidden;
  margin-bottom: 0px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
}

.admin-main :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e6e8eb;
  background-color: #fafbfc;
}

.admin-main :deep(.el-card__body) {
  padding: 20px;
}


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


@media (max-width: 1024px) {
  .admin-sidebar {
    width: 200px;
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

  .logo-sub {
    display: none;
  }

  .username {
    display: none;
  }

  .admin-main {
    padding: 12px;
  }

  .admin-main :deep(.el-card__body) {
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
    padding: 10px;
  }
}
</style>

<style>
/* Global styles to override teleported Element Plus components */
.mobile-drawer .el-drawer__body {
  padding: 0 !important;
  background-color: #2c3e50 !important;
}
</style>