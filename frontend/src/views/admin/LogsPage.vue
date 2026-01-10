<template>
  <div class="admin-logs-page">
    <el-card class="logs-card">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
        </div>
      </template>

      <div class="filter-section">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-date-picker v-model="filter.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 100%" />
          </el-col>
          <el-col :span="4">
            <el-select v-model="filter.operationType" placeholder="操作类型" clearable style="width: 100%">
              <el-option label="登录" value="LOGIN" />
              <el-option label="卡密操作" value="CARD_KEY" />
              <el-option label="产品操作" value="PRODUCT" />
              <el-option label="规格操作" value="SPECIFICATION" />
              <el-option label="用户操作" value="USER" />
              <el-option label="系统操作" value="SYSTEM" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <div class="action-buttons">
              <el-button type="primary" @click="handleFilter">查询</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="action-buttons" style="justify-content: flex-end;">
              <el-button @click="exportLogs" :loading="exporting">
                <el-icon>
                  <Upload />
                </el-icon>
                导出
              </el-button>
              <el-button type="danger" @click="clearLogs" :loading="clearing">
                <el-icon>
                  <Delete />
                </el-icon>
                清空
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table v-loading="loading" :data="logs" style="width: 100%" stripe @row-click="viewLogDetail">
        <template #empty>
          <div style="padding: 40px 0;">
            <el-empty description="暂无日志数据" />
          </div>
        </template>
        <el-table-column prop="operationType" label="操作" width="150" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.operationType)" size="small">
              {{ getOperationTypeName(row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="操作内容" min-width="120" show-overflow-tooltip />
        <el-table-column prop="ipAddress" label="IP地址" width="140" align="center" />
        <el-table-column prop="createdAt" label="操作时间" width="180" align="center" />
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="totalLogs" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <el-dialog v-model="showLogDetail" title="日志详情" width="500px">
      <div v-if="selectedLog">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="日志ID">{{ selectedLog.id }}</el-descriptions-item>
          <el-descriptions-item label="操作">
            <el-tag :type="getLevelType(selectedLog.operationType)">
              {{ getOperationTypeName(selectedLog.operationType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ selectedLog.ipAddress }}</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ selectedLog.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="操作内容">{{ selectedLog.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Upload } from '@element-plus/icons-vue'
import api from '../../services/api'

const loading = ref(false)
const exporting = ref(false)
const clearing = ref(false)
const logs = ref([])
const totalLogs = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const showLogDetail = ref(false)
const selectedLog = ref(null)

const filter = reactive({
  dateRange: [],
  operationType: ''
})

const getLevelType = (operationType) => {
  switch (operationType) {
    case 'LOGIN': return 'success'
    case 'CARD_KEY': return 'info'
    case 'PRODUCT': return 'info'
    case 'SPECIFICATION': return 'warning'
    case 'USER': return 'danger'
    case 'SYSTEM': return 'info'
    default: return 'info'
  }
}

const getOperationTypeName = (operationType) => {
  switch (operationType) {
    case 'LOGIN': return '登录'
    case 'CARD_KEY': return '卡密操作'
    case 'PRODUCT': return '产品操作'
    case 'SPECIFICATION': return '规格操作'
    case 'USER': return '用户操作'
    case 'SYSTEM': return '系统操作'
    default: return operationType
  }
}

const resetFilter = () => {
  filter.dateRange = []
  filter.operationType = ''
  currentPage.value = 1
  loadLogs()
}

const loadLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    if (filter.dateRange && filter.dateRange.length === 2) {
      params.startDate = filter.dateRange[0]
      params.endDate = filter.dateRange[1]
    }

    if (filter.operationType) {
      params.operationType = filter.operationType
    }

    const response = await api.admin.getLogList(params)

    if (response && response.data) {
      const data = response.data
      if (data.records) {
        logs.value = data.records
        totalLogs.value = data.total || 0
      } else if (data.content) {
        logs.value = data.content
        totalLogs.value = data.totalElements || 0
      } else {
        logs.value = []
        totalLogs.value = 0
      }
    }
  } catch (error) {
    ElMessage.error('加载日志数据失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  currentPage.value = 1
  loadLogs()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadLogs()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadLogs()
}

const viewLogDetail = (log) => {
  selectedLog.value = log
  showLogDetail.value = true
}

const exportLogs = async () => {
  exporting.value = true
  try {
    const params = {}

    if (filter.dateRange && filter.dateRange.length === 2) {
      params.startDate = filter.dateRange[0]
      params.endDate = filter.dateRange[1]
    }

    const response = await api.admin.exportLogs(params)

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

    await api.admin.clearLogs()

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
  padding: 0px;
  background-color: #f0f2f5;
  max-height: 100vh;
}

.logs-card {
  margin-bottom: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.logs-card :deep(.el-card__body) {
  padding: 16px;
}

.logs-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e6e8eb;
  background-color: #fafafa;
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
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e6e8eb;
}

.filter-section .el-row {
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.pagination-container {
  margin-top: 16px;
  text-align: right;
  padding: 16px 0 0;
  border-top: 1px solid #e6e8eb;
}

/* 表格样式优化 */
.logs-card :deep(.el-table) {
  border-radius: 6px;
  border: 1px solid #e6e8eb;
}

.logs-card :deep(.el-table__header) {
  background-color: #f5f7fa;
}

.logs-card :deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
  padding: 12px 8px;
}

.logs-card :deep(.el-table td) {
  padding: 12px 8px;
}

.logs-card :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

.logs-card :deep(.el-table .el-table__row) {
  cursor: pointer;
}

.logs-card :deep(.el-table .el-table__row:hover td) {
  background-color: #f5f7fa;
}

/* 按钮样式优化 */
.logs-card :deep(.el-button) {
  border-radius: 4px;
  padding: 8px 16px;
}

.logs-card :deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

.logs-card :deep(.el-button--danger) {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

@media (max-width: 768px) {
  .admin-logs-page {
    padding: 10px;
  }

  .logs-card :deep(.el-card__body) {
    padding: 12px;
  }

  .filter-section {
    padding: 12px;
    margin-bottom: 12px;
  }

  .filter-section :deep(.el-col) {
    margin-bottom: 12px;
  }

  .filter-section :deep(.el-col:last-child) {
    margin-bottom: 0;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .action-buttons :deep(.el-button) {
    width: 100%;
  }

  .header-actions {
    flex-direction: column;
    gap: 5px;
  }

  .table-container {
    overflow-x: auto;
  }

  .logs-card :deep(.el-table) {
    font-size: 12px;
  }

  .logs-card :deep(.el-table th),
  .logs-card :deep(.el-table td) {
    padding: 8px 4px;
  }

  .pagination-container {
    justify-content: center;
    padding: 12px 0;
  }

  .pagination-container :deep(.el-pagination) {
    font-size: 12px;
  }

  .pagination-container :deep(.el-pagination__sizes),
  .pagination-container :deep(.el-pagination__jump) {
    display: none;
  }
}

@media (max-width: 480px) {
  .card-header {
    font-size: 14px;
  }

  .filter-section :deep(.el-date-editor),
  .filter-section :deep(.el-select) {
    width: 100%;
  }

  .logs-card :deep(.el-table) {
    font-size: 11px;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 0 auto;
  }

  :deep(.el-dialog__header) {
    padding: 16px;
  }

  :deep(.el-dialog__body) {
    padding: 16px;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 16px;
  }
}
</style>