<template>
  <div class="categories-container">
    <!-- 页面标题和操作区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">商品分类管理</h1>
        <p class="page-description">管理系统中的商品分类，支持分类的增删改查和状态管理</p>
      </div>
      <el-button type="primary" size="large" @click="showAddDialog = true" class="add-button">
        <el-icon><Plus /></el-icon>
        添加分类
      </el-button>
    </div>

    <!-- 搜索和筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-content">
        <div class="filter-group">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索分类名称或编码"
            clearable
            size="large"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select v-model="filterStatus" placeholder="状态" clearable size="large">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </div>
        
        <div class="filter-stats">
          <span class="stats-text">共 {{ filteredCategories.length }} 个分类</span>
        </div>
      </div>
    </el-card>

    <!-- 分类表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-wrapper">
        <el-table
          :data="filteredCategories"
          v-loading="loading"
          stripe
          style="width: 100%"
          class="data-table"
          :header-cell-style="{ background: '#f8f9fa', color: '#606266', fontWeight: '600' }"
        >
          <el-table-column prop="name" label="分类名称" width="160" />
          <el-table-column prop="code" label="分类编码" width="120" />
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column prop="specCount" label="规格数量" width="120" align="center">
            <template #default="{ row }">
              <el-tag type="info" effect="light" class="count-tag">
                {{ row.specCount }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <div class="status-cell">
                <el-switch
                  v-model="row.status"
                  active-value="active"
                  inactive-value="inactive"
                  @change="toggleCategoryStatus(row)"
                  class="status-switch"
                />
                <span class="status-text" :class="{ 'active': row.status === 'active', 'inactive': row.status === 'inactive' }">
                  {{ row.status === 'active' ? '启用' : '禁用' }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="primary" size="small" link @click="editCategory(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button type="danger" size="small" link @click="deleteCategory(row)">
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
            :total="filteredCategories.length"
            layout="total, sizes, prev, pager, next, jumper"
            class="custom-pagination"
          />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑分类弹窗 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="isEditing ? '编辑分类' : '添加分类'" 
      width="520px"
      class="category-dialog"
    >
      <el-form 
        :model="currentCategory" 
        label-width="100px" 
        :rules="formRules" 
        ref="categoryForm"
        label-position="left"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="currentCategory.name" placeholder="请输入分类名称" size="large" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="currentCategory.code" placeholder="请输入分类编码" size="large" />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input 
            v-model="currentCategory.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入分类描述" 
            size="large"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddDialog = false" size="large">取消</el-button>
          <el-button type="primary" @click="saveCategory" size="large">
            {{ isEditing ? '保存修改' : '添加分类' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const showAddDialog = ref(false)
const isEditing = ref(false)

// 表单引用
const categoryForm = ref(null)

const currentCategory = ref({
  id: '',
  name: '',
  code: '',
  description: '',
  status: 'active'
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '分类名称长度在2-20个字符之间', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[A-Z0-9_]+$/, message: '分类编码只能包含大写字母、数字和下划线', trigger: 'blur' }
  ]
}

// 模拟数据
const categories = ref([
  {
    id: 1,
    name: '会员卡',
    code: 'VIP',
    description: '各类会员卡产品，包括月卡、季卡、年卡等',
    specCount: 3,
    status: 'active',
    createdAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '礼品卡',
    code: 'GIFT',
    description: '礼品卡和兑换卡，适用于节日礼品和商务赠送',
    specCount: 2,
    status: 'active',
    createdAt: '2024-01-15 09:15:00'
  },
  {
    id: 3,
    name: '测试卡',
    code: 'TEST',
    description: '测试用卡密，仅供内部测试使用',
    specCount: 1,
    status: 'inactive',
    createdAt: '2024-01-14 16:45:00'
  },
  {
    id: 4,
    name: '体验卡',
    code: 'TRIAL',
    description: '用户体验卡，提供有限次数的免费体验',
    specCount: 2,
    status: 'active',
    createdAt: '2024-01-13 14:20:00'
  }
])

// 计算属性
const filteredCategories = computed(() => {
  return categories.value.filter(category => {
    const matchesKeyword = searchKeyword.value === '' || 
      category.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      category.code.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesStatus = filterStatus.value === '' || category.status === filterStatus.value
    return matchesKeyword && matchesStatus
  })
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCategories.value.slice(start, end)
})

// 方法
const editCategory = (category) => {
  isEditing.value = true
  currentCategory.value = { ...category }
  showAddDialog.value = true
}

const deleteCategory = async (category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${category.name}" 吗？此操作将同时删除该分类下的所有规格。`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      ElMessage.success('分类删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const toggleCategoryStatus = (category) => {
  const action = category.status === 'active' ? '启用' : '禁用'
  ElMessage.success(`分类${action}成功`)
}

const resetForm = () => {
  currentCategory.value = {
    id: '',
    name: '',
    code: '',
    description: '',
    status: 'active'
  }
  isEditing.value = false
}

const saveCategory = async () => {
  if (!categoryForm.value) return
  
  try {
    await categoryForm.value.validate()
    
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEditing.value) {
      // 编辑分类
      const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
      if (index !== -1) {
        categories.value[index] = {
          ...categories.value[index],
          name: currentCategory.value.name,
          code: currentCategory.value.code,
          description: currentCategory.value.description
        }
        ElMessage.success('分类修改成功')
      }
    } else {
      // 添加分类
      const newCategory = {
        id: Date.now(),
        name: currentCategory.value.name,
        code: currentCategory.value.code,
        description: currentCategory.value.description,
        specCount: 0,
        status: 'active',
        createdAt: new Date().toLocaleString('zh-CN')
      }
      categories.value.unshift(newCategory)
      ElMessage.success('分类添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    if (error && error.errors) {
      ElMessage.error('请完善表单信息')
    } else {
      ElMessage.error('保存失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

// 监听筛选条件变化
watch([filterStatus], () => {
  currentPage.value = 1
})

// 监听搜索关键词变化
watch(searchKeyword, () => {
  currentPage.value = 1
})

onMounted(() => {
  // 初始化数据加载
  console.log('商品分类管理页面初始化完成')
})
</script>

<style scoped>
.categories-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

/* 页面标题区域 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.add-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 筛选卡片区域 */
.filter-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.filter-group {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input__inner) {
  border-radius: 8px;
}

.filter-stats {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

/* 表格卡片区域 */
.table-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-wrapper {
  padding: 0;
}

.data-table {
  border: none;
}

.data-table :deep(.el-table__header) {
  background: #f8f9fa;
}

.data-table :deep(.el-table__row) {
  transition: background-color 0.2s ease;
}

.data-table :deep(.el-table__row:hover) {
  background-color: #f8fafc;
}

.count-tag {
  font-weight: 500;
  border-radius: 6px;
  min-width: 40px;
  text-align: center;
}

.status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-switch {
  transform: scale(0.9);
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-text.active {
  color: #10b981;
  background-color: #ecfdf5;
}

.status-text.inactive {
  color: #6b7280;
  background-color: #f9fafb;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-buttons .el-button {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
}

/* 分页区域 */
.pagination-wrapper {
  padding: 20px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
}

.custom-pagination {
  justify-content: flex-end;
}

.custom-pagination :deep(.el-pagination__total) {
  color: #6b7280;
  font-weight: 500;
}

/* 分类弹窗 */
.category-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.category-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 0;
  margin: 0;
}

.category-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.category-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.category-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .categories-container {
    padding: 20px;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
  
  .search-input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .categories-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  
  .filter-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .pagination-wrapper {
    padding: 16px;
  }
  
  .custom-pagination {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .categories-container {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .category-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 20px auto;
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
  background: #f1f1f1;
  border-radius: 3px;
}

.table-wrapper :deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-wrapper :deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>