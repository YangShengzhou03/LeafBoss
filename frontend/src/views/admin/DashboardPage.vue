<template>
  <div class="admin-dashboard">
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span>管理员仪表盘</span>
        </div>
      </template>
      
      <div class="dashboard-content">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><User /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">用户总数</div>
                  <div class="stat-value">{{ stats.userCount }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><Folder /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">文件总数</div>
                  <div class="stat-value">{{ stats.fileCount }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><Document /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">存储使用</div>
                  <div class="stat-value">{{ formatStorageSize(stats.usedStorage) }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><Share /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">分享链接</div>
                  <div class="stat-value">{{ stats.shareCount }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="24">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>系统信息</span>
                </div>
              </template>
              <div class="system-info">
                <div class="info-item">
                  <span class="info-label">系统版本：</span>
                  <span class="info-value">LeafPan v1.0.0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">运行时间：</span>
                  <span class="info-value">{{ uptime }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">存储状态：</span>
                  <span class="info-value">正常</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Folder, Document, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Server from '@/utils/Server.js'

// 统计数据
const stats = ref({
  userCount: 0,
  fileCount: 0,
  usedStorage: 0,
  shareCount: 0
})

// 系统运行时间
const uptime = ref('')

// 格式化存储大小（字节转换为可读格式）
const formatStorageSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    // 调用后端API获取真实数据
    const response = await Server.get('/admin/stats')
    
    // 更新统计数据
    stats.value = {
      userCount: response.data.userCount || 0,
      fileCount: response.data.fileCount || 0,
      usedStorage: response.data.usedStorage || 0,
      shareCount: response.data.shareCount || 0
    }
    
    // 更新系统运行时间
    uptime.value = response.data.uptime || ''
  } catch (error) {
    ElMessage.error('加载仪表盘数据失败: ' + (error.response?.data?.message || error.message))
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
}

.dashboard-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

/* 统计卡片样式 - 朴素专业风格 */
.stat-card {
  height: 100%;
  border-radius: 4px;
  border: 1px solid #e6e6e6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 16px;
}

.stat-icon {
  margin-right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.stat-icon .el-icon {
  color: #409EFF;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
  font-weight: 400;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

/* 系统信息卡片样式 */
.system-info {
  padding: 12px 0;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.info-label {
  width: 100px;
  color: #909399;
  font-weight: 400;
  font-size: 14px;
}

.info-value {
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-item {
    flex-direction: column;
    text-align: center;
    padding: 12px;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 8px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-label {
    width: auto;
    margin-bottom: 4px;
  }
}
</style>