<template>
  <div class="logs-container">
    <!-- 搜索和筛选 -->
    <div class="filter-container">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索卡密编号、操作人或操作内容"
        style="width: 300px"
        clearable
        @clear="handleSearch"
      />
      <el-select v-model="filterAction" placeholder="操作类型" clearable @change="handleSearch">
        <el-option label="添加卡密" value="add" />
        <el-option label="删除卡密" value="delete" />
        <el-option label="验证卡密" value="validate" />
        <el-option label="批量操作" value="batch" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="操作状态" clearable @change="handleSearch">
        <el-option label="成功" value="success" />
        <el-option label="失败" value="failed" />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>
        搜索
      </el-button>
    </div>

    <!-- 统计信息 -->
    <div class="stats-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalLogs }}</div>
            <div class="stat-label">总记录数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value success">{{ stats.successLogs }}</div>
            <div class="stat-label">成功操作</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value failed">{{ stats.failedLogs }}</div>
            <div class="stat-label">失败操作</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ stats.todayLogs }}</div>
            <div class="stat-label">今日操作</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格容器 -->
    <div class="table-container">
      <!-- 日志表格 -->
      <el-table 
        :data="paginatedLogs" 
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="timestamp" label="操作时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="cardId" label="卡密编号" width="200">
          <template #default="{ row }">
            <el-tooltip v-if="row.cardId" :content="row.cardId" placement="top">
              <span class="card-id">{{ truncateCardId(row.cardId) }}</span>
            </el-tooltip>
            <span v-else class="no-data">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)">
              {{ getActionLabel(row.action) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="details" label="操作详情" min-width="200">
          <template #default="{ row }">
            <div class="details-content">
              {{ row.details }}
              <el-tooltip v-if="row.error" :content="row.error" placement="top">
                <el-tag v-if="row.status === 'failed'" size="small" type="danger">
                  错误详情
                </el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="viewLogDetails(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 日志详情弹窗 -->
    <el-dialog v-model="showDetailDialog" title="操作详情" width="600px">
      <el-descriptions v-if="currentLog" :column="1" border>
        <el-descriptions-item label="操作时间">
          {{ formatDateTime(currentLog.timestamp) }}
        </el-descriptions-item>
        <el-descriptions-item label="卡密编号">
          {{ currentLog.cardId || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="getActionType(currentLog.action)">
            {{ getActionLabel(currentLog.action) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ currentLog.operator }}
        </el-descriptions-item>
        <el-descriptions-item label="操作详情">
          {{ currentLog.details }}
        </el-descriptions-item>
        <el-descriptions-item label="操作状态">
          <el-tag :type="currentLog.status === 'success' ? 'success' : 'danger'">
            {{ currentLog.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">
          {{ currentLog.ipAddress }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentLog.error" label="错误信息">
          <el-alert :title="currentLog.error" type="error" :closable="false" />
        </el-descriptions-item>
        <el-descriptions-item v-if="currentLog.extraData" label="额外数据">
          <pre class="extra-data">{{ JSON.stringify(currentLog.extraData, null, 2) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterAction = ref('')
const filterStatus = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showDetailDialog = ref(false)
const currentLog = ref(null)

// 模拟日志数据（实际项目中应从API获取）
const logs = ref([
  {
    id: 'LOG-20240115-001',
    timestamp: '2024-01-15T14:30:00Z',
    cardId: 'CARD-20240115-001',
    action: 'add',
    operator: 'admin',
    details: '添加了50张VIP会员卡',
    status: 'success',
    ipAddress: '192.168.1.100'
  },
  {
    id: 'LOG-20240115-002',
    timestamp: '2024-01-15T13:15:00Z',
    cardId: 'CARD-20240115-002',
    action: 'validate',
    operator: 'user001',
    details: '卡密验证成功 - 规格类型: 月卡',
    status: 'success',
    ipAddress: '192.168.1.101'
  },
  {
    id: 'LOG-20240115-003',
    timestamp: '2024-01-15T11:20:00Z',
    cardId: 'CARD-20240114-001',
    action: 'delete',
    operator: 'admin',
    details: '删除卡密',
    status: 'failed',
    error: '卡密不存在或已被使用',
    ipAddress: '192.168.1.100'
  }
])

// 统计信息
const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = logs.value.filter(log => 
    log.timestamp.split('T')[0] === today
  )
  
  return {
    totalLogs: logs.value.length,
    successLogs: logs.value.filter(log => log.status === 'success').length,
    failedLogs: logs.value.filter(log => log.status === 'failed').length,
    todayLogs: todayLogs.length
  }
})

// 过滤后的日志
const filteredLogs = computed(() => {
  let filtered = logs.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(log => 
      log.cardId?.toLowerCase().includes(keyword) ||
      log.operator?.toLowerCase().includes(keyword) ||
      log.details?.toLowerCase().includes(keyword)
    )
  }
  
  if (filterAction.value) {
    filtered = filtered.filter(log => log.action === filterAction.value)
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(log => log.status === filterStatus.value)
  }
  
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= end
    })
  }
  
  return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

// 分页数据
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// 工具函数
const getActionLabel = (action) => {
  const actionMap = {
    'add': '添加卡密',
    'delete': '删除卡密',
    'validate': '验证卡密',
    'batch': '批量操作'
  }
  return actionMap[action] || action
}

const getActionType = (action) => {
  const typeMap = {
    'add': 'success',
    'delete': 'danger',
    'validate': 'primary',
    'batch': 'warning'
  }
  return typeMap[action] || 'info'
}

const truncateCardId = (cardId) => {
  return cardId.length > 15 ? cardId.substring(0, 15) + '...' : cardId
}

const formatDateTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 事件处理
const handleSearch = () => {
  currentPage.value = 1
  total.value = filteredLogs.value.length
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const viewLogDetails = (log) => {
  currentLog.value = log
  showDetailDialog.value = true
}

onMounted(() => {
  loading.value = true
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false
    total.value = logs.value.length
  }, 500)
})
</script>

<style scoped>
.card-logs-page {
  padding: 0;
}

.logs-container {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-container {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.stats-container {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-value.success {
  color: #67C23A;
}

.stat-value.failed {
  color: #F56C6C;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.card-id {
  cursor: pointer;
  color: #409EFF;
}

.no-data {
  color: #C0C4CC;
  font-style: italic;
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.extra-data {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow: auto;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table__header) {
  background-color: #f8f9fa;
}

:deep(.el-table__header th) {
  font-weight: 500;
  color: #606266;
}

/* 对话框样式优化 */
:deep(.el-dialog) {
  border-radius: 4px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

/* 表单样式优化 */
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 4px;
}

@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .filter-container > * {
    width: 100%;
  }
}
</style>