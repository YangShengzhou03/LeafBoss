<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon total">
              <el-icon><CreditCard /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalCards }}</div>
              <div class="stat-label">总卡数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon unused">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.unusedCards }}</div>
              <div class="stat-label">未使用</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon used">
              <el-icon><Finished /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.usedCards }}</div>
              <div class="stat-label">已使用</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon disabled">
              <el-icon><Close /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.disabledCards }}</div>
              <div class="stat-label">已禁用</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>卡状态分布</span>
          </template>
          <div ref="statusChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>卡等级分布</span>
          </template>
          <div ref="levelChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近操作 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>最近操作记录</span>
      </template>
      <el-table :data="recentOperations" stripe>
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="cardNumber" label="卡号" width="150" />
        <el-table-column prop="operation" label="操作" width="120" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { CreditCard, Clock, Finished, Close } from '@element-plus/icons-vue'

// 统计数据
const stats = ref({
  totalCards: 1256,
  unusedCards: 342,
  usedCards: 567,
  disabledCards: 89
})

// 最近操作记录
const recentOperations = ref([
  {
    time: '2024-01-15 10:30:25',
    cardNumber: 'CARD20240115001',
    operation: '激活',
    operator: '管理员',
    remark: '用户激活使用'
  },
  {
    time: '2024-01-15 09:15:10',
    cardNumber: 'CARD20240114005',
    operation: '补充',
    operator: '管理员',
    remark: '补充卡次数'
  },
  {
    time: '2024-01-14 16:45:30',
    cardNumber: 'CARD20240113012',
    operation: '新增',
    operator: '管理员',
    remark: '批量导入新卡'
  },
  {
    time: '2024-01-14 14:20:15',
    cardNumber: 'CARD20240112008',
    operation: '使用',
    operator: '用户A',
    remark: '正常使用消耗'
  },
  {
    time: '2024-01-13 11:05:40',
    cardNumber: 'CARD20240111003',
    operation: '过期',
    operator: '系统',
    remark: '自动标记过期'
  }
])

// 图表实例
let statusChart = null
let levelChart = null

// 初始化状态分布图表
const initStatusChart = () => {
  const chartDom = document.querySelector('.dashboard .el-row .el-col:first-child .el-card .el-card__body div')
  if (!chartDom) return
  
  statusChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: '卡状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: [
          { value: stats.value.unusedCards, name: '未使用' },
          { value: stats.value.usedCards, name: '已使用' },
          { value: stats.value.disabledCards, name: '已禁用' }
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
  
  statusChart.setOption(option)
}

// 初始化等级分布图表
const initLevelChart = () => {
  const chartDom = document.querySelector('.dashboard .el-row .el-col:last-child .el-card .el-card__body div')
  if (!chartDom) return
  
  levelChart = echarts.init(chartDom)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['普通会员', '超级会员', '钻石会员']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [456, 342, 458],
        type: 'bar',
        itemStyle: {
          color: function(params) {
            const colorList = ['#5470c6', '#91cc75', '#fac858']
            return colorList[params.dataIndex]
          }
        }
      }
    ]
  }
  
  levelChart.setOption(option)
}

// 响应式调整图表
const resizeCharts = () => {
  statusChart?.resize()
  levelChart?.resize()
}

onMounted(() => {
  // 等待DOM渲染完成
  setTimeout(() => {
    initStatusChart()
    initLevelChart()
    
    // 监听窗口大小变化
    window.addEventListener('resize', resizeCharts)
  }, 100)
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  margin-bottom: 0;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.stat-icon.total {
  background: #409EFF;
}

.stat-icon.unused {
  background: #409EFF;
}

.stat-icon.used {
  background: #67C23A;
}

.stat-icon.disabled {
  background: #F56C6C;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}
</style>