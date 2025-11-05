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

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = err.message || '未知错误'
  return false
})

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

onMounted(async () => {
  try {
    if (typeof store.init === 'function') {
      await store.init()
    }
    isLoading.value = false
  } catch (error) {
    hasError.value = true
    errorMessage.value = error.message || '初始化失败'
    isLoading.value = false
  }
})
</script>

<style>
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

:root {
  --primary-color: #667eea;
  --primary-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --info-color: #909399;
  
  --text-primary: #2c3e50;
  --text-regular: #5a6c7d;
  --text-secondary: #7f8c8d;
  --text-placeholder: #aab7c4;
  
  --border-base: #e1e8ed;
  --border-light: #e4e7ed;
  --border-lighter: #ebeeF5;
  --border-extra-light: #f2f6fc;
}

:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
}

:root {
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-base: 0 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 8px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 16px 32px rgba(0, 0, 0, 0.16);
  --shadow-xl: 0 24px 48px rgba(0, 0, 0, 0.2);
}

:root {
  --radius-sm: 4px;
  --radius-base: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

:root {
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #e2e8f0;
    --text-regular: #cbd5e0;
    --text-secondary: #a0aec0;
    --text-placeholder: #718096;
  }
}
</style>