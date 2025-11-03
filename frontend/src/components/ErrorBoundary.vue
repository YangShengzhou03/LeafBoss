<template>
  <slot v-if="!hasError" />
  <div v-else class="error-boundary">
    <div class="error-content">
      <el-icon class="error-icon">
        <Warning />
      </el-icon>
      <h2 class="error-title">页面加载失败</h2>
      <p class="error-message">抱歉，当前页面出现了一些问题</p>
      <div class="error-actions">
        <el-button type="primary" @click="handleRetry">
          <el-icon><Refresh /></el-icon>
          重新加载
        </el-button>
        <el-button @click="handleGoHome">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
        <el-button @click="handleReport" type="warning">
          <el-icon><ChatDotRound /></el-icon>
          报告问题
        </el-button>
      </div>
      <div v-if="showDetails" class="error-details">
        <el-collapse>
          <el-collapse-item title="错误详情">
            <pre class="error-stack">{{ errorDetails }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon, ElButton, ElCollapse, ElCollapseItem } from 'element-plus'
import { Warning, Refresh, HomeFilled, ChatDotRound } from '@element-plus/icons-vue'
import { errorHandler } from '@/utils/errorHandler'

const router = useRouter()
const hasError = ref(false)
const errorDetails = ref('')
const showDetails = ref(false)

// 错误信息
let currentError: any = null

// 错误捕获
onErrorCaptured((error, instance, info) => {
  hasError.value = true
  currentError = error
  
  // 格式化错误详情
  errorDetails.value = `错误信息: ${error.message}\n组件: ${info}\n堆栈: ${error.stack || '无堆栈信息'}`
  
  // 记录错误
  console.error('ErrorBoundary捕获到错误:', error)
  
  // 阻止错误继续向上传播
  return false
})

// 重试操作
const handleRetry = () => {
  hasError.value = false
  currentError = null
  errorDetails.value = ''
  showDetails.value = false
  
  // 强制重新渲染子组件
  const instance = getCurrentInstance()
  if (instance?.proxy) {
    // 触发组件重新渲染
    instance.proxy.$forceUpdate?.()
  }
}

// 返回首页
const handleGoHome = () => {
  router.push('/dashboard')
}

// 报告问题
const handleReport = () => {
  showDetails.value = !showDetails.value
  
  if (showDetails.value && currentError) {
    // 可以在这里集成错误报告服务
    console.log('报告错误:', currentError)
  }
}

// 提供重置方法给父组件
defineExpose({
  reset: handleRetry
})
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 40px 20px;
}

.error-content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 64px;
  color: #e6a23c;
  margin-bottom: 20px;
}

.error-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 12px;
  font-weight: 600;
}

.error-message {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.error-details {
  text-align: left;
}

.error-stack {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 6px;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .error-boundary {
    padding: 20px 16px;
    min-height: 300px;
  }
  
  .error-content {
    padding: 32px 24px;
  }
  
  .error-icon {
    font-size: 48px;
  }
  
  .error-title {
    font-size: 20px;
  }
  
  .error-message {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .error-actions .el-button {
    width: 100%;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .error-boundary {
    background-color: #141414;
  }
  
  .error-content {
    background: #1f1f1f;
    color: white;
  }
  
  .error-title {
    color: #e0e0e0;
  }
  
  .error-message {
    color: #b0b0b0;
  }
  
  .error-stack {
    background: #2a2a2a;
    color: #d0d0d0;
  }
}
</style>