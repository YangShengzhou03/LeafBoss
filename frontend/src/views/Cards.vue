<template>
  <div class="cards-container">
    <!-- 搜索和筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-content">
        <div class="filter-group">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索卡密ID"
            clearable
            size="large"
            class="search-input"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select v-model="filterSpec" placeholder="规格类型" clearable size="large">
            <el-option label="月卡" value="月卡" />
            <el-option label="季卡" value="季卡" />
            <el-option label="年卡" value="年卡" />
          </el-select>
          
          <el-select v-model="filterStatus" placeholder="状态" clearable size="large">
            <el-option label="未使用" value="unused" />
            <el-option label="已使用" value="used" />
            <el-option label="已过期" value="expired" />
          </el-select>
        </div>
        
        <div class="filter-stats">
          <span class="stats-text">共 {{ filteredCards.length }} 条记录</span>
        </div>
      </div>
    </el-card>

    <!-- 卡密表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-wrapper">
        <el-table
          :data="paginatedCards"
          v-loading="loading"
          stripe
          style="width: 100%"
          class="data-table"
          :header-cell-style="{ background: '#f8f9fa', color: '#606266', fontWeight: '600' }"
        >
          <el-table-column prop="id" label="卡密ID" min-width="220" />
          <el-table-column prop="specType" label="规格类型" width="100" align="center" />
          <el-table-column prop="responseNumber" label="响应次数" width="100" align="center" />
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusType(row.status)"
                size="small"
                effect="light"
                class="status-tag"
              >
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="categoryName" label="分类" width="120" />
          <el-table-column prop="goodsName" label="商品" width="120" />
          <el-table-column prop="specName" label="规格" width="100" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" link @click="viewCard(row)">
                  <el-icon><View /></el-icon>
                  查看
                </el-button>
                <el-button type="danger" size="small" link @click="deleteCard(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredCards.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="custom-pagination"
          />
        </div>
      </div>
    </el-card>

    <!-- 添加卡密弹窗 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加卡密"
      width="520px"
      :before-close="handleClose"
      class="add-dialog"
    >
      <el-form
        ref="cardFormRef"
        :model="newCard"
        :rules="rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="规格类型" prop="specType">
          <el-select v-model="newCard.specType" placeholder="请选择规格类型" size="large" style="width: 100%">
            <el-option label="月卡" value="月卡" />
            <el-option label="季卡" value="季卡" />
            <el-option label="年卡" value="年卡" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量" prop="quantity">
          <el-input-number
            v-model="newCard.quantity"
            :min="1"
            :max="1000"
            controls-position="right"
            size="large"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddDialog = false" size="large">取消</el-button>
          <el-button type="primary" @click="handleAddCards" :loading="loading" size="large">
            生成卡密
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, View, Delete } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const showAddDialog = ref(false)
const searchKeyword = ref('')
const filterSpec = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 表单引用
const cardFormRef = ref()

// 模拟数据
const cards = ref([
  {
    id: 'CM202401010001',
    specType: '月卡',
    responseNumber: 100,
    status: 'unused',
    categoryName: 'AI助手',
    goodsName: '智能对话',
    specName: '基础版'
  },
  {
    id: 'CM202401010002',
    specType: '季卡',
    responseNumber: 300,
    status: 'used',
    categoryName: 'AI助手',
    goodsName: '智能对话',
    specName: '专业版'
  },
  {
    id: 'CM202401010003',
    specType: '年卡',
    responseNumber: 1200,
    status: 'expired',
    categoryName: 'AI助手',
    goodsName: '智能对话',
    specName: '企业版'
  }
])

const newCard = reactive({
  specType: '',
  quantity: 1
})

// 表单验证规则
const rules = {
  specType: [
    { required: true, message: '请选择规格类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入生成数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 1000, message: '数量范围1-1000', trigger: 'blur' }
  ]
}

// 计算属性
const filteredCards = computed(() => {
  return cards.value.filter(card => {
    const matchesSearch = searchKeyword.value === '' || 
      card.id.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesSpec = filterSpec.value === '' || card.specType === filterSpec.value
    const matchesStatus = filterStatus.value === '' || card.status === filterStatus.value
    
    return matchesSearch && matchesSpec && matchesStatus
  })
})

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCards.value.slice(start, end)
})

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const getStatusType = (status) => {
  const statusMap = {
    'unused': 'success',
    'used': 'info',
    'expired': 'warning'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'unused': '未使用',
    'used': '已使用',
    'expired': '已过期'
  }
  return statusMap[status] || '未知'
}

const viewCard = (card) => {
  ElMessage.info(`查看卡密详情: ${card.id}`)
  // 这里可以打开详情弹窗
}

