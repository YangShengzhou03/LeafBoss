<template>
  <div class="admin-system">
    <el-card class="system-card">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <div class="system-content">
        <el-empty description="系统设置功能正在开发中" />
        <div class="development-info">
          <p>这两年没时间做了，以后再说吧</p>
          <p>该功能将包含存储设置、安全设置、系统维护等管理功能。</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'

onMounted(() => {
  ElMessage.info('系统设置功能开发中，敬请期待')
})
</script>

<style scoped>
.admin-system {
  padding: 20px;
}

.system-card {
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.system-content {
  padding: 40px 0;
  text-align: center;
}

.development-info {
  margin-top: 20px;
  color: #909399;
  line-height: 1.6;
}

.development-info p {
  margin: 8px 0;
}
</style>