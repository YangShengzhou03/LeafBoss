<template>
  <div id="app">
    <div v-if="isLoading" class="app-loading">
      <el-icon class="is-loading" size="32"><Loading /></el-icon>
      <p>正在加载应用...</p>
    </div>
    <div v-else-if="hasError" class="app-error">
      <el-result
        icon="error"
        title="应用加载失败"
        :sub-title="errorMessage"
      >
        <template #extra>
          <el-button type="primary" @click="retryLoading">重试</el-button>
        </template>
      </el-result>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted, onErrorCaptured } from 'vue'
import store from './utils/store.js'
import { Loading } from '@element-plus/icons-vue'

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

// 捕获子组件错误
onErrorCaptured((err) => {
  console.error('应用错误:', err)
  hasError.value = true
  errorMessage.value = err.message || '未知错误'
  return false // 阻止错误继续向上传播
})

// 重试加载
const retryLoading = async () => {
  hasError.value = false
  isLoading.value = true
  
  try {
    await store.init()
    isLoading.value = false
  } catch (error) {
    hasError.value = true
    errorMessage.value = error.message || '初始化失败'
    isLoading.value = false
  }
}

// 应用初始化
onMounted(async () => {
  try {
    // 检查store是否有init方法，如果没有则直接设置加载完成
    if (typeof store.init === 'function') {
      await store.init()
    }
    isLoading.value = false
  } catch (error) {
    console.error('应用初始化失败:', error)
    hasError.value = true
    errorMessage.value = error.message || '初始化失败'
    isLoading.value = false
  }
})
</script>

<style>
/* 全局样式重置和基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303133;
  background-color: #f5f7fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-loading, .app-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.app-loading p {
  margin-top: 20px;
  color: #909399;
}

/* 统一的颜色变量 */
:root {
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
  
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --text-placeholder: #C0C4CC;
  
  --border-base: #DCDFE6;
  --border-light: #E4E7ED;
  --border-lighter: #EBEEF5;
  --border-extra-light: #F2F6FC;
}

/* 统一的间距系统 */
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
}

/* 统一的阴影系统 */
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-base: 0 2px 4px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.16);
  --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.16);
}

/* 响应式断点 */
:root {
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}
</style>