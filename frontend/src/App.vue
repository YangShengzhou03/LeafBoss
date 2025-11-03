<template>
  <div id="app">
    <!-- 全局加载组件 -->
    <GlobalLoading />
    
    <!-- 错误边界包装 -->
    <ErrorBoundary>
      <router-view />
    </ErrorBoundary>
    
    <!-- 全局通知容器 -->
    <div id="global-notifications"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onErrorCaptured, getCurrentInstance } from 'vue'
import { errorHandler } from '@/utils/errorHandler'
import GlobalLoading from '@/components/GlobalLoading.vue'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

// 声明全局loading类型
declare global {
  interface Window {
    $loading: {
      show: (text?: string) => number
      hide: (timestamp: number) => void
      updateProgress: (timestamp: number, progress: number) => void
      asyncWithLoading: <T>(operation: () => Promise<T>, text?: string) => Promise<T>
      asyncWithProgress: <T>(operation: (progressCallback: (progress: number) => void) => Promise<T>, text?: string) => Promise<T>
    }
  }
}

// 获取当前应用实例
const app = getCurrentInstance()

// 全局错误捕获
onErrorCaptured((error, instance, info) => {
  errorHandler.handleError(error, `Vue错误边界: ${info}`)
  return false // 阻止错误继续向上传播
})

// 应用初始化
onMounted(() => {
  // 初始化错误处理
  if (app) {
    errorHandler.install(app.appContext.app)
  }
  
  // 监听全局错误
  window.addEventListener('error', (event) => {
    event.preventDefault()
    errorHandler.handleError(event.error, '全局脚本错误')
  })
  
  // 监听未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    errorHandler.handleError(event.reason, '未处理的Promise拒绝')
  })
  
  console.log('🚀 枫叶卡管系统应用已启动')
})

// 提供全局错误处理给所有组件
if (app) {
  app.appContext.config.globalProperties.$errorHandler = errorHandler
}
</script>

<style>
#app {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>