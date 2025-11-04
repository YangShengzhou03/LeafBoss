<template>
    <div class="user-layout">
        <div class="user-header">
            <div class="header-content">
                <div class="logo-container">
                    <h1>枫叶网盘</h1>
                </div>
            </div>
            <div class="header-actions">
                <div class="user-dropdown" :class="{ 'active': isDropdownOpen }">
                    <div class="user-info" @click="toggleDropdown" aria-haspopup="true" :aria-expanded="isDropdownOpen">
                        <div class="user-avatar">
                            <img :src="currentUser?.avatar || 'https://picsum.photos/id/1005/200/200'" alt="用户头像" class="avatar-image">
                        </div>
                        <div class="user-details">
                            <span class="username" :title="currentUser?.nickname || currentUser?.username || '枫叶用户'">{{ formatLongText(currentUser?.nickname || currentUser?.username || '枫叶用户') }}</span>
                        </div>
                        <i class="dropdown-arrow" :class="{ 'rotate': isDropdownOpen }" aria-hidden="true"></i>
                    </div>
                    <transition name="dropdown">
                        <div class="dropdown-menu" v-show="isDropdownOpen" role="menu">
                            <div class="dropdown-item" @click="handleLogout" role="menuitem">
                                <i class="icon-logout" aria-hidden="true"></i>
                                <span>退出登录</span>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <div class="user-content">
            <nav class="user-content-nav" aria-label="主导航">
                <div class="nav-items">
                    <router-link to="/user" class="nav-item" active-class="active" exact-active-class="active" aria-label="我的文件">
                        <i class="icon-files" aria-hidden="true"></i>
                        <span>我的文件</span>
                    </router-link>
                    <router-link to="/user/dashboard" class="nav-item" active-class="active" aria-label="仪表盘">
                        <i class="icon-dashboard" aria-hidden="true"></i>
                        <span>仪表盘</span>
                    </router-link>
                    <router-link to="/user/shared" class="nav-item" active-class="active" aria-label="共享文件">
                        <i class="icon-share" aria-hidden="true"></i>
                        <span>共享文件</span>
                    </router-link>
                    <router-link to="/user/trash" class="nav-item" active-class="active" aria-label="回收站">
                        <i class="icon-recycle" aria-hidden="true"></i>
                        <span>回收站</span>
                    </router-link>
                    <div class="nav-divider" role="separator"></div>
                    <router-link to="/user/settings" class="nav-item" active-class="active" aria-label="设置">
                        <i class="icon-settings" aria-hidden="true"></i>
                        <span>设置</span>
                    </router-link>
                </div>
                <div class="nav-footer">
                    <div class="storage-info" aria-label="存储空间使用情况">
                        <div class="storage-bar" role="progressbar" :aria-valuenow="storagePercentage" aria-valuemin="0" aria-valuemax="100">
                            <div class="storage-used" :style="{ width: storagePercentage + '%' }"></div>
                        </div>
                        <div class="storage-text">
                            {{ usedStorage }} / {{ totalStorage }}
                        </div>
                    </div>
                </div>
            </nav>
            <main class="user-content-container">
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/utils/store.js'

// 获取路由实例
const router = useRouter()

// 控制下拉菜单的显示状态
const isDropdownOpen = ref(false)

// 切换下拉菜单
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 点击页面其他地方关闭下拉菜单
const closeDropdown = (event) => {
  if (!event.target.closest('.user-dropdown')) {
    isDropdownOpen.value = false
  }
}

// 获取存储信息，避免重复访问
const storageInfo = computed(() => store.state.storageInfo)

// 计算存储百分比
const storagePercentage = computed(() => {
  const { usagePercentage } = storageInfo.value
  // 如果后端已经计算了百分比，直接使用；否则自己计算
  if (usagePercentage !== undefined) {
    return Math.min(100, Math.round(usagePercentage))
  }
  
  // 兼容旧的计算方式
  const { totalStorageGB, usedStorageGB } = storageInfo.value
  if (!totalStorageGB || totalStorageGB <= 0) return 0
  return Math.min(100, Math.round((usedStorageGB / totalStorageGB) * 100))
})

// 格式化存储显示
const totalStorage = computed(() => {
  const { totalStorageGB } = storageInfo.value
  return `${(totalStorageGB || 0).toFixed(1)} GB`
})

const usedStorage = computed(() => {
  const { usedStorageGB } = storageInfo.value
  return `${(usedStorageGB || 0).toFixed(1)} GB`
})

// 格式化长文本，如果超过指定长度则显示为XXX****XXX形式
const formatLongText = (text, maxLength = 15) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  const startLength = Math.floor(maxLength / 2)
  const endLength = maxLength - startLength - 4 // 减去4是因为中间有4个星号
  return text.substring(0, startLength) + '****' + text.substring(text.length - endLength)
}

// 获取用户信息
const currentUser = computed(() => {
  return store.state.user
})

// 监听用户信息变化，当用户信息更新后自动刷新存储信息
watch(currentUser, async (newUser) => {
  if (newUser) {
    await refreshStorageInfo()
  }
}, { immediate: false })

