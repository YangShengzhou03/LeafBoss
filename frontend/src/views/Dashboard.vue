<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <div class="stat-content">
          <div class="stat-icon" :style="{ backgroundColor: '#f5f7fa', color: '#606266' }">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">销售趋势</h3>
        </div>
        <div class="chart-container">
          <div ref="salesChart" class="chart"></div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">商品分类统计</h3>
        </div>
        <div class="chart-container">
          <div ref="categoryChart" class="chart"></div>
        </div>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <div class="info-header">
          <h3 class="info-title">系统信息</h3>
        </div>
        <div class="system-info">
          <div class="info-item">
            <div class="info-label">
              <el-icon><Monitor /></el-icon>
              <span>系统版本</span>
            </div>
            <div class="info-value">v1.0.0</div>
          </div>
          <div class="info-item">
            <div class="info-label">
              <el-icon><Clock /></el-icon>
              <span>运行时间</span>
            </div>
            <div class="info-value">7天12小时</div>
          </div>
          <div class="info-item">
            <div class="info-label">
              <el-icon><Cpu /></el-icon>
              <span>CPU使用率</span>
            </div>
            <div class="info-value">25%</div>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-header">
          <h3 class="info-title">分类统计</h3>
        </div>
        <div class="category-stats">
          <div class="category-item" v-for="(category, index) in categories" :key="index">
            <div class="category-info">
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">{{ category.count }} 个</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Monitor, Clock, Cpu } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { statsService } from '@/api/modules'

// 统计数据
const stats = ref([
  { label: '总用户数', value: '1,234', icon: 'User' },
  { label: '总商品数', value: '567', icon: 'ShoppingBag' },
  { label: '总卡密数', value: '890', icon: 'CreditCard' },
  { label: '今日销售', value: '123', icon: 'TrendCharts' }
])

// 分类数据
const categories = ref([
  { name: '游戏点卡', count: 120 },
  { name: '软件激活码', count: 85 },
  { name: '会员卡', count: 156 },
  { name: '其他', count: 45 }
])

// 图表引用
const salesChart = ref(null)
const categoryChart = ref(null)

// 图表实例
let salesChartInstance = null
let categoryChartInstance = null

// 初始化销售趋势图
const initSalesChart = () => {
  if (!salesChart.value) return
  
  salesChartInstance = echarts.init(salesChart.value)
  
  const option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      },
      axisLabel: {
        color: '#606266'
      },
      splitLine: {
        lineStyle: {
          color: '#ebeef5'
        }
      }
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          color: '#409eff'
        },
        lineStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: 'rgba(64, 158, 255, 0.1)'
        }
      }
    ]
  }
  
  salesChartInstance.setOption(option)
}

// 初始化分类统计图
const initCategoryChart = () => {
  if (!categoryChart.value) return
  
  categoryChartInstance = echarts.init(categoryChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '分类统计',
        type: 'pie',
        radius: '70%',
        data: [
          { value: 120, name: '游戏点卡' },
          { value: 85, name: '软件激活码' },
          { value: 156, name: '会员卡' },
          { value: 45, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  categoryChartInstance.setOption(option)
}

// 获取仪表盘数据
const fetchDashboardData = async () => {
  try {
    const response = await statsService.getDashboardStats()
    if (response.success) {
      // 更新统计数据
      stats.value[0].value = response.data.totalUsers || '1,234'
      stats.value[1].value = response.data.totalProducts || '567'
      stats.value[2].value = response.data.totalCards || '890'
      stats.value[3].value = response.data.todaySales || '123'
      
      // 更新分类数据
      if (response.data.categories) {
        categories.value = response.data.categories
      }
      
      // 更新图表数据
      if (response.data.salesData) {
        updateSalesChart(response.data.salesData)
      }
      
      if (response.data.categoryData) {
        updateCategoryChart(response.data.categoryData)
      }
    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}

// 更新销售趋势图
const updateSalesChart = (data) => {
  if (!salesChartInstance) return
  
  const option = {
    xAxis: {
      data: data.dates || ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    series: [
      {
        data: data.values || [120, 132, 101, 134, 90, 230, 210]
      }
    ]
  }
  
  salesChartInstance.setOption(option)
}

// 更新分类统计图
const updateCategoryChart = (data) => {
  if (!categoryChartInstance) return
  
  const option = {
    series: [
      {
        data: data || [
          { value: 120, name: '游戏点卡' },
          { value: 85, name: '软件激活码' },
          { value: 156, name: '会员卡' },
          { value: 45, name: '其他' }
        ]
      }
    ]
  }
  
  categoryChartInstance.setOption(option)
}

// 窗口大小改变时重新调整图表
const handleResize = () => {
  if (salesChartInstance) {
    salesChartInstance.resize()
  }
  if (categoryChartInstance) {
    categoryChartInstance.resize()
  }
}

onMounted(async () => {
  await nextTick()
  
  // 初始化图表
  initSalesChart()
  initCategoryChart()
  
  // 获取仪表盘数据
  fetchDashboardData()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 组件卸载时清理
onUnmounted(() => {
  if (salesChartInstance) {
    salesChartInstance.dispose()
  }
  if (categoryChartInstance) {
    categoryChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  padding: var(--page-padding);
  background: var(--bg-color);
  min-height: calc(100vh - 60px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--section-margin);
}

.stat-card {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--card-padding);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--border-light);
}

.stat-card:hover {
  box-shadow: var(--shadow-lg);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: var(--spacing-lg);
  background-color: var(--color-gray-50);
  color: var(--text-secondary);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--section-margin);
}

.chart-card {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.chart-header {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.chart-container {
  padding: var(--spacing-xl);
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.info-card {
  background-color: var(--bg-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.info-header {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--border-light);
}

.info-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.system-info {
  padding: var(--spacing-lg) var(--spacing-xl);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-regular);
  font-weight: 500;
}

.info-label .el-icon {
  margin-right: var(--spacing-sm);
  font-size: 16px;
  color: var(--color-primary);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.category-stats {
  padding: var(--spacing-lg) var(--spacing-xl);
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
}

.category-item:last-child {
  border-bottom: none;
}

.category-info {
  flex: 1;
}

.category-name {
  display: block;
  font-size: 14px;
  color: var(--text-regular);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.category-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .chart-container {
    height: 250px;
    padding: 16px;
  }
}
</style>