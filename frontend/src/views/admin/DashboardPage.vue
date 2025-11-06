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
                <!-- 图表内容已清空 -->
              </div>
            </el-card>
          </el-col>
          
          <!-- 销量前五商品数量 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>销量前五商品数量</span>
                </div>
              </template>
              <div class="chart-container">
                <div class="product-bar-chart">
                  <div 
                    v-for="(item, index) in topProducts" 
                    :key="index"
                    class="bar-item"
                  >
                    <div class="bar-info-left">
                      <span class="product-name">{{ item.name }}</span>
                      <span class="product-spec">{{ item.spec }}</span>
                    </div>
                    <div class="bar-container">
                      <div 
                        class="bar-fill" 
                        :style="{ width: (item.sales / maxProductSales) * 100 + '%', background: getProductColor(index) }"
                      ></div>
                    </div>
                    <span class="sales-count">{{ item.sales }}</span>
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

// 计算最大商品销售量用于横向数据条
const maxProductSales = computed(() => {
  if (topProducts.value.length === 0) return 1
  return Math.max(...topProducts.value.map(item => item.sales))
})

// 获取商品颜色
const getProductColor = (index) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
  return colors[index] || '#909399'
}



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
    console.log('后端响应内容:', response)
    console.log('响应数据:', response?.data)
    
    if (response && response.data) {
      const data = response.data
      console.log('解析后的数据:', data)
      
      // 正确映射后端返回的数据到前端期望的结构
      stats.value = {
        cardKeyCount: data.totalOrders || 0, // 使用totalOrders作为卡密总数
        productCount: data.activeUsers || 0,  // 使用activeUsers作为商品总数
        dailySales: data.dailySales || 0,
        dailyRevenue: data.dailyRevenue || 0,
        cardKeyGrowth: data.conversionRate || 0, // 使用conversionRate作为卡密增长率
        productGrowth: data.dailyRevenueChange || 0, // 使用dailyRevenueChange作为商品增长率
        dailySalesGrowth: data.dailySalesChange || 0,
        dailyGrowth: data.dailyRevenueChange || 0
      }
      
      // 获取销量前五的商品数据（后端暂无此数据，使用空数组）
      topProducts.value = []
    } else {
      // API返回空数据时，使用空数据
      stats.value = {
        cardKeyCount: 0,
        productCount: 0,
        dailySales: 0,
        dailyRevenue: 0,
        cardKeyGrowth: 0,
        productGrowth: 0,
        dailySalesGrowth: 0,
        dailyGrowth: 0
      }
      
      topProducts.value = []
      
      // 空数据时给出提示
      ElMessage.warning('仪表盘数据为空，请检查数据配置')
    }
    
  } catch (error) {
    // 根据错误类型给出不同的提示
    if (error.response && error.response.status === 401) {
      // 401错误已经在拦截器中处理，这里不需要重复提示
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      ElMessage.error('网络连接失败，请检查网络连接')
    } else if (error.response.status === 500) {
      ElMessage.error('服务器内部错误，请联系管理员')
    } else {
      ElMessage.error('加载仪表盘数据失败，请稍后重试')
    }
    
    // 出错时使用空数据
    stats.value = {
      cardKeyCount: 0,
      productCount: 0,
      dailySales: 0,
      dailyRevenue: 0,
      cardKeyGrowth: 0,
      productGrowth: 0,
      dailySalesGrowth: 0,
      dailyGrowth: 0
    }
    
    topProducts.value = []
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
  height: 360px;
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

/* 柱形图样式 */
 .bar-chart {
   position: relative;
   height: 160px;
   width: 100%;
 }
 
 .chart-grid {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 40px;
   display: flex;
   flex-direction: column;
   justify-content: space-between;
 }
 
 .grid-line {
   height: 1px;
   background: #f0f0f0;
   width: 100%;
 }
 
 .bars-container {
   position: absolute;
   top: 0;
   left: 16px;
   right: 16px;
   bottom: 40px;
   display: flex;
   align-items: flex-end;
   justify-content: space-between;
 }
 
 .bar-item-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   height: 100%;
   flex: 1;
   margin: 0 4px;
 }
 
 .bar-wrapper {
   flex: 1;
   width: 24px;
   background: #f5f7fa;
   display: flex;
   align-items: flex-end;
   position: relative;
 }
 
 .bar-fill {
   width: 100%;
   background: #409eff;
   min-height: 4px;
 }
 
 .bar-item-container:hover .bar-fill {
   background: #337ecc;
 }
 
 .bar-info {
   display: flex;
   flex-direction: column;
   align-items: center;
   margin-top: 8px;
 }
 
 .bar-label {
   font-size: 12px;
   color: #303133;
   font-weight: 600;
   margin-bottom: 2px;
 }
 
 .date-label {
   font-size: 11px;
   color: #909399;
 }



/* 商品销售占比样式 - 横向数据条布局 */
.product-bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding: 0 16px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 32px;
}

.bar-info-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 180px;
  min-width: 180px;
}

.product-name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 2px;
}

.product-spec {
  font-size: 12px;
  color: #909399;
}

.sales-count {
  font-size: 16px;
  color: #409eff;
  font-weight: 600;
}

.bar-container {
   flex: 1;
   height: 16px;
   background: #f5f7fa;
   overflow: hidden;
   position: relative;
   border: 1px solid #e4e7ed;
   margin-right: 8px;
 }
 
 .bar-fill {
   height: 100%;
   position: relative;
 }
 
 .bar-item:hover .bar-fill {
   opacity: 0.9;
 }
 
 .bar-item:hover .bar-container {
   border-color: #c6e2ff;
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