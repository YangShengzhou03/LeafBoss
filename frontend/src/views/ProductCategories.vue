<template>
  <div class="categories-container">
    <!-- 搜索和筛选 -->
    <div class="card-header">
      <span>商品分类管理</span>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加分类
      </el-button>
    </div>

    <div class="filter-container">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索分类名称"
        style="width: 200px"
        clearable
      />
      <el-select v-model="filterStatus" placeholder="状态" clearable>
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
    </div>

    <!-- 分类表格 -->
    <div class="table-container">
      <el-table :data="filteredCategories" v-loading="loading">
        <el-table-column prop="name" label="分类名称" width="150" />
        <el-table-column prop="code" label="分类编码" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="specCount" label="规格数量" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.specCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="toggleCategoryStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editCategory(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteCategory(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 添加/编辑分类弹窗 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="isEditing ? '编辑分类' : '添加分类'" 
      width="500px"
    >
      <el-form :model="currentCategory" label-width="80px" :rules="formRules" ref="categoryForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="currentCategory.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="currentCategory.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="currentCategory.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入分类描述" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)
const showAddDialog = ref(false)
const isEditing = ref(false)
const categoryForm = ref(null)

const currentCategory = ref({
  id: '',
  name: '',
  code: '',
  description: '',
  status: 'active'
})

const formRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' }
  ]
}

// 模拟数据
const categories = ref([
  {
    id: 1,
    name: '会员卡',
    code: 'VIP',
    description: '各类会员卡产品',
    specCount: 3,
    status: 'active',
    createdAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '礼品卡',
    code: 'GIFT',
    description: '礼品卡和兑换卡',
    specCount: 2,
    status: 'active',
    createdAt: '2024-01-15 09:15:00'
  },
  {
    id: 3,
    name: '测试卡',
    code: 'TEST',
    description: '测试用卡密',
    specCount: 1,
    status: 'inactive',
    createdAt: '2024-01-14 16:45:00'
  }
])

const filteredCategories = computed(() => {
  return categories.value.filter(category => {
    const matchesKeyword = !searchKeyword.value || 
      category.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      category.code.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesStatus = !filterStatus.value || category.status === filterStatus.value
    return matchesKeyword && matchesStatus
  })
})

const editCategory = (category) => {
  isEditing.value = true
  currentCategory.value = { ...category }
  showAddDialog.value = true
}

const deleteCategory = async (category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类 "${category.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

const toggleCategoryStatus = (category) => {
  const action = category.status === 'active' ? '启用' : '停用'
  ElMessage.success(`${action}成功`)
}

const saveCategory = async () => {
  if (!categoryForm.value) return
  
  try {
    await categoryForm.value.validate()
    
    if (isEditing.value) {
      ElMessage.success('分类更新成功')
    } else {
      ElMessage.success('分类添加成功')
    }
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
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

onMounted(() => {
  loading.value = true
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.categories-container {
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

.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.table-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 16px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-container > * {
    width: 100%;
  }
}
</style>