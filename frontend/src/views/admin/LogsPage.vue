<template>
  <div class="admin-logs-page">
    <el-card class="logs-card">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
        </div>
      </template>
      
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-date-picker
              v-model="filter.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              @change="handleFilter"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="19">
            <div class="action-buttons">
              <el-button @click="resetFilter">重置</el-button>
              <el-button @click="exportLogs" :loading="exporting">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
              <el-button type="danger" @click="clearLogs" :loading="clearing">
                <el-icon><Delete /></el-icon>
                清空
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-item">
              <span class="stat-label">登录：</span>
              <span class="stat-value success">{{ stats.loginCount }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <span class="stat-label">卡密操作：</span>
              <span class="stat-value primary">{{ stats.cardKeyCount }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <span class="stat-label">商品规格管理：</span>
              <span class="stat-value info">{{ stats.productSpecCount }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <span class="stat-label">总计：</span>
              <span class="stat-value total">{{ stats.totalCount }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- 日志列表 -->
      <el-table v-loading="loading" :data="logs" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="operationType" label="操作类型" width="200">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.operationType)" size="small">
              {{ getOperationTypeName(row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" width="130" />
        <el-table-column prop="createTime" label="时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="viewLogDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalLogs"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 日志详情对话框 -->
    <el-dialog v-model="showLogDetail" title="日志详情" width="600px">
      <div v-if="selectedLog">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="ID">{{ selectedLog.id }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">
            <el-tag :type="getLevelType(selectedLog.operationType)">
              {{ getOperationTypeName(selectedLog.operationType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ selectedLog.ipAddress }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ selectedLog.createTime }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ selectedLog.description }}</el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <h4>详细信息</h4>
        <div class="log-detail-content">{{ selectedLog.userAgent }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Delete } from '@element-plus/icons-vue'
import { AdminService } from '@/services/api.js'

// 响应式数据
const loading = ref(false)
const exporting = ref(false)
const clearing = ref(false)
const logs = ref([])
const totalLogs = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const showLogDetail = ref(false)
const selectedLog = ref(null)

// 统计信息
const stats = ref({
  loginCount: 0,
  cardKeyCount: 0,
  productSpecCount: 0,
  totalCount: 0
})

// 筛选条件
const filter = reactive({
  dateRange: []
})

// 获取操作类型对应的标签类型
const getLevelType = (operationType) => {
  switch (operationType) {
    case 'LOGIN': return 'success'
    case 'UPLOAD_FILE': return 'primary'
    case 'DOWNLOAD_FILE': return 'info'
    case 'DELETE_FILE': return 'warning'
    case 'UPDATE_USER_STATUS': return 'danger'
    case 'CLEAR_LOGS': return 'danger'
    default: return ''
  }
}

// 获取操作类型名称
const getOperationTypeName = (operationType) => {
  switch (operationType) {
    case 'LOGIN': return '登录'
    case 'UPLOAD_FILE': return '上传文件'
    case 'DOWNLOAD_FILE': return '下载文件'
    case 'DELETE_FILE': return '删除文件'
    case 'CREATE_SHARE': return '创建分享'
    case 'DELETE_SHARE': return '删除分享'
    case 'UPDATE_USER_STATUS': return '更新用户状态'
    case 'CLEAR_LOGS': return '清空日志'
    default: return operationType
  }
}

// 重置筛选条件
const resetFilter = () => {
  filter.dateRange = []
  currentPage.value = 1
  loadLogs()
}

// 更新统计数据
const updateStats = () => {
  const statsData = calculateStats(logs.value)
  stats.value = statsData
}

// 计算统计信息
const calculateStats = (logs) => {
  const stats = {
    loginCount: 0,
    cardKeyCount: 0,
    productSpecCount: 0,
    totalCount: logs.length
  }
  
  logs.forEach(log => {
    switch (log.operationType) {
      case 'LOGIN':
        stats.loginCount++
        break
      case 'CARD_KEY_GENERATE':
      case 'CARD_KEY_VERIFY':
      case 'CARD_KEY_EDIT':
      case 'CARD_KEY_DELETE':
        stats.cardKeyCount++
        break
      case 'PRODUCT_MANAGE':
      case 'SPEC_MANAGE':
        stats.productSpecCount++
        break
    }
  })
  
  return stats
}

// 加载日志数据
const loadLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: pageSize.value
    }
    
    // 添加时间范围参数
    if (filter.dateRange && filter.dateRange.length === 2) {
      params.startDate = filter.dateRange[0]
      params.endDate = filter.dateRange[1]
    }
    
    const response = await AdminService.getLogList(params)
    logs.value = response.content || []
    totalLogs.value = response.totalElements || 0
    updateStats()
  } catch (error) {
    // 错误已由AdminService处理，这里不需要额外处理
    console.error('加载日志数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
  loadLogs()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadLogs()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadLogs()
}

// 查看日志详情
const viewLogDetail = (log) => {
  selectedLog.value = log
  showLogDetail.value = true
}

// 导出日志
const exportLogs = async () => {
  exporting.value = true
  try {
    const params = {}
    
    // 添加时间范围参数
    if (filter.dateRange && filter.dateRange.length === 2) {
      params.startDate = filter.dateRange[0]
      params.endDate = filter.dateRange[1]
    }
    
    const response = await AdminService.get('/admin/log/export', {
      responseType: 'blob',
      params: params
    })

    // 创建下载链接
    const blob = new Blob([response.data], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logs_${new Date().toISOString().substring(0, 10)}.json`
    link.click()
    window.URL.revokeObjectURL(url)

    ElMessage.success('日志导出成功')
  } catch (error) {
    ElMessage.error('导出日志失败')
  } finally {
    exporting.value = false
  }
}

// 清空日志
const clearLogs = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有日志吗？此操作不可恢复！',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    clearing.value = true

    await AdminService.delete('/admin/log')

    logs.value = []
    totalLogs.value = 0
    ElMessage.success('日志清空成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空日志失败')
    }
  } finally {
    clearing.value = false
  }
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped>
.admin-logs-page {
  padding: 0;
  background-color: #f0f2f5;
}

.logs-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.logs-card :deep(.el-card__body) {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-section {
  margin-bottom: 16px;
  padding: 16px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.stats-section {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #e6e8eb;
  background-color: #fafafa;
  border-radius: 4px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.primary {
  color: #409eff;
}

.stat-value.info {
  color: #909399;
}

.stat-value.warning {
  color: #e6a23c;
}

.stat-value.danger {
  color: #f56c6c;
}

.stat-value.total {
  color: #303133;
}

.pagination-container {
  margin-top: 16px;
  text-align: right;
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e6e8eb;
}

.log-detail-content {
  background-color: #f5f7fa;
  padding: 15px;
  white-space: pre-wrap;
  font-family: monospace;
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-logs-page {
    padding: 10px;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 5px;
  }
}
</style>