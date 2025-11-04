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
          <el-col :span="8">
            <div class="stat-card">
              <div class="stat-item">
                <div class="stat-content">
                  <div class="stat-title">卡密总数</div>
                  <div class="stat-value">{{ stats.cardKeyCount }}</div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="8">
            <div class="stat-card">
              <div class="stat-item">
                <div class="stat-content">
                  <div class="stat-title">已使用卡密</div>
                  <div class="stat-value">{{ stats.usedCardKeys }}</div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="8">
            <div class="stat-card">
              <div class="stat-item">
                <div class="stat-content">
                  <div class="stat-title">操作日志</div>
                  <div class="stat-value">{{ stats.logCount }}</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 统计数据
const stats = ref({
  cardKeyCount: 0,
  usedCardKeys: 0,
  logCount: 0
})

// 系统运行时间
const uptime = ref('0天0小时0分钟')
const loading = ref(false)

// 商品规格使用统计
const specStats = ref([
  {
    productName: 'VIP会员',
    specName: '月卡',
    price: 29.9,
    totalKeys: 200,
    usedKeys: 156,
    usageRate: 78,
    revenue: 4680,
    trend: 12
  },
  {
    productName: 'VIP会员',
    specName: '季卡',
    price: 79.9,
    totalKeys: 150,
    usedKeys: 89,
    usageRate: 59,
    revenue: 7111,
    trend: 8
  },
  {
    productName: 'VIP会员',
    specName: '年卡',
    price: 199.9,
    totalKeys: 80,
    usedKeys: 45,
    usageRate: 56,
    revenue: 8995,
    trend: 5
  },
  {
    productName: '高级功能',
    specName: '基础版',
    price: 49.9,
    totalKeys: 120,
    usedKeys: 67,
    usageRate: 56,
    revenue: 3343,
    trend: -3
  },
  {
    productName: '高级功能',
    specName: '专业版',
    price: 99.9,
    totalKeys: 60,
    usedKeys: 28,
    usageRate: 47,
    revenue: 2797,
    trend: 15
  }
])

const getUsageColor = (rate) => {
  if (rate >= 80) return '#67C23A'
  if (rate >= 60) return '#E6A23C'
  if (rate >= 40) return '#409EFF'
  return '#F56C6C'
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true
    // 模拟数据加载
    stats.value = {
      cardKeyCount: 500,
      usedCardKeys: 325,
      logCount: 1200
    }
    
    uptime.value = '15天8小时30分钟'
  } catch (error) {
    ElMessage.error('加载仪表盘数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
  background-color: #f5f7fa;
}

.dashboard-card {
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.dashboard-card :deep(.el-card__body) {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

/* 统计卡片样式 - 简约风格 */
.stat-card {
  height: 100%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
  padding: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  margin-right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #409eff, #79bbff);
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
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

/* 商品规格统计样式 */
.spec-stats {
  width: 100%;
  overflow-x: auto;
}

.spec-stats .el-table {
  width: 100% !important;
  min-width: 100%;
}

/* 系统信息卡片样式 */
.system-info {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ebeef5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #606266;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stat-item {
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-value {
    font-size: 20px;
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
    font-size: 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .stat-item {
    padding: 12px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
  }
  
  .stat-icon .el-icon {
    font-size: 18px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .stat-title {
    font-size: 13px;
  }
}
</style>