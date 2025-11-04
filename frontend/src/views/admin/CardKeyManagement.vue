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
              <el-option label="未使用" value="unused" />
              <el-option label="已使用" value="used" />
              <el-option label="已禁用" value="disabled" />
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
        <el-table :data="filteredCardKeys" style="width: 100%" v-loading="loading" :scroll="{ x: 1200 }">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="cardKey" label="卡密代码" min-width="200" align="left" :show-overflow-tooltip="true">
            <template #default="scope">
              <span class="cardkey-code" @click="copyCardKey(scope.row.cardKey)" style="cursor: pointer;">{{ scope.row.cardKey }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="scope">
              <el-tag :type="getStatusTagType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
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
                type="warning" 
                @click="handleDisableCardKey(scope.row)"
                :disabled="scope.row.status === 'used' || scope.row.status === 'disabled'"
              >
                禁用
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDeleteCardKey(scope.row)"
                :disabled="scope.row.status === 'used'"
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

// 加载状态
const loading = ref(false)

// 卡密列表数据
const cardKeys = ref([])

// 搜索条件
const searchQuery = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)



// 计算属性：筛选后的卡密列表
const filteredCardKeys = computed(() => {
  let filtered = cardKeys.value
  
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

// 状态标签类型映射
const getStatusTagType = (status) => {
  const typeMap = {
    unused: 'success',
    used: 'primary',
    disabled: 'danger'
  }
  return typeMap[status] || 'info'
}

// 状态文本映射
const getStatusText = (status) => {
  const textMap = {
    unused: '未使用',
    used: '已使用',
    disabled: '已禁用'
  }
  return textMap[status] || '未知'
}



// 加载卡密数据
const loadCardKeys = async () => {
  loading.value = true
  try {
    // 模拟数据 - 实际项目中应该调用API
    cardKeys.value = [
      {
        id: 1,
        cardKey: 'LEAF-2024-001-ABCD-EFGH',
        type: 'month',
        duration: 30,
        status: 'unused',
        userId: null,
        userEmail: null,
        activateTime: null,
        expireTime: null,
        createTime: '2024-01-01 10:00:00',
        productSpec: '月卡-基础版'
      },
      {
        id: 2,
        cardKey: 'LEAF-2024-002-IJKL-MNOP',
        type: 'quarter',
        duration: 90,
        status: 'used',
        userId: 1001,
        userEmail: 'user1@example.com',
        activateTime: '2024-01-15 14:30:00',
        expireTime: '2024-04-15 14:30:00',
        createTime: '2024-01-02 09:15:00',
        productSpec: '季卡-高级版'
      },
      {
        id: 3,
        cardKey: 'LEAF-2024-003-QRST-UVWX',
        type: 'year',
        duration: 365,
        status: 'disabled',
        userId: 1002,
        userEmail: 'user2@example.com',
        activateTime: '2023-12-01 08:00:00',
        expireTime: '2024-12-01 08:00:00',
        createTime: '2023-11-28 16:45:00',
        productSpec: '年卡-旗舰版'
      },
      {
        id: 4,
        cardKey: 'LEAF-2024-004-YZAB-CDEF',
        type: 'permanent',
        duration: null,
        status: 'disabled',
        userId: null,
        userEmail: null,
        activateTime: null,
        expireTime: null,
        createTime: '2024-01-03 11:20:00',
        productSpec: '永久卡-至尊版'
      }
    ]
    total.value = cardKeys.value.length
  } catch (error) {
    ElMessage.error('加载卡密数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  // 实际项目中应该重新调用API
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

// 重置筛选
const resetFilter = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  handleSearch()
}

// 清空已使用卡密
const handleClearUsed = () => {
  ElMessageBox.confirm(
    '确定要清空所有已使用的卡密吗？此操作不可恢复！',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    // 模拟清空已使用卡密操作
    cardKeys.value = cardKeys.value.filter(cardKey => cardKey.status !== 'used')
    total.value = cardKeys.value.length
    ElMessage.success('已成功清空所有已使用的卡密')
  }).catch(() => {
    // 取消操作
  })
}



// 禁用卡密
const handleDisableCardKey = (row) => {
  ElMessageBox.confirm(
    `确定要禁用卡密"${row.cardKey}"吗？`,
    '确认禁用',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟禁用操作
    row.status = 'disabled'
    ElMessage.success('禁用成功')
  }).catch(() => {
    // 取消操作
  })
}

// 删除卡密
const handleDeleteCardKey = (row) => {
  ElMessageBox.confirm(
    `确定要删除卡密"${row.cardKey}"吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadCardKeys()
  }).catch(() => {
    // 取消操作
  })
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  // 实际项目中应该重新调用API
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  // 实际项目中应该重新调用API
}

onMounted(() => {
  loadCardKeys()
})
</script>

<style scoped>
.admin-cardkey-management {
  padding: 0;
  background-color: #f0f2f5;
}

.cardkey-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cardkey-card :deep(.el-card__body) {
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

.search-bar {
  margin-bottom: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
}

.search-bar :deep(.button-group .el-button) {
  margin-left: 8px;
}

.table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table-container :deep(.el-table) {
  border-radius: 8px;
  border: 1px solid #ebeef5;
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
  margin-top: 12px;
  padding: 16px;
  background-color: #fafafa;
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
</style>