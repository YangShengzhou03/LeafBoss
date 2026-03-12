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
          <el-col :xs="24" :sm="10" :md="6" class="mb-10">
            <el-date-picker v-model="filter.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 100%" />
          </el-col>
          <el-col :xs="24" :sm="6" :md="4" class="mb-10">
            <el-select v-model="filter.operationType" placeholder="操作类型" clearable style="width: 100%">
              <el-option label="登录" value="LOGIN" />
              <el-option label="卡密操作" value="CARD_KEY" />
              <el-option label="产品操作" value="PRODUCT" />
              <el-option label="规格操作" value="SPECIFICATION" />
              <el-option label="用户操作" value="USER" />
              <el-option label="系统操作" value="SYSTEM" />
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="8" :md="14" class="button-group">
            <el-button type="primary" @click="handleFilter">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
            <div class="flex-grow" v-if="!isMobile"></div>
            <el-button type="danger" @click="clearLogs" :loading="clearing">
              <el-icon>
                <Delete />
              </el-icon>
              清空日志
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table v-loading="loading" :data="logs" style="width: 100%" @row-click="viewLogDetail">
          <el-table-column prop="operationType" label="操作类型" width="150" align="center">
            <template #default="{ row }">
              <el-tag :type="getLevelType(row.operationType)" size="small">
                {{ getOperationTypeName(row.operationType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="操作内容" min-width="200" show-overflow-tooltip />
          <el-table-column prop="ipAddress" label="IP地址" width="140" align="center" />
          <el-table-column prop="createdAt" label="操作时间" width="180" align="center" />

          <template #empty>
            <div class="empty-container" style="padding: 40px 0;">
              <el-empty description="暂无日志数据" :image-size="120" />
            </div>
          </template>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="totalLogs" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <el-dialog v-model="showLogDetail" title="日志详情" :width="isMobile ? '90%' : '500px'">
      <div v-if="selectedLog">
        <el-descriptions :column="isMobile ? 1 : 2" border>
          <el-descriptions-item label="日志ID">{{ selectedLog.id }}</el-descriptions-item>
          <el-descriptions-item label="操作">
            <el-tag :type="getLevelType(selectedLog.operationType)">
              {{ getOperationTypeName(selectedLog.operationType) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ selectedLog.ipAddress }}</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ selectedLog.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="操作内容" :span="isMobile ? 1 : 2">{{ selectedLog.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import api from '../../services/api'

const loading = ref(false)
const clearing = ref(false)
const isMobile = ref(false)

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
  loadLogs()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

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
  padding: 0;
}

.filter-section {
  margin-bottom: 16px;
  padding: 20px;
}

.filter-section :deep(.button-group) {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.mb-10 {
  margin-bottom: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.flex-grow {
  flex-grow: 1;
}

.id-display {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding: 16px;
}
</style>