<template>
  <div class="dashboard">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="stats-grid">
      <el-col :xs="24" :sm="12" :md="6" v-for="stat in stats" :key="stat.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :class="stat.iconClass">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
              <div v-if="stat.trend" class="stat-trend" :class="stat.trend > 0 ? 'trend-up' : 'trend-down'">
                <i :class="stat.trend > 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
                {{ Math.abs(stat.trend) }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">卡密激活趋势</h3>
              <el-radio-group v-model="activationPeriod" size="small" @change="updateActivationChart">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div id="activationChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <h3 class="chart-title">收入趋势</h3>
              <el-radio-group v-model="revenuePeriod" size="small" @change="updateRevenueChart">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div id="revenueChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 信息区域 -->
    <el-row :gutter="20" class="info-section">
      <el-col :xs="24" :lg="12">
        <el-card class="info-card">
          <template #header>
            <h3 class="info-title">系统信息</h3>
          </template>
          <div class="system-info">
            <div class="info-item" v-for="item in systemInfo" :key="item.label">
              <div class="info-label">
                <i :class="item.icon" class="info-icon"></i>
                {{ item.label }}:
              </div>
              <div class="info-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card class="info-card">
          <template #header>
            <h3 class="info-title">产品分类统计</h3>
          </template>
          <div class="category-stats">
            <div class="category-item" v-for="category in categories" :key="category.name">
              <div class="category-info">
                <span class="category-name">{{ category.name }}</span>
                <el-progress 
                  :percentage="category.percentage" 
                  :show-text="false" 
                  :stroke-width="8"
                  :color="category.color">
                </el-progress>
              </div>
              <span class="category-count">{{ category.count }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import api from '@/api'

// 响应式数据
const stats = reactive([
  {
    title: '用户总数',
    value: '1,524',
    icon: 'el-icon-user',
    iconClass: 'user-icon',
    trend: 12.5
  },
  {
    title: '卡密总数',
    value: '8,923',
    icon: 'el-icon-credit-card',
    iconClass: 'card-icon',
    trend: 8.3
  },
  {
    title: '已激活卡密',
    value: '6,542',
    icon: 'el-icon-check',
    iconClass: 'active-icon',
    trend: 73.2
  },
  {
    title: '总收入',
    value: '¥152,400',
    icon: 'el-icon-money',
    iconClass: 'revenue-icon',
    trend: 15.8
  }
])

const activationPeriod = ref('week')
const revenuePeriod = ref('week')

// 系统信息
const systemInfo = reactive([
  { label: '系统版本', value: 'v1.0.0', icon: 'el-icon-monitor' },
  { label: '运行时间', value: '15天8小时32分钟', icon: 'el-icon-time' },
  { label: '存储状态', value: '正常', icon: 'el-icon-folder-checked' },
  { label: '最后更新', value: '2024-01-15 14:30', icon: 'el-icon-refresh' }
])

// 产品分类统计
const categories = reactive([
  { name: '软件授权', count: '2,345', percentage: 65, color: '#409EFF' },
  { name: '游戏道具', count: '1,892', percentage: 52, color: '#67C23A' },
  { name: '会员服务', count: '1,567', percentage: 43, color: '#E6A23C' },
  { name: '其他产品', count: '876', percentage: 24, color: '#909399' }
])

// 图表实例
let activationChart = null
let revenueChart = null

// 格式化金额
const formatMoney = (amount) => {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 初始化激活趋势图表
const initActivationChart = () => {
  const chartDom = document.getElementById('activationChart')
  if (!chartDom) return
  
  activationChart = echarts.init(chartDom)
  updateActivationChart()
}

// 更新激活趋势图表
const updateActivationChart = async () => {
  if (!activationChart) return
  
  try {
    // 获取图表数据
    const response = await api.get('/admin/charts/activation', {
      params: { period: activationPeriod.value }
    })
    
    const data = response.data || generateMockActivationData(activationPeriod.value)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '激活数量',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: data.values,
          itemStyle: {
            color: '#409EFF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(64, 158, 255, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(64, 158, 255, 0.05)'
              }
            ])
          }
        }
      ]
    }
    
    activationChart.setOption(option)
  } catch (error) {
    console.error('获取激活趋势数据失败:', error)
    // 使用模拟数据
    const data = generateMockActivationData(activationPeriod.value)
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '激活数量',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: data.values,
          itemStyle: {
            color: '#409EFF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(64, 158, 255, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(64, 158, 255, 0.05)'
              }
            ])
          }
        }
      ]
    }
    
    activationChart.setOption(option)
  }
}

