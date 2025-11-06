<template>
  <div class="admin-cardkey-management">
    <el-card class="cardkey-card">
      <template #header>
        <div class="card-header">
          <span>卡密管理</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-input v-model="searchQuery" placeholder="搜索卡密或邮箱" clearable @keyup.enter="handleSearch">
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="statusFilter" placeholder="卡密状态" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="未使用" value="未使用" />
              <el-option label="已使用" value="已使用" />
              <el-option label="已禁用" value="已禁用" />
            </el-select>
          </el-col>
          <el-col :span="14" class="button-group">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
            <div style="flex: 1;"></div>
            <el-button type="danger" @click="handleClearUsed">清空已使用</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 卡密列表 -->
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
              <span class="cardkey-code" @click="copyCardKey(scope.row.cardKey)" style="cursor: pointer;">{{ scope.row.cardKey }}</span>
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
              <el-button 
                size="small" 
                :type="scope.row.status === '已禁用' ? 'primary' : 'warning'"
                @click="handleToggleCardKey(scope.row)"
              >
                {{ scope.row.status === '已禁用' ? '启用' : '禁用' }}
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDeleteCardKey(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '../../services/api'

// 加载状态
const loading = ref(false)

// 卡密列表数据
const cardKeys = ref([])

// 搜索条件
const searchQuery = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)



// 计算属性：筛选后的卡密列表
const filteredCardKeys = computed(() => {
  let filtered = [...cardKeys.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(cardKey => 
      cardKey.cardKey.toLowerCase().includes(query) ||
      (cardKey.userEmail && cardKey.userEmail.toLowerCase().includes(query))
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(cardKey => cardKey.status === statusFilter.value)
  }
  
  return filtered
})

// 计算属性：分页后的卡密列表
const pagedCardKeys = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredCardKeys.value.slice(startIndex, endIndex)
})

// 状态标签类型映射
const getStatusTagType = (status) => {
  const typeMap = {
    '未使用': 'success',
    '已使用': 'info',
    '已禁用': 'danger'
  }
  return typeMap[status] || 'info'
}

// 加载卡密数据
const loadCardKeys = async () => {
  loading.value = true
  try {
    // 使用新的API接口获取包含商品和规格名称的卡密列表
    const response = await api.admin.getCardKeyListWithDetails()
    
    if (response && response.data) {
      // 将返回的数据转换为前端需要的格式
      const newCardKeys = response.data.map(cardKey => ({
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
      
      // 更新总数
      total.value = filteredCardKeys.value.length
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

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  // 直接更新总数，避免重复计算
  total.value = filteredCardKeys.value.length
}

// 重置筛选
const resetFilter = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  total.value = cardKeys.value.length
}

// 格式化日期时间
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

// 复制卡密
const copyCardKey = async (cardKey) => {
  try {
    await navigator.clipboard.writeText(cardKey)
    ElMessage.success('卡密已复制到剪贴板')
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = cardKey
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('卡密已复制到剪贴板')
  }
}

// 清空已使用卡密
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
    
    // 清空已使用卡密功能暂未实现
    ElMessage.warning('清空已使用卡密功能正在开发中，敬请期待')
    // 这里可以添加批量删除已使用卡密的逻辑
    // 例如：遍历已使用卡密列表，逐个调用删除API
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空已使用卡密失败，请检查网络连接')
    }
  }
}



// 切换卡密状态（禁用/启用）
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
    
    // 调用真实API切换卡密状态
    let response
    if (isDisabling) {
      // 禁用卡密 - 传递卡密字符串
      response = await api.admin.disableCardKey(row.cardKey)
    } else {
      // 启用卡密（设置为未使用状态）
      response = await api.admin.toggleCardKeyStatus(row.cardKey, '未使用')
    }
    
    // 修复响应格式检查：后端返回的是Result对象，包含code、message、data字段
    if (response && response.code === 200) {
      ElMessage.success(`${actionText}成功`)
      loadCardKeys() // 重新加载数据
    } else {
      ElMessage.error(`${actionText}失败`)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionText}卡密失败，请检查网络连接`)
    }
  }
}

// 删除卡密
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
    
    // 调用真实API删除卡密
    const response = await api.admin.deleteCardKey(row.cardKey)
    
    // 修复响应格式检查：后端返回的是Result对象，包含code、message、data字段
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

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadCardKeys()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadCardKeys()
}

onMounted(() => {
  loadCardKeys()
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

/* 按钮样式优化 */
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
  
  .search-bar :deep(.button-group) {
    flex-direction: column;
    gap: 8px;
  }
  
  .table-container :deep(.el-table) {
    font-size: 12px;
  }
  
  .table-container :deep(.el-table th),
  .table-container :deep(.el-table td) {
    padding: 8px 0;
  }
  
  .cardkey-code,
  .product-spec,
  .time-text {
    font-size: 11px;
  }
}
</style>