const deleteCard = async (card) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除卡密 "${card.id}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    const index = cards.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      cards.value.splice(index, 1)
      ElMessage.success('卡密删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const handleClose = (done) => {
  if (cardFormRef.value) {
    cardFormRef.value.resetFields()
  }
  done()
}

const handleAddCards = async () => {
  if (!cardFormRef.value) return
  
  try {
    await cardFormRef.value.validate()
    
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newCards = []
    for (let i = 0; i < newCard.quantity; i++) {
      const timestamp = new Date().getTime()
      const newId = `CM${timestamp}${String(i).padStart(4, '0')}`
      
      newCards.push({
        id: newId,
        specType: newCard.specType,
        responseNumber: newCard.specType === '月卡' ? 100 : 
                       newCard.specType === '季卡' ? 300 : 1200,
        status: 'unused',
        categoryName: 'AI助手',
        goodsName: '智能对话',
        specName: newCard.specType === '月卡' ? '基础版' : 
                 newCard.specType === '季卡' ? '专业版' : '企业版'
      })
    }
    
    cards.value.unshift(...newCards)
    
    ElMessage.success(`成功生成 ${newCard.quantity} 张卡密`)
    showAddDialog.value = false
    cardFormRef.value.resetFields()
  } catch (error) {
    if (error && error.errors) {
      ElMessage.error('请完善表单信息')
    } else {
      ElMessage.error('生成卡密失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

// 监听筛选条件变化
watch([filterSpec, filterStatus], () => {
  currentPage.value = 1
})

onMounted(() => {
  // 初始化数据加载
  console.log('卡密管理页面初始化完成')
})
</script>

<style scoped>
.cards-container {
  padding: var(--page-padding);
  background: var(--bg-color);
  min-height: calc(100vh - 64px);
}

/* 页面标题区域 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--section-margin);
  background: var(--bg-white);
  padding: var(--card-padding);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.2;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.add-button {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md) var(--spacing-xl);
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 筛选卡片区域 */
.filter-card {
  margin-bottom: var(--section-margin);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-light);
}

.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.filter-group {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  flex: 1;
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input__inner) {
  border-radius: var(--border-radius-md);
}

.filter-stats {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

/* 表格卡片区域 */
.table-card {
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-light);
  overflow: hidden;
}

.table-wrapper {
  padding: 0;
}

.data-table {
  border: none;
}

.data-table :deep(.el-table__header) {
  background: var(--bg-gray);
}

.data-table :deep(.el-table__row) {
  transition: background-color 0.2s ease;
}

.data-table :deep(.el-table__row:hover) {
  background-color: var(--bg-hover);
}

.status-tag {
  font-weight: 500;
  border-radius: var(--border-radius-md);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

.action-buttons .el-button {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 500;
}

/* 分页区域 */
.pagination-wrapper {
  padding: var(--spacing-xl) var(--spacing-xl);
  background: var(--bg-gray);
  border-top: 1px solid var(--border-light);
}

.custom-pagination {
  justify-content: flex-end;
}

.custom-pagination :deep(.el-pagination__total) {
  color: var(--text-secondary);
  font-weight: 500;
}

/* 添加卡密弹窗 */
.add-dialog :deep(.el-dialog) {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.add-dialog :deep(.el-dialog__header) {
  padding: var(--spacing-xl) var(--spacing-xl) 0;
  margin: 0;
}

.add-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.add-dialog :deep(.el-dialog__body) {
  padding: var(--spacing-xl);
}

.add-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--text-primary);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl);
  border-top: 1px solid var(--border-light);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .cards-container {
    padding: var(--spacing-xl);
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
  
  .search-input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .cards-container {
    padding: var(--spacing-lg);
  }
  
  .page-header {
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
  }
  
  .filter-content {
    flex-direction: column;
    gap: var(--spacing-lg);
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .action-buttons {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .pagination-wrapper {
    padding: var(--spacing-lg);
  }
  
  .custom-pagination {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cards-container {
    padding: var(--spacing-md);
  }
  
  .page-header {
    padding: var(--spacing-lg);
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .add-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: var(--spacing-xl) auto;
  }
}

/* 动画效果 */
.page-header,
.filter-card,
.table-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式优化 */
.table-wrapper :deep(.el-table__body-wrapper)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-wrapper :deep(.el-table__body-wrapper)::-webkit-scrollbar-track {
  background: var(--bg-scroll-track);
  border-radius: 3px;
}

.table-wrapper :deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb {
  background: var(--bg-scroll-thumb);
  border-radius: 3px;
}

.table-wrapper :deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb:hover {
  background: var(--bg-scroll-thumb-hover);
}
</style>