// 初始化收入趋势图表
const initRevenueChart = () => {
  const chartDom = document.getElementById('revenueChart')
  if (!chartDom) return
  
  revenueChart = echarts.init(chartDom)
  updateRevenueChart()
}

// 更新收入趋势图表
const updateRevenueChart = async () => {
  if (!revenueChart) return
  
  try {
    // 获取图表数据
    const response = await api.get('/admin/charts/revenue', {
      params: { period: revenuePeriod.value }
    })
    
    const data = response.data || generateMockRevenueData(revenuePeriod.value)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params) {
          const value = params[0].value
          return `${params[0].name}<br/>收入: ¥${formatMoney(value)}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      series: [
        {
          name: '收入',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: data.values,
          itemStyle: {
            color: '#67C23A'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(103, 194, 58, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(103, 194, 58, 0.05)'
              }
            ])
          }
        }
      ]
    }
    
    revenueChart.setOption(option)
  } catch (error) {
    console.error('获取收入趋势数据失败:', error)
    // 使用模拟数据
    const data = generateMockRevenueData(revenuePeriod.value)
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function (params) {
          const value = params[0].value
          return `${params[0].name}<br/>收入: ¥${formatMoney(value)}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.dates
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      series: [
        {
          name: '收入',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.3
          },
          emphasis: {
            focus: 'series'
          },
          data: data.values,
          itemStyle: {
            color: '#67C23A'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(103, 194, 58, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(103, 194, 58, 0.05)'
              }
            ])
          }
        }
      ]
    }
    
    revenueChart.setOption(option)
  }
}

// 生成模拟激活数据
const generateMockActivationData = (period) => {
  let dates = []
  let values = []
  
  if (period === 'week') {
    // 本周数据
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    dates = weekDays
    values = [12, 19, 15, 25, 32, 28, 42]
  } else if (period === 'month') {
    // 本月数据
    for (let i = 1; i <= 30; i++) {
      dates.push(`${i}日`)
      values.push(Math.floor(Math.random() * 50) + 10)
    }
  } else {
    // 本年数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    dates = months
    values = [320, 402, 301, 434, 490, 530, 610, 734, 820, 932, 901, 1034]
  }
  
  return { dates, values }
}

// 生成模拟收入数据
const generateMockRevenueData = (period) => {
  let dates = []
  let values = []
  
  if (period === 'week') {
    // 本周数据
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    dates = weekDays
    values = [1200, 1900, 1500, 2500, 3200, 2800, 4200]
  } else if (period === 'month') {
    // 本月数据
    for (let i = 1; i <= 30; i++) {
      dates.push(`${i}日`)
      values.push(Math.floor(Math.random() * 5000) + 1000)
    }
  } else {
    // 本年数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    dates = months
    values = [12000, 19000, 15000, 25000, 32000, 28000, 42000, 38000, 45000, 52000, 48000, 61000]
  }
  
  return { dates, values }
}

// 窗口大小改变时重新调整图表大小
const resizeCharts = () => {
  if (activationChart) activationChart.resize()
  if (revenueChart) revenueChart.resize()
}



// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    // 调用后端API获取真实数据
    const response = await api.get('/admin/stats')
    
    // 更新统计数据
    stats.value = {
      userCount: response.data.userCount || 0,
      userGrowth: response.data.userGrowth || 0,
      cardCount: response.data.cardCount || 0,
      cardGrowth: response.data.cardGrowth || 0,
      activeCardCount: response.data.activeCardCount || 0,
      activeRate: response.data.activeRate || 0,
      totalRevenue: response.data.totalRevenue || 0,
      revenueGrowth: response.data.revenueGrowth || 0,
      specCount: response.data.specCount || 0,
      activeSpecCount: response.data.activeSpecCount || 0,
      categoryCount: response.data.categoryCount || 0,
      activeCategoryCount: response.data.activeCategoryCount || 0,
      todayActiveCount: response.data.todayActiveCount || 0,
      todayGrowth: response.data.todayGrowth || 0
    }
    
    // 更新系统运行时间
    uptime.value = response.data.uptime || ''
  } catch (error) {
    ElMessage.error('加载仪表盘数据失败: ' + (error.response?.data?.message || error.message))
    
    // 如果API调用失败，使用模拟数据
    stats.value = {
      userCount: 1286,
      userGrowth: 12.5,
      cardCount: 5420,
      cardGrowth: 18.3,
      activeCardCount: 3896,
      activeRate: 71.9,
      totalRevenue: 128560,
      revenueGrowth: 25.8,
      specCount: 15,
      activeSpecCount: 12,
      categoryCount: 8,
      activeCategoryCount: 7,
      todayActiveCount: 42,
      todayGrowth: 8.5
    }
    
    uptime.value = '15天 8小时 32分钟'
  }
}

onMounted(() => {
  loadDashboardData()
  
  // 等待DOM渲染完成后初始化图表
  nextTick(() => {
    initActivationChart()
    initRevenueChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', resizeCharts)
  })
})

// 监听周期选择变化
watch(activationPeriod, () => {
  updateActivationChart()
})

watch(revenuePeriod, () => {
  updateRevenueChart()
})
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 64px);
}

/* 统计卡片区域 */
.stats-grid {
  margin-bottom: 32px;
}

.stat-card {
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-dark);
  border-color: var(--primary-light);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: var(--spacing-lg);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-lg);
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.user-icon { 
  background: linear-gradient(135deg, #409EFF, #66b1ff); 
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.card-icon { 
  background: linear-gradient(135deg, #67C23A, #85ce61); 
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

.active-icon { 
  background: linear-gradient(135deg, #E6A23C, #ebb563); 
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

.revenue-icon { 
  background: linear-gradient(135deg, #F56C6C, #f78989); 
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  line-height: 1.2;
}

.stat-title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 4px 8px;
  border-radius: var(--border-radius-small);
  background-color: rgba(103, 194, 58, 0.1);
}

.trend-up {
  color: var(--success-color);
  background-color: rgba(103, 194, 58, 0.1);
}

.trend-down {
  color: var(--danger-color);
  background-color: rgba(245, 108, 108, 0.1);
}

/* 图表区域 */
.charts-section {
  margin-bottom: 32px;
}

.chart-card {
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: var(--shadow-base);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
}

.chart-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.chart-container {
  height: 320px;
  width: 100%;
  padding: var(--spacing-lg);
}

/* 信息区域 */
.info-section {
  margin-bottom: 32px;
}

.info-card {
  border-radius: var(--border-radius-large);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: var(--shadow-base);
}

.info-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.system-info {
  padding: var(--spacing-sm) 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base) 0;
  border-bottom: 1px solid var(--border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  font-weight: 500;
}

.info-icon {
  margin-right: var(--spacing-sm);
  font-size: var(--font-size-base);
  color: var(--primary-color);
}

.info-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.category-stats {
  padding: var(--spacing-sm) 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-base) 0;
  border-bottom: 1px solid var(--border-light);
}

.category-item:last-child {
  border-bottom: none;
}

.category-info {
  flex: 1;
  margin-right: var(--spacing-lg);
}

.category-name {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-regular);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.category-count {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-primary);
  min-width: 60px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stat-value {
    font-size: 24px;
  }
  
  .chart-container {
    height: 280px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-lg);
  }
  
  .stats-grid {
    margin-bottom: var(--spacing-lg);
  }
  
  .stat-content {
    padding: var(--spacing-base);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
    margin-right: var(--spacing-base);
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .chart-container {
    height: 240px;
    padding: var(--spacing-base);
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-base);
    padding: var(--spacing-base) var(--spacing-base) 0;
  }
  
  .info-item, .category-item {
    padding: var(--spacing-sm) 0;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: var(--spacing-base);
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-lg);
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: var(--spacing-base);
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .chart-container {
    height: 200px;
    padding: var(--spacing-sm);
  }
  
  .category-info {
    margin-right: var(--spacing-base);
  }
}

/* 动画效果 */
.stat-card,
.chart-card,
.info-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--border-base);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--border-dark);
}
</style>