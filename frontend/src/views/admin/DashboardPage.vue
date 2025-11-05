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
        <!-- 第一行：核心统计数据 -->
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
                  <div class="stat-title">商品总数</div>
                  <div class="stat-value">{{ stats.productCount }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">较上月</span>
                    <span class="trend-value positive">+{{ stats.productGrowth }}%</span>
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
                  <div class="stat-value">¥{{ stats.dailyRevenue }}</div>
                  <div class="stat-trend">
                    <span class="trend-text">较昨日</span>
                    <span class="trend-value positive">+{{ stats.dailyGrowth }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 图表数据 -->
        <el-row :gutter="20" class="charts-row">
          <!-- 销售趋势图 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>近7日销售趋势</span>
                </div>
              </template>
              <div class="chart-container">
                <div class="trend-chart">
                  <div class="trend-item" v-for="(item, index) in salesTrend" :key="index">
                    <div class="trend-bar-container">
                      <div 
                        class="trend-bar" 
                        :style="{ height: (item.sales / maxSales) * 100 + '%' }"
                        :class="{ 'today': index === salesTrend.length - 1 }"
                      ></div>
                    </div>
                    <div class="trend-label">{{ item.date }}</div>
                    <div class="trend-value">{{ item.sales }}</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <!-- 商品销售占比 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>商品销售占比</span>
                </div>
              </template>
              <div class="chart-container">
                <div class="product-pie-chart">
                  <div class="pie-item" v-for="(item, index) in productSalesRatio" :key="index">
                    <div class="pie-slice" :style="{ backgroundColor: item.color, width: item.percentage + '%' }"></div>
                    <div class="pie-info">
                      <span class="pie-label">{{ item.name }}</span>
                      <span class="pie-value">{{ item.percentage }}%</span>
                    </div>
                  </div>
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
import { 
  Refresh, Key, Money, Goods, Coin
} from '@element-plus/icons-vue'
import api from '../../services/api'

// 统计数据
const stats = ref({
  cardKeyCount: 0,
  productCount: 0,
  dailySales: 0,
  dailyRevenue: 0,
  cardKeyGrowth: 0,
  productGrowth: 0,
  dailySalesGrowth: 0,
  dailyGrowth: 0
})

const loading = ref(false)

// 销量前五的商品数据
const topProducts = ref([])

// 销售趋势数据
const salesTrend = ref([
  { date: '12-01', sales: 120 },
  { date: '12-02', sales: 145 },
  { date: '12-03', sales: 98 },
  { date: '12-04', sales: 167 },
  { date: '12-05', sales: 132 },
  { date: '12-06', sales: 189 },
  { date: '12-07', sales: 156 }
])

// 商品销售占比数据
const productSalesRatio = ref([
  { name: 'VIP会员月卡', percentage: 35, color: '#409eff' },
  { name: '在线课程服务', percentage: 25, color: '#67c23a' },
  { name: '实体礼品卡', percentage: 20, color: '#e6a23c' },
  { name: 'VIP会员季卡', percentage: 12, color: '#f56c6c' },
  { name: '其他商品', percentage: 8, color: '#909399' }
])

// 计算最大销售值用于趋势图
const maxSales = computed(() => {
  return Math.max(...salesTrend.value.map(item => item.sales))
})

// 刷新数据
const refreshData = async () => {
  await loadDashboardData()
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true
    
    // 使用API获取仪表盘统计数据
    const response = await api.admin.getDashboardStats()
    if (response && response.data) {
      const data = response.data
      stats.value = {
        cardKeyCount: data.cardKeyCount || 0,
        productCount: data.productCount || 0,
        dailySales: data.dailySales || 0,
        dailyRevenue: data.dailyRevenue || 0,
        cardKeyGrowth: data.cardKeyGrowth || 0,
        productGrowth: data.productGrowth || 0,
        dailySalesGrowth: data.dailySalesGrowth || 0,
        dailyGrowth: data.dailyGrowth || 0
      }
      
      // 获取销量前五的商品数据
      topProducts.value = data.topProducts || []
    } else {
      // 如果API返回空数据，使用默认数据
      stats.value = {
        cardKeyCount: 1568,
        productCount: 28,
        dailySales: 156,
        dailyRevenue: 5680,
        cardKeyGrowth: 12.5,
        productGrowth: 8.3,
        dailySalesGrowth: 15.2,
        dailyGrowth: 6.8
      }
      
      topProducts.value = [
        { name: 'VIP会员月卡', spec: '月卡', sales: 568 },
        { name: '在线课程服务', spec: '标准版', sales: 423 },
        { name: '实体礼品卡', spec: '豪华版', sales: 289 },
        { name: 'VIP会员月卡', spec: '季卡', sales: 156 },
        { name: '在线课程服务', spec: '高级版', sales: 98 }
      ]
    }
    
  } catch (error) {
    ElMessage.error('加载仪表盘数据失败')
    console.error('Dashboard data loading error:', error)
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
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
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
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.chart-header {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.chart-container {
  padding: 16px 0;
  min-height: 200px;
}

/* 销售趋势图样式 */
.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 160px;
  padding: 0 8px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 4px;
}

.trend-bar-container {
  width: 100%;
  height: 100px;
  background: #f5f7fa;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.trend-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #409eff, #79bbff);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}

.trend-bar.today {
  background: linear-gradient(135deg, #67c23a, #95d475);
}

.trend-label {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.trend-value {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}



/* 商品销售占比样式 */
.product-pie-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pie-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.pie-slice {
  height: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.pie-item:hover .pie-slice {
  transform: scaleY(1.5);
}

.pie-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.pie-label {
  font-size: 14px;
  color: #606266;
}

.pie-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}



/* 系统状态样式 */
.system-status {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.status-label {
  font-size: 14px;
  color: #606266;
}

.status-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.status-good {
  color: #67c23a;
}

/* 快速操作样式 */
.actions-card {
  margin-top: 20px;
  border-radius: 4px;
}

.actions-header {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-row .el-col {
    margin-bottom: 16px;
  }
  
  .charts-row .el-col {
    margin-bottom: 16px;
  }
}

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
  
  .charts-row .el-col {
    width: 100%;
  }
  
  .trend-chart {
    height: 140px;
  }
  
  .trend-bar-container {
    height: 80px;
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
  
  .trend-chart {
    height: 120px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .trend-item {
    flex: 0 0 14%;
    margin-bottom: 16px;
  }
  
  .trend-bar-container {
    height: 60px;
  }
  
  .distribution-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .distribution-details {
    width: 100%;
    justify-content: space-between;
  }
  
  .pie-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .pie-slice {
    width: 100% !important;
  }
  
  .pie-info {
    width: 100%;
  }
  
  .monthly-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .monthly-value {
    font-size: 14px;
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
  
  .trend-chart {
    height: 100px;
  }
  
  .trend-item {
    flex: 0 0 12%;
  }
  
  .trend-bar-container {
    height: 50px;
  }
  
  .trend-label {
    font-size: 10px;
  }
  
  .trend-value {
    font-size: 12px;
  }
  
  .chart-container {
    padding: 8px 0;
  }
  
  .product-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    text-align: left;
  }
  
  .product-rank {
    margin-right: 0;
    margin-bottom: 8px;
  }
  
  .product-sales {
    align-self: flex-end;
  }
}
</style>