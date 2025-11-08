<template>
  <div class="admin-dashboard">
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span>管理员仪表盘</span>
          <el-button type="text" @click="refreshData" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      
      <div class="dashboard-content">
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <div class="stat-card primary">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><Key /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">卡密总数</div>
                  <div class="stat-value">{{ stats.cardKeyCount }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">较上月</span>
                    <span class="trend-value positive">+{{ stats.cardKeyGrowth }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="stat-card success">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><Goods /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">当月收入</div>
                  <div class="stat-value">¥{{ formatCurrency(stats.monthlyRevenue) }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">较上月</span>
                    <span class="trend-value positive">+{{ stats.monthlyGrowth }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="stat-card warning">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><Money /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">日销售数量</div>
                  <div class="stat-value">{{ stats.dailySales }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">较昨日</span>
                    <span class="trend-value positive">+{{ stats.dailySalesGrowth }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="stat-card info">
              <div class="stat-item">
                <div class="stat-icon">
                  <el-icon><Coin /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">日收入</div>
                  <div class="stat-value">¥{{ formatCurrency(stats.dailyRevenue) }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">较昨日</span>
                    <span class="trend-value positive">+{{ stats.dailyGrowth }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="charts-row">
          <el-col :span="24">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>未使用卡密占比</span>
                </div>
              </template>
              <div class="chart-container">
                <div v-if="specDistribution.length === 0" class="no-data">
                  <el-empty description="暂无数据" :image-size="80" />
                </div>
                <div v-else class="chart-content">
                  <v-chart :option="pieChartOption" style="height: 300px;" />
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { 
  Refresh, Key, Money, Goods, Coin
} from '@element-plus/icons-vue'
import api from '../../services/api'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const stats = ref({
  cardKeyCount: 0,
  monthlyRevenue: 0,
  dailySales: 0,
  dailyRevenue: 0,
  cardKeyGrowth: 0,
  monthlyGrowth: 0,
  dailySalesGrowth: 0,
  dailyGrowth: 0
})

const loading = ref(false)

const specDistribution = ref([])

const pieChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}张 ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '商品',
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}张 ({d}%)',
          fontSize: 10,
          fontWeight: 'bold'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 5
        },
        data: specDistribution.value.map((item, index) => ({
          value: item.count,
          name: item.name,
          itemStyle: {
            color: getSpecColor(index)
          }
        }))
      }
    ]
  }
})

const getSpecColor = (index) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb', '#ff85c0']
  return colors[index % colors.length]
}

const refreshData = async () => {
  await loadDashboardData()
}

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00'
  return parseFloat(value).toFixed(2)
}

const loadDashboardData = async () => {
  try {
    loading.value = true
    
    const response = await api.admin.getDashboardStats()
    
    if (response && response.data) {
      const data = response.data
      
      stats.value = {
        cardKeyCount: data.totalOrders || 0,
        monthlyRevenue: data.monthlyRevenue || 0,
        dailySales: data.dailySales || 0,
        dailyRevenue: data.dailyRevenue || 0,
        cardKeyGrowth: data.conversionRate || 0,
        monthlyGrowth: data.monthlyRevenueChange || 0,
        dailySalesGrowth: data.dailySalesChange || 0,
        dailyGrowth: data.dailyRevenueChange || 0
      }
      
      await loadSpecDistribution()
      
    } else {
      stats.value = {
        cardKeyCount: 0,
        monthlyRevenue: 0,
        dailySales: 0,
        dailyRevenue: 0,
        cardKeyGrowth: 0,
        monthlyGrowth: 0,
        dailySalesGrowth: 0,
        dailyGrowth: 0
      }
      
      specDistribution.value = []
      
      ElMessage.warning('仪表盘数据为空，请检查数据配置')
    }
    
  } catch (error) {
    if (error.response && error.response.status === 401) {
      ElMessage.warning('登录过期，请重新登录')
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      ElMessage.error('网络连接失败，请检查网络连接')
    } else if (error.response.status === 500) {
      ElMessage.error('服务器内部错误，请联系管理员')
    } else {
      ElMessage.error('加载仪表盘数据失败，请稍后重试')
    }
    
    stats.value = {
      cardKeyCount: 0,
      monthlyRevenue: 0,
      dailySales: 0,
      dailyRevenue: 0,
      cardKeyGrowth: 0,
      monthlyGrowth: 0,
      dailySalesGrowth: 0,
      dailyGrowth: 0
    }
    
    specDistribution.value = []
  } finally {
    loading.value = false
  }
}

const loadSpecDistribution = async () => {
  try {
    console.log('开始加载规格分布数据...')
    const response = await api.admin.getSpecificationDTOs()
    console.log('API响应:', response)
    
    if (response && response.code === 200 && response.data) {
      const specifications = response.data
      console.log('规格数据:', specifications)
      
      const totalUnusedCards = specifications.reduce((total, spec) => total + (spec.unusedKeys || 0), 0)
      console.log('未使用卡密总数:', totalUnusedCards)
      
      const distributionData = specifications
        .filter(spec => spec.unusedKeys > 0)
        .map(spec => ({
          name: spec.name,
          count: spec.unusedKeys || 0,
          percentage: totalUnusedCards > 0 
            ? Math.round((spec.unusedKeys / totalUnusedCards) * 100) 
            : 0
        }))
        .sort((a, b) => b.count - a.count)
      
      console.log('处理后的分布数据:', distributionData)
      specDistribution.value = distributionData
      
      if (distributionData.length === 0) {
        console.log('没有找到未使用卡密数据')
        ElMessage.info('暂无未使用卡密数据')
      }
    } else {
      console.log('API响应格式不正确:', response)
      specDistribution.value = []
      ElMessage.warning('规格分布数据为空')
    }
  } catch (error) {
    console.error('加载规格分布数据失败:', error)
    specDistribution.value = []
    ElMessage.error('加载规格分布数据失败')
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
  padding: 12px;
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
  border-radius: 2px;
  background-color: #fff;
  padding: 12px;
}

.stat-card:hover {
  border-color: #c6e2ff;
}

.stat-card.primary {
  border-left: 4px solid #409eff;
}

.stat-card.success {
  border-left: 4px solid #67c23a;
}

.stat-card.warning {
  border-left: 4px solid #e6a23c;
}

.stat-card.info {
  border-left: 4px solid #909399;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  margin-right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
}

.stat-icon .el-icon {
  color: #fff;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
  margin-bottom: 6px;
}

.stat-trend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.trend-text {
  color: #909399;
}

.trend-value {
  font-weight: 500;
}

.trend-value.positive {
  color: #67c23a;
}

/* 图表卡片样式 */
.chart-card {
  margin-top: 16px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  min-height: 350px;
  display: flex;
  flex-direction: column;
}

.chart-card:hover {
  border-color: #c6e2ff;
}

.chart-header {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
  flex-shrink: 0;
}

.chart-container {
  padding: 12px 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-content {
  width: 100%;
  height: 100%;
}

.no-data {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式布局 */
.stats-row {
  margin-bottom: 0;
}

.charts-row {
  margin-top: 16px;
}

@media (max-width: 1200px) {
  .stats-row .el-col {
    margin-bottom: 16px;
  }
  
  .charts-row .el-col {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .stats-row .el-col {
    width: 100%;
  }
  
  .charts-row .el-col {
    width: 100%;
  }
  
  .pie-chart-container {
    height: 250px;
  }
}
</style>