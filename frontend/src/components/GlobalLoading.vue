<template>
  <div v-if="loading" class="global-loading">
    <div class="loading-content">
      <div class="loading-spinner">
        <el-icon class="spinner-icon">
          <Loading />
        </el-icon>
      </div>
      <div class="loading-text">{{ loadingText }}</div>
      <div v-if="progress !== null" class="loading-progress">
        <el-progress 
          :percentage="progress" 
          :show-text="false"
          :stroke-width="4"
          class="progress-bar"
        />
        <div class="progress-text">{{ progress }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElIcon, ElProgress } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

// 加载状态管理
interface LoadingState {
  text: string
  progress: number | null
  timestamp: number
}

const loadingStates = ref<LoadingState[]>([])
const loadingText = ref('加载中...')
const progress = ref<number | null>(null)

// 计算当前加载状态
const loading = computed(() => loadingStates.value.length > 0)

// 添加加载状态
const addLoading = (text: string = '加载中...', initialProgress: number | null = null) => {
  const state: LoadingState = {
    text,
    progress: initialProgress,
    timestamp: Date.now()
  }
  loadingStates.value.push(state)
  updateDisplay()
  return state.timestamp
}

// 移除加载状态
const removeLoading = (timestamp: number) => {
  const index = loadingStates.value.findIndex(state => state.timestamp === timestamp)
  if (index > -1) {
    loadingStates.value.splice(index, 1)
    updateDisplay()
  }
}

// 更新进度
const updateProgress = (timestamp: number, newProgress: number) => {
  const state = loadingStates.value.find(s => s.timestamp === timestamp)
  if (state) {
    state.progress = Math.min(100, Math.max(0, newProgress))
    updateDisplay()
  }
}

// 更新显示内容
const updateDisplay = () => {
  if (loadingStates.value.length === 0) {
    loadingText.value = '加载中...'
    progress.value = null
    return
  }

  // 显示最新的加载状态
  const latestState = loadingStates.value[loadingStates.value.length - 1]
  loadingText.value = latestState.text
  progress.value = latestState.progress
}

// 全局方法 - 通过provide/inject或全局变量方式提供
const globalLoading = {
  show: (text?: string) => addLoading(text),
  hide: (timestamp: number) => removeLoading(timestamp),
  updateProgress: (timestamp: number, progress: number) => updateProgress(timestamp, progress),
  
  // 便捷方法：显示加载并返回关闭函数
  asyncWithLoading: async <T>(
    operation: () => Promise<T>,
    text?: string
  ): Promise<T> => {
    const timestamp = addLoading(text)
    try {
      const result = await operation()
      removeLoading(timestamp)
      return result
    } catch (error) {
      removeLoading(timestamp)
      throw error
    }
  },
  
  // 带进度的异步操作
  asyncWithProgress: async <T>(
    operation: (progressCallback: (progress: number) => void) => Promise<T>,
    text?: string
  ): Promise<T> => {
    const timestamp = addLoading(text, 0)
    
    const progressCallback = (progressValue: number) => {
      updateProgress(timestamp, progressValue)
    }
    
    try {
      const result = await operation(progressCallback)
      updateProgress(timestamp, 100)
      // 短暂显示完成状态
      setTimeout(() => removeLoading(timestamp), 500)
      return result
    } catch (error) {
      removeLoading(timestamp)
      throw error
    }
  }
}

// 将全局方法挂载到window对象，供其他组件使用
if (typeof window !== 'undefined') {
  (window as any).$loading = globalLoading
}

// 提供全局方法给其他组件使用
defineExpose({
  globalLoading
})

// 自动超时保护
onMounted(() => {
  const checkTimeout = setInterval(() => {
    const now = Date.now()
    loadingStates.value = loadingStates.value.filter(state => {
      // 超过30秒的加载状态自动移除
      if (now - state.timestamp > 30000) {
        console.warn('Loading state timeout:', state)
        return false
      }
      return true
    })
    
    if (loadingStates.value.length === 0) {
      updateDisplay()
    }
  }, 5000)

  onUnmounted(() => {
    clearInterval(checkTimeout)
  })
})
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 280px;
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner-icon {
  font-size: 48px;
  color: #409EFF;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 16px;
  font-weight: 500;
}

.loading-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
}

.progress-text {
  font-size: 14px;
  color: #909399;
  min-width: 40px;
  text-align: right;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .global-loading {
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .loading-content {
    background: #1f1f1f;
    color: white;
  }
  
  .loading-text {
    color: #e0e0e0;
  }
  
  .progress-text {
    color: #b0b0b0;
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .loading-content {
    padding: 32px 24px;
    min-width: 240px;
    margin: 0 20px;
  }
  
  .spinner-icon {
    font-size: 40px;
  }
  
  .loading-text {
    font-size: 15px;
  }
}

/* 减少动画支持 */
@media (prefers-reduced-motion: reduce) {
  .spinner-icon {
    animation: none;
  }
}
</style>