// 监听用户信息变化，确保用户名和邮箱正确显示
watch(() => store.state.user, (newUser) => {
  if (newUser) {
  }
}, { deep: true, immediate: true })

// 退出登录
const handleLogout = async () => {
  try {
    isDropdownOpen.value = false
    await store.logout()
    // 使用路由跳转到首页
    router.push('/')
  } catch (error) {
    // 即使退出失败也清除本地状态并跳转
    store.clearUser()
    router.push('/')
  }
}

// 刷新存储信息
const refreshStorageInfo = async () => {
  try {
    await store.fetchStorageInfo()
  } catch (error) {
    // 可以在这里添加用户提示，比如使用 toast 或 alert
  }
}

// 组件挂载时刷新存储信息和用户信息
onMounted(async () => {
  // 确保在组件挂载时获取最新的用户信息和存储信息
  try {
    // 检查是否已有用户信息，如果没有则获取
    if (!store.state.user) {
      await store.fetchCurrentUser()
    }
    
    // 然后获取存储信息
    await refreshStorageInfo()
  } catch (error) {
    // 如果获取失败，可能是token无效，尝试重新初始化
    await store.init()
  }
  // 添加全局点击事件监听器，用于关闭下拉菜单
  document.addEventListener('click', closeDropdown)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.user-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
    color: #333;
}

.user-header {
    padding: 12px 25px;
    background-color: #fff;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    flex-direction: column;
}

.logo-container {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.logo-container i {
    font-size: 28px;
    margin-right: 10px;
}

.logo-container h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: #409EFF;
}

.subtitle {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
    color: #606266;
}

.header-actions {
    display: flex;
    align-items: center;
}

.user-dropdown {
    position: relative;
}

.user-info {
    display: flex;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.user-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    margin-right: 12px;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
    transition: all 0.3s ease;
    overflow: hidden;
}

.user-avatar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.username {
    color: #303133;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    position: relative;
}

.username:hover::after {
    content: attr(title);
    position: absolute;
    top: -30px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
}

.user-email {
    font-size: 12px;
    color: #909399;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
    position: relative;
}

.user-email:hover::after {
    content: attr(title);
    position: absolute;
    top: -30px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
}

.dropdown-arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #909399;
    margin-left: 8px;
    transition: transform 0.3s ease;
}

.dropdown-arrow.rotate {
    transform: rotate(180deg);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 12px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    min-width: 180px;
    z-index: 1000;
    overflow: hidden;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.8);
}

.dropdown-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #606266;
}

.dropdown-item:hover {
    background-color: #f5f7fa;
    color: #F56C6C;
}

.dropdown-item i {
    margin-right: 12px;
    font-size: 16px;
}

.user-content {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.user-content-nav {
    width: 240px;
    background-color: #fff;
    border-right: 1px solid #f0f2f5;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
}

.nav-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px 0;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 14px 24px;
    cursor: pointer;
    text-decoration: none;
    color: #333;
    transition: all 0.3s ease;
    position: relative;
    font-weight: 500;
    border-radius: 0 24px 24px 0;
    margin-right: 12px;
}

.nav-item:hover {
    color: #409EFF;
    background-color: rgba(64, 158, 255, 0.08);
}

.nav-item.active {
    color: #409EFF;
    font-weight: 600;
    background-color: rgba(64, 158, 255, 0.1);
}

.nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    height: 60%;
    width: 4px;
    background-color: #409EFF;
    transform: translateY(-50%);
    border-radius: 0 4px 4px 0;
}

.nav-item i {
    font-size: 18px;
    width: 24px;
    margin-right: 15px;
    text-align: center;
    color: #606266;
    transition: color 0.3s ease;
}

.nav-item:hover i {
    color: #409EFF;
}

.nav-divider {
    height: 1px;
    background-color: #e9ecef;
    margin: 10px 20px;
}

.nav-footer {
    padding: 20px;
    border-top: 1px solid #f0f2f5;
    background-color: rgba(64, 158, 255, 0.02);
}

.storage-info {
    width: 100%;
}

.storage-bar {
    height: 8px;
    background-color: #f0f2f5;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.storage-used {
    height: 100%;
    background: linear-gradient(90deg, #409EFF, #79bbff);
    border-radius: 4px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(64, 158, 255, 0.3);
}

.storage-text {
    font-size: 12px;
    color: #606266;
    text-align: center;
    font-weight: 500;
}

.user-content-container {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #f8fafc;
    transition: all 0.3s ease;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* 下拉菜单动画 */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
    transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}

/* 添加卡片效果 */
.user-content-container > div {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 24px;
    min-height: 92%;
    transition: all 0.3s ease;
}

.user-content-container > div:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .user-header {
        padding: 12px 15px;
    }
    
    .logo-container h1 {
        font-size: 20px;
    }
    
    .subtitle {
        font-size: 12px;
    }
    
    .user-info span {
        display: none;
    }
    
    .logout-btn span {
        display: none;
    }
    
    .user-content-nav {
        width: 220px;
    }
    
    .user-content-container {
        padding: 10px;
    }
    
    /* 添加移动端卡片效果 */
    .user-content-container > div {
        padding: 12px;
        border-radius: 8px;
    }
}
</style>
