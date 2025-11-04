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
                  <el-icon size="24"><Key /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">卡密总数</div>
                  <div class="stat-value">{{ stats.cardKeyCount }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon size="24"><CircleCheck /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">已激活卡密</div>
                  <div class="stat-value">{{ stats.activatedCardKeys }}</div>
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
                  <span class="info-value">枫叶卡管 v1.0.0</span>
                </div>
                <div class="info-item">
                  <span class="info-label">运行时间：</span>
                  <span class="info-value">{{ uptime }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">系统状态：</span>
                  <span class="info-value">正常运行</span>
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
import { User, Key, CircleCheck, Share } from '@element-plus/icons-vue'
import { AdminService } from '@/services/api.js'

// 统计数据
const stats = ref({
  userCount: 0,
  cardKeyCount: 0,
  activatedCardKeys: 0,
  shareCount: 0
})

// 系统运行时间
const uptime = ref('')

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    // 调用后端API获取真实数据
    const response = await AdminService.getDashboardStats()
    
    // 更新统计数据
    stats.value = {
      userCount: response.data.userCount || 0,
      cardKeyCount: response.data.cardKeyCount || 0,
      activatedCardKeys: response.data.activatedCardKeys || 0,
      shareCount: response.data.shareCount || 0
    }
    
    // 更新系统运行时间
    uptime.value = response.data.uptime || '系统运行中'
  } catch (error) {
    // 错误已由AdminService处理，这里不需要额外处理
    console.error('加载仪表盘数据失败:', error)
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

/* 统计卡片样式 - 简约风格 */
.stat-card {
  height: 100%;
  border: 1px solid #ddd;
  overflow: hidden;
  position: relative;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #409EFF;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 24px;
}

.stat-icon {
  margin-right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409EFF;
}

.stat-icon .el-icon {
  color: #fff;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

/* 系统信息卡片样式 */
.system-info {
  padding: 20px 0;
}

.info-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 120px;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.info-label::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #409EFF;
  border-radius: 50%;
  margin-right: 8px;
}

.info-value {
  color: #303133;
  font-weight: 600;
  font-size: 15px;
  padding: 4px 12px;
  background-color: #fff;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stat-item {
    padding: 20px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .stat-item {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .stat-value {
    font-size: 22px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px;
  }
  
  .info-label {
    width: auto;
    margin-bottom: 6px;
  }
  
  .info-value {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .stat-item {
    padding: 12px;
  }
  
  .stat-icon {
    width: 44px;
    height: 44px;
  }
  
  .stat-icon .el-icon {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .stat-title {
    font-size: 13px;
  }
}
</style>