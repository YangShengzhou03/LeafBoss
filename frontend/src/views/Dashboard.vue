<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1>欢迎使用 Leaf Card 管理系统</h1>
          <p>高效管理您的卡密业务，实时监控数据动态</p>
        </div>
        <div class="welcome-actions">
          <el-button type="primary" size="large" @click="$router.push('/cards/list')">
            <el-icon><CreditCard /></el-icon>
            管理卡密
          </el-button>
          <el-button size="large" @click="$router.push('/cards/validation')">
            <el-icon><Search /></el-icon>
            验证卡密
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card total" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalCards.toLocaleString() }}</div>
              <div class="stat-label">总卡密数</div>
              <div class="stat-trend positive">
                <el-icon><TrendingUp /></el-icon>
                +12.5%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card used" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.usedCards.toLocaleString() }}</div>
              <div class="stat-label">已使用</div>
              <div class="stat-trend positive">
                <el-icon><TrendingUp /></el-icon>
                +8.3%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card available" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.availableCards.toLocaleString() }}</div>
              <div class="stat-label">可用卡密</div>
              <div class="stat-trend negative">
                <el-icon><TrendingDown /></el-icon>
                -5.2%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card expired" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.expiredCards.toLocaleString() }}</div>
              <div class="stat-label">已过期</div>
              <div class="stat-trend neutral">
                <el-icon><Minus /></el-icon>
                0.0%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和操作区域 -->
    <el-row :gutter="20" class="content-row">
      <!-- 使用趋势图表 -->
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">卡密使用趋势</span>
              <el-select v-model="chartPeriod" size="small" style="width: 120px">
                <el-option label="最近7天" value="7d" />
                <el-option label="最近30天" value="30d" />
                <el-option label="最近90天" value="90d" />
              </el-select>
            </div>
          </template>
          <div class="chart-container">
            <div class="chart-visual">
              <div class="chart-bars">
                <div 
                  v-for="(day, index) in usageData" 
                  :key="index"
                  class="chart-bar"
                  :style="{ height: day.usage * 2 + 'px' }"
                  :class="{ active: index === usageData.length - 1 }"
                >
                  <div class="bar-value">{{ day.usage }}</div>
                </div>
              </div>
            </div>
            <div class="chart-labels">
              <span v-for="(day, index) in usageData" :key="index" class="chart-label">
                {{ day.date }}
              </span>
            </div>
          </div>
          <div class="chart-summary">
            <div class="summary-item">
              <span class="label">平均使用量:</span>
              <span class="value">{{ averageUsage }}</span>
            </div>
            <div class="summary-item">
              <span class="label">峰值使用量:</span>
              <span class="value">{{ peakUsage }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 快捷操作和最近活动 -->
      <el-col :xs="24" :lg="8">
        <el-card class="quick-actions-card" shadow="hover">
          <template #header>
            <span class="card-title">快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button 
              v-for="action in quickActions" 
              :key="action.label"
              :type="action.type" 
              :icon="action.icon"
              class="action-btn"
              @click="handleQuickAction(action)"
            >
              {{ action.label }}
            </el-button>
          </div>
        </el-card>

        <el-card class="recent-card" shadow="hover" style="margin-top: 20px;">
          <template #header>
            <span class="card-title">最近活动</span>
          </template>
          <div class="recent-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.type">
                <el-icon><component :is="activity.icon" /></el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  totalCards: 1250,
  usedCards: 843,
  todayCards: 15,
  totalSpecs: 8
})

const recentOperations = ref([
  {
    time: '2024-01-15 14:30',
    action: '添加卡密',
    details: '添加了50张VIP会员卡',
    user: 'admin'
  },
  {
    time: '2024-01-15 13:15',
    action: '验证卡密',
    details: '卡密验证成功 - 规格类型: 月卡',
    user: 'user001'
  },
  {
    time: '2024-01-15 11:20',
    action: '删除规格',
    details: '删除了"测试规格"类型',
    user: 'admin'
  },
  {
    time: '2024-01-15 10:05',
    action: '添加规格',
    details: '新增了"年卡"规格类型',
    user: 'admin'
  }
])

onMounted(() => {
  // 这里可以调用API获取实时数据
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 欢迎区域样式 */
.welcome-card {
  margin-bottom: 24px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-card .el-card__body {
  padding: 32px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: white;
}

.welcome-text p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.welcome-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片样式 */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  margin-bottom: 0;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card.total {
  border-left: 4px solid #409eff;
}

.stat-card.used {
  border-left: 4px solid #67c23a;
}

.stat-card.available {
  border-left: 4px solid #e6a23c;
}

.stat-card.expired {
  border-left: 4px solid #f56c6c;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #409eff, #66b1ff);
}

.stat-card.used .stat-icon {
  background: linear-gradient(135deg, #67c23a, #85ce61);
}

.stat-card.available .stat-icon {
  background: linear-gradient(135deg, #e6a23c, #ebb563);
}

.stat-card.expired .stat-icon {
  background: linear-gradient(135deg, #f56c6c, #f78989);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin: 4px 0 8px 0;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.positive {
  color: #67c23a;
}

.stat-trend.negative {
  color: #f56c6c;
}

.stat-trend.neutral {
  color: #909399;
}

/* 内容区域样式 */
.content-row {
  margin-bottom: 0;
}

.chart-card,
.quick-actions-card,
.recent-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 图表样式 */
.chart-container {
  padding: 20px 0;
}

.chart-visual {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 200px;
  gap: 8px;
}

.chart-bar {
  width: 24px;
  background: linear-gradient(to top, #409eff, #66b1ff);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.chart-bar:hover {
  transform: scaleY(1.05);
  background: linear-gradient(to top, #3375e0, #5294ff);
}

.chart-bar.active {
  background: linear-gradient(to top, #3375e0, #5294ff);
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: #409eff;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 0 12px;
}

.chart-label {
  font-size: 12px;
  color: #909399;
  transform: rotate(-45deg);
  transform-origin: left center;
}

.chart-summary {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.summary-item {
  text-align: center;
}

.summary-item .label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 快捷操作样式 */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-btn {
  width: 100%;
  height: 48px;
  justify-content: flex-start;
  padding-left: 16px;
  font-weight: 500;
}

/* 最近活动样式 */
.recent-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
}

.activity-icon.success {
  background: #67c23a;
}

.activity-icon.warning {
  background: #e6a23c;
}

.activity-icon.info {
  background: #409eff;
}

.activity-icon.error {
  background: #f56c6c;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .welcome-text h1 {
    font-size: 24px;
  }
  
  .stat-content {
    padding: 12px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .chart-labels {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .chart-label {
    transform: none;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
}
</style>