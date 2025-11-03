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
                <div class="stat-icon user-icon">
                  <el-icon size="24"><User /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">用户总数</div>
                  <div class="stat-value">{{ stats.userCount }}</div>
                  <div class="stat-trend">
                    <span :class="['trend-indicator', stats.userGrowth >= 0 ? 'up' : 'down']">
                      {{ stats.userGrowth >= 0 ? '+' : '' }}{{ stats.userGrowth }}%
                    </span>
                    <span class="trend-text">较上月</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon card-icon">
                  <el-icon size="24"><CreditCard /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">卡密总数</div>
                  <div class="stat-value">{{ stats.cardCount }}</div>
                  <div class="stat-trend">
                    <span :class="['trend-indicator', stats.cardGrowth >= 0 ? 'up' : 'down']">
                      {{ stats.cardGrowth >= 0 ? '+' : '' }}{{ stats.cardGrowth }}%
                    </span>
                    <span class="trend-text">较上月</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon active-icon">
                  <el-icon size="24"><Check /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">已激活卡密</div>
                  <div class="stat-value">{{ stats.activeCardCount }}</div>
                  <div class="stat-trend">
                    <span :class="['trend-indicator', stats.activeRate >= 0 ? 'up' : 'down']">
                      {{ stats.activeRate >= 0 ? '+' : '' }}{{ stats.activeRate }}%
                    </span>
                    <span class="trend-text">激活率</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon revenue-icon">
                  <el-icon size="24"><Money /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">总收入</div>
                  <div class="stat-value">¥{{ formatMoney(stats.totalRevenue) }}</div>
                  <div class="stat-trend">
                    <span :class="['trend-indicator', stats.revenueGrowth >= 0 ? 'up' : 'down']">
                      {{ stats.revenueGrowth >= 0 ? '+' : '' }}{{ stats.revenueGrowth }}%
                    </span>
                    <span class="trend-text">较上月</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>卡密激活趋势</span>
                  <el-radio-group v-model="activationPeriod" size="small">
                    <el-radio-button label="week">本周</el-radio-button>
                    <el-radio-button label="month">本月</el-radio-button>
                    <el-radio-button label="year">本年</el-radio-button>
                  </el-radio-group>
                </div>
              </template>
              <div class="chart-container">
                <div id="activationChart" class="chart"></div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>收入趋势</span>
                  <el-radio-group v-model="revenuePeriod" size="small">
                    <el-radio-button label="week">本周</el-radio-button>
                    <el-radio-button label="month">本月</el-radio-button>
                    <el-radio-button label="year">本年</el-radio-button>
                  </el-radio-group>
                </div>
              </template>
              <div class="chart-container">
                <div id="revenueChart" class="chart"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon spec-icon">
                  <el-icon size="24"><List /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">产品规格</div>
                  <div class="stat-value">{{ stats.specCount }}</div>
                  <div class="stat-trend">
                    <span class="trend-indicator neutral">{{ stats.activeSpecCount }} 激活</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon category-icon">
                  <el-icon size="24"><FolderOpened /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">产品分类</div>
                  <div class="stat-value">{{ stats.categoryCount }}</div>
                  <div class="stat-trend">
                    <span class="trend-indicator neutral">{{ stats.activeCategoryCount }} 激活</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-item">
                <div class="stat-icon today-icon">
                  <el-icon size="24"><Calendar /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-title">今日激活</div>
                  <div class="stat-value">{{ stats.todayActiveCount }}</div>
                  <div class="stat-trend">
                    <span :class="['trend-indicator', stats.todayGrowth >= 0 ? 'up' : 'down']">
                      {{ stats.todayGrowth >= 0 ? '+' : '' }}{{ stats.todayGrowth }}%
                    </span>
                    <span class="trend-text">较昨日</span>
                  </div>
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
import { ref, onMounted, nextTick, watch } from 'vue'
import { User, CreditCard, Check, Money, List, FolderOpened, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import api from '@/api/index.js'
import * as echarts from 'echarts'

// 统计数据
const stats = ref({
  userCount: 0,
  userGrowth: 0,
  cardCount: 0,
  cardGrowth: 0,
  activeCardCount: 0,
  activeRate: 0,
  totalRevenue: 0,
  revenueGrowth: 0,
  specCount: 0,
  activeSpecCount: 0,
  categoryCount: 0,
  activeCategoryCount: 0,
  todayActiveCount: 0,
  todayGrowth: 0
})

// 系统运行时间
const uptime = ref('')

// 图表周期选择
const activationPeriod = ref('week')
const revenuePeriod = ref('week')

// 图表实例
let activationChart = null
let revenueChart = null

// 格式化存储大小（字节转换为可读格式）
const formatStorageSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化金额
const formatMoney = (amount) => {
  if (!amount) return '0'
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
}

/* 不同类型图标的背景色 */
.user-icon {
  background-color: rgba(64, 158, 255, 0.1);
}

.user-icon .el-icon {
  color: #409EFF;
}

.card-icon {
  background-color: rgba(103, 194, 58, 0.1);
}

.card-icon .el-icon {
  color: #67C23A;
}

.active-icon {
  background-color: rgba(230, 162, 60, 0.1);
}

.active-icon .el-icon {
  color: #E6A23C;
}

.revenue-icon {
  background-color: rgba(245, 108, 108, 0.1);
}

.revenue-icon .el-icon {
  color: #F56C6C;
}

.spec-icon {
  background-color: rgba(144, 147, 153, 0.1);
}

.spec-icon .el-icon {
  color: #909399;
}

.category-icon {
  background-color: rgba(121, 87, 213, 0.1);
}

.category-icon .el-icon {
  color: #7957D5;
}

.today-icon {
  background-color: rgba(255, 156, 110, 0.1);
}

.today-icon .el-icon {
  color: #FF9C6E;
}

.stat-icon .el-icon {
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

.stat-trend {
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 12px;
}

.trend-indicator {
  margin-right: 4px;
  font-weight: 500;
}

.trend-indicator.up {
  color: #67C23A;
}

.trend-indicator.down {
  color: #F56C6C;
}

.trend-indicator.neutral {
  color: #909399;
}

.trend-text {
  color: #C0C4CC;
}

/* 图表样式 */
.chart-container {
  height: 300px;
  width: 100%;
}

.chart {
  height: 100%;
  width: 100%;
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