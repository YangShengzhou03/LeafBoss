<template>
  <div class="admin-logs">
    <el-card class="logs-card">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <div class="header-actions">
            <el-button @click="exportLogs" :loading="exporting">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
            <el-button type="danger" @click="clearLogs" :loading="clearing">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-select v-model="filter.operationType" placeholder="操作类型" clearable @change="handleFilter">
              <el-option label="全部" value="" />
              <el-option label="登录" value="LOGIN" />
              <el-option label="上传文件" value="UPLOAD_FILE" />
              <el-option label="下载文件" value="DOWNLOAD_FILE" />
              <el-option label="删除文件" value="DELETE_FILE" />
              <el-option label="创建分享" value="CREATE_SHARE" />
              <el-option label="删除分享" value="DELETE_SHARE" />
              <el-option label="更新用户状态" value="UPDATE_USER_STATUS" />
              <el-option label="清空日志" value="CLEAR_LOGS" />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="filter.targetType" placeholder="目标类型" clearable @change="handleFilter">
              <el-option label="全部" value="" />
              <el-option label="用户" value="USER" />
              <el-option label="文件" value="FILE" />
              <el-option label="文件夹" value="FOLDER" />
              <el-option label="分享" value="SHARE" />
              <el-option label="系统" value="SYSTEM" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-date-picker
              v-model="filter.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleFilter"
            />
          </el-col>
          <el-col :span="6">
            <el-button @click="resetFilter">重置</el-button>
          </el-col>
        </el-row>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="stat-item">
              <span class="stat-label">上传：</span>
              <span class="stat-value primary">{{ stats.uploadCount }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <span class="stat-label">下载：</span>
              <span class="stat-value info">{{ stats.downloadCount }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <span class="stat-label">删除：</span>
              <span class="stat-value warning">{{ stats.deleteCount }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <span class="stat-label">登录：</span>
              <span class="stat-value success">{{ stats.loginCount }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-item">
              <span class="stat-label">分享：</span>
              <span class="stat-value">{{ logs.filter(log => log.operationType === 'CREATE_SHARE' || log.operationType === 'DELETE_SHARE').length }}</span>
            </div>
          </el-col>
          <el-col :span="4">
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
import Server from '@/utils/Server.js'

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
  uploadCount: 0,
  downloadCount: 0,
  deleteCount: 0,
  loginCount: 0,
  totalCount: 0
})

// 筛选条件
const filter = reactive({
  operationType: '',
  targetType: '',
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

// 获取目标类型名称
const getTargetTypeName = (targetType) => {
  switch (targetType) {
    case 'USER': return '用户'
    case 'FILE': return '文件'
    case 'FOLDER': return '文件夹'
    case 'SHARE': return '分享'
    case 'SYSTEM': return '系统'
    default: return targetType
  }
}

// 重置筛选条件
const resetFilter = () => {
  filter.operationType = ''
  filter.targetType = ''
  filter.dateRange = []
  currentPage.value = 1
  loadLogs()
}

// 更新统计数据
const updateStats = () => {
  const uploadCount = logs.value.filter(log => log.operationType === 'UPLOAD_FILE').length
  const downloadCount = logs.value.filter(log => log.operationType === 'DOWNLOAD_FILE').length
  const deleteCount = logs.value.filter(log => log.operationType === 'DELETE_FILE').length
  const loginCount = logs.value.filter(log => log.operationType === 'LOGIN').length

  stats.value = {
    uploadCount,
    downloadCount,
    deleteCount,
    loginCount,
    totalCount: logs.value.length
  }
}

// 加载日志数据
const loadLogs = async () => {
  loading.value = true
  try {
    const response = await Server.get('/admin/log', {
      params: {
        page: currentPage.value - 1,
        size: pageSize.value,
        operationType: filter.operationType,
        targetType: filter.targetType,
        startDate: filter.dateRange?.[0],
        endDate: filter.dateRange?.[1]
      }
    })

    logs.value = response.data.content || []
    totalLogs.value = response.data.totalElements || 0
    updateStats()
  } catch (error) {
    ElMessage.error('加载日志数据失败')
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
    const response = await Server.get('/admin/log/export', {
      responseType: 'blob',
      params: {
        operationType: filter.operationType,
        targetType: filter.targetType,
        startDate: filter.dateRange?.[0],
        endDate: filter.dateRange?.[1]
      }
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

    await Server.delete('/admin/log')

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
.admin-logs {
  padding: 20px;
}

.logs-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-section {
  margin-bottom: 20px;
}

.stats-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
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

.stat-value.error {
  color: #f56c6c;
}

.stat-value.warning {
  color: #e6a23c;
}

.stat-value.info {
  color: #409eff;
}

.stat-value.total {
  color: #909399;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.log-detail-content {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: monospace;
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-logs {
    padding: 10px;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 5px;
  }
}
</style>