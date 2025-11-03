<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-icon">
        <el-icon size="120"><Search /></el-icon>
      </div>
      <h1 class="not-found-title">404</h1>
      <p class="not-found-desc">抱歉，您访问的页面不存在</p>
      <div class="not-found-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.not-found-content {
  text-align: center;
  padding: 40px;
}

.not-found-icon {
  margin-bottom: 20px;
  color: #c0c4cc;
}

.not-found-title {
  font-size: 72px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px;
}

.not-found-desc {
  font-size: 16px;
  color: #606266;
  margin: 0 0 32px;
}

.not-found-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

@media (max-width: 768px) {
  .not-found-title {
    font-size: 48px;
  }
  
  .not-found-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>