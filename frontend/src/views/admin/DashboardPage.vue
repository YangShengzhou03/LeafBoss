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

        <!-- 第二行：图表和详细数据 -->
        <el-row :gutter="20" class="charts-row">
          <el-col :span="24">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>销量前五的商品-规格</span>
                </div>
              </template>
              <div class="products-container">
                <div class="product-list">
                  <div 
                    class="product-row" 
                    v-for="(product, index) in topProducts" 
                    :key="index"
                  >
                    <div class="product-rank">
                      <span class="rank-number">{{ index + 1 }}</span>
                    </div>
                    <div class="product-details">
                      <div class="product-name">{{ product.name }}</div>
                      <div class="product-spec">{{ product.spec }}</div>
                    </div>
                    <div class="product-sales">
                      <span class="sales-count">{{ product.sales }}</span>
                      <span class="sales-unit">张</span>
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Refresh, Key, Money, Goods, Coin
} from '@element-plus/icons-vue'

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

// 系统运行时间
const uptime = ref('0天0小时0分钟')
const loading = ref(false)

// 销量前五的商品数据
const topProducts = ref([])

// 刷新数据
const refreshData = async () => {
  await loadDashboardData()
}

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    loading.value = true
    // 模拟数据加载 - 使用更有实际意义的数据
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
    

    // 模拟销量前五的商品数据
    topProducts.value = [
      { name: 'VIP会员月卡', spec: '月卡', sales: 568 },
      { name: '在线课程服务', spec: '标准版', sales: 423 },
      { name: '实体礼品卡', spec: '豪华版', sales: 289 },
      { name: 'VIP会员月卡', spec: '季卡', sales: 156 },
      { name: '在线课程服务', spec: '高级版', sales: 98 }
    ]
    
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
  border-radius: 4px;
}

.chart-header {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.chart-container {
  padding: 16px 0;
}



/* 商品列表样式 */
.products-container {
  padding: 16px 0;
  min-height: 200px;
}

.product-list {
  display: flex;
  flex-direction: column;
  height: auto;
}

.product-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  min-height: 56px;
  flex: none;
}

.product-row:last-child {
  border-bottom: none;
}

.product-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #79bbff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.rank-number {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.product-spec {
  font-size: 12px;
  color: #909399;
}

.product-sales {
  display: flex;
  align-items: baseline;
}

.sales-count {
  font-size: 16px;
  font-weight: 600;
  color: #67c23a;
  margin-right: 4px;
}

.sales-unit {
  font-size: 12px;
  color: #909399;
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
  
  .quick-actions {
    justify-content: center;
  }
  
  .trend-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .trend-bar {
    width: 100%;
  }
}

/* 确保两个卡片高度自适应 */
.chart-card {
  margin-top: 20px;
  border-radius: 4px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.chart-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  min-height: 200px;
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