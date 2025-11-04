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
import { useRouter } from 'vue-router'
import store from './utils/store.js'
import { Loading } from '@element-plus/icons-vue'

const router = useRouter()
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
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
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
</style>