<template>
  <div class="admin-cardkey-management">
    <el-card class="cardkey-card">
      <template #header>
        <div class="card-header">
          <span>卡密管理</span>
        </div>
      </template>

      <div class="search-bar">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-input v-model="searchQuery" placeholder="搜索卡密或邮箱" clearable @keyup.enter="handleSearch">
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon>
                    <Search />
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="specificationFilter" placeholder="商品规格" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option v-for="spec in specifications" :key="spec.id" :label="spec.name" :value="spec.id" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="statusFilter" placeholder="卡密状态" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="未使用" value="未使用" />
              <el-option label="已使用" value="已使用" />
              <el-option label="已禁用" value="已禁用" />
            </el-select>
          </el-col>
          <el-col :span="12" class="button-group">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
            <div style="flex: 1;"></div>
            <el-button type="success" @click="handleExport">导出卡密</el-button>
            <el-button type="danger" @click="handleClearUsed">清空已使用</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="pagedCardKeys" style="width: 100%" v-loading="loading" :scroll="{ x: 1200 }">
          <template #empty>
            <div style="padding: 40px 0;">
              <el-empty description="暂无卡密数据" />
            </div>
          </template>
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="cardKey" label="卡密代码" min-width="200" align="left" :show-overflow-tooltip="true">
            <template #default="scope">
              <span class="cardkey-code" @click="copyCardKey(scope.row.cardKey)" style="cursor: pointer;">{{
                scope.row.cardKey }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productSpec" label="商品规格" min-width="160" align="left" :show-overflow-tooltip="true">
            <template #default="scope">
              <span class="product-spec">{{ scope.row.productSpec || '未设置' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="activateTime" label="使用时间" width="180" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
              <span class="time-text">{{ scope.row.activateTime || '未使用' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
              <span class="time-text">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" :type="scope.row.status === '已禁用' ? 'primary' : 'warning'"
                @click="handleToggleCardKey(scope.row)">
                {{ scope.row.status === '已禁用' ? '启用' : '禁用' }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDeleteCardKey(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '@/services/api.js'

const loading = ref(false)
const cardKeys = ref([])
const specifications = ref([])
const searchQuery = ref('')
const specificationFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const pagedCardKeys = computed(() => {
  return cardKeys.value
})

const getStatusTagType = (status) => {
  const typeMap = {
    '未使用': 'success',
    '已使用': 'info',
    '已禁用': 'danger'
  }
  return typeMap[status] || 'info'
}

const loadCardKeys = async () => {
  loading.value = true
  try {
    const response = await api.admin.getCardKeyListWithDetails({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchQuery.value,
      specificationId: specificationFilter.value,
      status: statusFilter.value
    })

    if (response && response.data) {
      const cardKeyList = response.data.records || response.data.content || response.data || []

      const newCardKeys = cardKeyList.map(cardKey => ({
        id: cardKey.id,
        cardKey: cardKey.cardKey,
        status: cardKey.status,
        productSpec: cardKey.productName && cardKey.specificationName
          ? `${cardKey.productName} - ${cardKey.specificationName}`
          : '未设置',
        userEmail: cardKey.userEmail || '',
        userId: cardKey.userId || '',
        activateTime: cardKey.activateTime ? formatDateTime(cardKey.activateTime) : '',
        createTime: cardKey.createdAt ? formatDateTime(cardKey.createdAt) : '',
        updatedAt: cardKey.updatedAt ? formatDateTime(cardKey.updatedAt) : ''
      }))

      cardKeys.value = newCardKeys
      total.value = response.data.total || response.data.totalElements || cardKeyList.length
    } else {
      cardKeys.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('加载卡密数据失败，请检查网络连接')
    cardKeys.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadCardKeys()
}

const resetFilter = () => {
  searchQuery.value = ''
  specificationFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  loadCardKeys()
}

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return dateTimeStr
  }
}

const copyCardKey = async (cardKey) => {
  try {
    await navigator.clipboard.writeText(cardKey)
    ElMessage.success('卡密已复制到剪贴板')
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = cardKey
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('卡密已复制到剪贴板')
  }
}

const handleExport = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要导出卡密吗？${specificationFilter.value ? '将导出当前筛选规格的所有卡密。' : '将导出所有卡密。'}`,
      '确认导出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    const loadingMessage = ElMessage({
      message: '正在获取卡密数据...',
      type: 'info',
      duration: 0
    })

    try {
      const response = await api.admin.getCardKeyListWithDetails({
        page: 1,
        size: 10000,
        keyword: searchQuery.value,
        specificationId: specificationFilter.value,
        status: statusFilter.value
      })

      if (response && response.data) {
        const cardKeyList = response.data.records || response.data.content || response.data || []

        if (cardKeyList.length === 0) {
          loadingMessage.close()
          ElMessage.warning('没有找到可导出的卡密数据')
          return
        }

        const cardKeyContent = cardKeyList.map(cardKey => cardKey.cardKey).join('\n')

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        const specName = specifications.value.find(spec => spec.id === specificationFilter.value)?.name || '全部'
        const fileName = `卡密导出_${specName}_${timestamp}.txt`

        const blob = new Blob([cardKeyContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        loadingMessage.close()
        ElMessage.success(`成功导出 ${cardKeyList.length} 个卡密`)
      } else {
        loadingMessage.close()
        ElMessage.error('获取卡密数据失败')
      }
    } catch (error) {
      loadingMessage.close()
      ElMessage.error('导出卡密失败，请检查网络连接')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('导出卡密失败，请检查网络连接')
    }
  }
}

const handleClearUsed = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有已使用的卡密吗？此操作不可恢复！',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const response = await api.admin.batchDeleteUsedCardKeys()

    if (response && response.code === 200) {
      ElMessage.success('已使用卡密清空成功')
      loadCardKeys()
    } else {
      ElMessage.error('清空已使用卡密失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空已使用卡密失败，请检查网络连接')
    }
  }
}

const handleToggleCardKey = async (row) => {
  const isDisabling = row.status !== '已禁用'
  const actionText = isDisabling ? '禁用' : '启用'

  try {
    await ElMessageBox.confirm(
      `确定要${actionText}卡密"${row.cardKey}"吗？`,
      `确认${actionText}`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    let response
    if (isDisabling) {
      response = await api.admin.disableCardKey(row.cardKey)
    } else {
      response = await api.admin.toggleCardKeyStatus(row.cardKey, '未使用')
    }

    if (response && response.code === 200) {
      ElMessage.success(`${actionText}成功`)
      loadCardKeys()
    } else {
      ElMessage.error(`${actionText}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionText}卡密失败，请检查网络连接`)
    }
  }
}

const handleDeleteCardKey = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除卡密"${row.cardKey}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await api.admin.deleteCardKey(row.cardKey)

    if (response && response.code === 200) {
      ElMessage.success('删除成功')
      loadCardKeys()
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除卡密失败，请检查网络连接')
    }
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadCardKeys()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadCardKeys()
}

const loadSpecifications = async () => {
  try {
    const response = await api.admin.getSpecificationDTOs()
    if (response && response.data) {
      specifications.value = response.data.map(spec => ({
        id: spec.id,
        name: spec.productName ? `${spec.productName} - ${spec.name}` : spec.name
      }))
    }
  } catch (error) {
    // eslint-disable-next-line no-empty
  }
}

onMounted(() => {
  loadCardKeys()
  loadSpecifications()
})
</script>

<style scoped>
.admin-cardkey-management {
  padding: 16px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 32px);
}

.cardkey-card {
  margin-bottom: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.cardkey-card :deep(.el-card__body) {
  padding: 20px;
}

.cardkey-card :deep(.el-card__header) {
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

.search-bar {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e6e8eb;
}

.search-bar :deep(.el-col) {
  display: flex;
  align-items: center;
}

.search-bar :deep(.el-input) {
  flex: 1;
}

.search-bar :deep(.button-group) {
  justify-content: flex-end;
  gap: 12px;
}

.table-container {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e6e8eb;
}

.table-container :deep(.el-table) {
  border-radius: 6px;
}

.table-container :deep(.el-table__header-wrapper) {
  background-color: #f5f7fa;
}

.table-container :deep(.el-table th) {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  padding: 12px 0;
}

.table-container :deep(.el-table td) {
  padding: 12px 0;
}

.table-container :deep(.el-table .cell) {
  padding: 0 12px;
  word-break: break-word;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 16px 0 0;
  border-top: 1px solid #e6e8eb;
}

.cardkey-code {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  color: #409EFF;
  letter-spacing: 1px;
  font-size: 13px;
}

.product-spec {
  font-size: 13px;
  color: #606266;
}

.time-text {
  font-size: 13px;
  color: #909399;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.action-btn {
  min-width: 60px;
}

/* 表格样式优化 */
.cardkey-card :deep(.el-table__header) {
  background-color: #f5f7fa;
}

.cardkey-card :deep(.el-table th) {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.cardkey-card :deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

/* 按钮样式优化 - 移除可能影响原生悬浮效果的样式 */
.cardkey-card :deep(.el-button) {
  border-radius: 4px;
}

.cardkey-card :deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

.cardkey-card :deep(.el-button--danger) {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

@media (max-width: 768px) {
  .admin-cardkey-management {
    padding: 10px;
  }

  .cardkey-card :deep(.el-card__body) {
    padding: 16px;
  }

  .search-bar {
    padding: 16px;
    margin-bottom: 16px;
  }

  .search-bar :deep(.el-col) {
    margin-bottom: 12px;
  }

  .search-bar :deep(.el-col:last-child) {
    margin-bottom: 0;
  }

  .search-bar :deep(.button-group) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .search-bar :deep(.button-group .el-button) {
    width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .table-container :deep(.el-table) {
    font-size: 12px;
  }

  .table-container :deep(.el-table th),
  .table-container :deep(.el-table td) {
    padding: 8px 4px;
  }

  .table-container :deep(.el-button) {
    padding: 4px 8px;
    font-size: 12px;
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

  .cardkey-code,
  .product-spec,
  .time-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .card-header {
    font-size: 14px;
  }

  .search-bar :deep(.el-input__inner),
  .search-bar :deep(.el-select) {
    font-size: 14px;
  }

  .table-container :deep(.el-table) {
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

  :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
</style>
