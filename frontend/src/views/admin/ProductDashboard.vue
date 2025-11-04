<template>
  <div class="product-dashboard">
    <div class="dashboard-header">
      <h2>商品管理仪表盘</h2>
      <p>查看商品和卡密的统计数据</p>
    </div>
    
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon product-icon">
                <el-icon size="32"><Goods /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.totalProducts }}</div>
                <div class="stats-label">商品总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon spec-icon">
                <el-icon size="32"><List /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.totalSpecs }}</div>
                <div class="stats-label">规格总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon key-icon">
                <el-icon size="32"><Key /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.totalKeys }}</div>
                <div class="stats-label">卡密总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stats-card">
            <div class="stats-content">
              <div class="stats-icon sold-icon">
                <el-icon size="32"><Select /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-number">{{ stats.soldKeys }}</div>
                <div class="stats-label">已售卡密</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="charts-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>商品销量排行</span>
              </div>
            </template>
            <div class="chart-content">
              <div id="salesChart" style="height: 300px;"></div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>卡密状态分布</span>
              </div>
            </template>
            <div class="chart-content">
              <div id="statusChart" style="height: 300px;"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <div class="recent-activities">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>最近活动</span>
            <el-button type="text" @click="refreshData">刷新</el-button>
          </div>
        </template>
        <el-table :data="recentActivities" style="width: 100%">
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="scope">
              <el-tag :type="getActivityType(scope.row.type)">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="operator" label="操作人" width="120" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Goods, List, Key, Select } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 统计数据
const stats = reactive({
  totalProducts: 0,
  totalSpecs: 0,
  totalKeys: 0,
  soldKeys: 0
})

// 最近活动数据
const recentActivities = ref([])

// 获取统计数据
const fetchStats = () => {
  // 模拟API调用，实际项目中应该调用后端API
  setTimeout(() => {
    stats.totalProducts = 25
    stats.totalSpecs = 48
    stats.totalKeys = 1250
    stats.soldKeys = 875
  }, 500)
}

// 获取最近活动
const fetchRecentActivities = () => {
  // 模拟API调用，实际项目中应该调用后端API
  setTimeout(() => {
    recentActivities.value = [
      {
        time: '2023-11-20 14:35:22',
        type: '商品创建',
        description: '创建了新商品"游戏点卡100元"',
        operator: '管理员'
      },
      {
        time: '2023-11-20 13:22:15',
        type: '卡密生成',
        description: '为商品"会员月卡"生成了100个卡密',
        operator: '管理员'
      },
      {
        time: '2023-11-20 12:15:08',
        type: '卡密验证',
        description: '用户验证了卡密"ABC123XYZ456"',
        operator: '系统'
      },
      {
        time: '2023-11-20 11:05:33',
        type: '规格更新',
        description: '更新了商品"视频会员"的价格规格',
        operator: '管理员'
      }
    ]
  }, 500)
}

// 初始化销量排行图表
const initSalesChart = () => {
  const chartDom = document.getElementById('salesChart')
  const myChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['游戏点卡', '视频会员', '音乐会员', '软件授权', '其他']
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [320, 250, 180, 120, 60],
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
  
  myChart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 初始化状态分布图表
const initStatusChart = () => {
  const chartDom = document.getElementById('statusChart')
  const myChart = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '卡密状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 875, name: '已售出' },
          { value: 250, name: '未售出' },
          { value: 75, name: '已使用' },
          { value: 50, name: '已过期' }
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
  
  myChart.setOption(option)
  
  // 响应式调整
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

// 获取活动类型样式
const getActivityType = (type) => {
  const typeMap = {
    '商品创建': 'success',
    '卡密生成': 'primary',
    '卡密验证': 'info',
    '规格更新': 'warning'
  }
  return typeMap[type] || 'info'
}

// 刷新数据
const refreshData = () => {
  fetchStats()
  fetchRecentActivities()
  initSalesChart()
  initStatusChart()
}

// 组件挂载时初始化
onMounted(() => {
  fetchStats()
  fetchRecentActivities()
  
  // 延迟初始化图表，确保DOM已渲染
  setTimeout(() => {
    initSalesChart()
    initStatusChart()
  }, 100)
})
</script>

<style scoped>
.product-dashboard {
  padding: 20px;
}

.dashboard-header {
  margin-bottom: 20px;
}

.dashboard-header h2 {
  margin: 0 0 5px 0;
  color: #303133;
}

.dashboard-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stats-container {
  margin-bottom: 20px;
}

.stats-card {
  height: 120px;
}

.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.product-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.spec-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.key-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.sold-icon {
  background-color: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.stats-info {
  flex: 1;
}

.stats-number {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.charts-container {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-content {
  height: calc(100% - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.recent-activities {
  margin-bottom: 20px;
}
</style>