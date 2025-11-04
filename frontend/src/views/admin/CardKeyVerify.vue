<template>
  <div class="admin-product-management">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <span>卡密验证</span>
        </div>
      </template>

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
const products = ref([])

// 搜索条件
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 计算属性：筛选后的卡密列表
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query)
    )
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }
  
  return filtered
})

// 分类标签类型映射
const getCategoryTagType = (category) => {
  const typeMap = {
    virtual: 'primary',
    physical: 'success',
    service: 'warning'
  }
  return typeMap[category] || 'info'
}

// 分类文本映射
const getCategoryText = (category) => {
  const textMap = {
    virtual: '虚拟卡密',
    physical: '实体卡密',
    service: '服务类'
  }
  return textMap[category] || '未知'
}

// 加载卡密数据
const loadProducts = async () => {
  loading.value = true
  try {
    // 模拟数据 - 实际项目中应该调用API
    products.value = [
      {
        id: 1,
        name: 'VIP会员月卡',
        category: 'virtual',
        price: 29.99,
        stock: 1000,
        status: 'active',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        name: '实体礼品卡',
        category: 'physical',
        price: 199.99,
        stock: 50,
        status: 'active',
        createTime: '2024-01-02 14:30:00'
      },
      {
        id: 3,
        name: '在线课程服务',
        category: 'service',
        price: 399.99,
        stock: 200,
        status: 'inactive',
        createTime: '2024-01-03 09:15:00'
      }
    ]
    total.value = products.value.length
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

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
  handleSearch()
}

// 新增卡密功能已移除，因为模板中没有使用

// 编辑卡密
const handleEditProduct = (row) => {
  ElMessage.info(`编辑卡密: ${row.name}`)
}

// 删除卡密
const handleDeleteProduct = (row) => {
  ElMessageBox.confirm(
    `确定要删除卡密"${row.name}"吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadProducts()
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
  loadProducts()
})
</script>

<style scoped>
.admin-product-management {
  padding: 0;
  background-color: #f0f2f5;
}

.product-card {
  margin-bottom: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card :deep(.el-card__body) {
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
  padding: 16px;
  background-color: #fafafa;
  border-bottom: 1px solid #e6e6e6;
}

.search-bar .el-row {
  align-items: center;
}

.search-bar .el-col {
  display: flex;
  align-items: center;
}

.search-bar .el-button {
  margin-left: 8px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  min-height: 400px;
  margin: 0;
}

.pagination-container {
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: flex-end;
}

.product-name {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}

.price-text {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 600;
}

.stock-text {
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

:deep(.el-table) {
  width: 100% !important;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table .cell) {
  white-space: nowrap;
  text-align: center;
  font-size: 13px;
}

:deep(.el-table th) {
  text-align: center !important;
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #ebeef5;
  padding: 12px 8px;
}

:deep(.el-table td) {
  text-align: center !important;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table .el-table__row:hover td) {
  background-color: #f5f7fa;
}
</style>