<template>
  <div class="spec-container">
    <!-- 页面标题和操作区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">规格管理</h1>
        <p class="page-description">管理系统中的商品规格信息，包括规格代码、价格和状态等</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd" size="large">
          <el-icon><Plus /></el-icon>
          添加规格
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <template #header>
        <div class="filter-header">
          <el-icon><Search /></el-icon>
          <span>筛选条件</span>
        </div>
      </template>
      
      <div class="filter-content">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索规格名称或代码"
          style="width: 240px"
          clearable
          size="large"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable size="large">
          <el-option label="全部" value="" />
          <el-option label="启用" value="active" />
          <el-option label="停用" value="inactive" />
        </el-select>
        
        <el-button type="primary" @click="handleSearch" size="large">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        
        <el-button @click="handleReset" size="large">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </el-card>

    <!-- 规格表格区域 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="table-header">
          <div class="table-title">
            <el-icon><List /></el-icon>
            <span>规格列表</span>
          </div>
          <div class="table-stats">
            共 {{ filteredSpecs.length }} 条规格信息
          </div>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="filteredSpecs"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#f8f9fa', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column prop="name" label="规格名称" min-width="140" align="center" />
        <el-table-column prop="goodsName" label="所属商品" min-width="140" align="center" />
        <el-table-column prop="description" label="规格描述" min-width="180" show-overflow-tooltip align="center" />
        <el-table-column prop="spec_code" label="规格代码" min-width="120" align="center" />
        <el-table-column prop="price" label="价格" min-width="120" align="center">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="toggleSpecStatus(row)"
            />
            <span :class="['status-text', row.status === 'active' ? 'active' : 'inactive']">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editSpec(row)" link>
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="deleteSpec(row)" 
              link
              class="delete-btn"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页控件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredSpecs.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>

    <!-- 添加/编辑规格弹窗 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="isEditing ? '编辑规格' : '添加规格'" 
      width="600px"
      @close="resetForm"
      class="spec-dialog"
    >
      <el-form
        ref="specForm"
        :model="currentSpec"
        :rules="formRules"
        label-width="120px"
        label-position="right"
        size="large"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input 
            v-model="currentSpec.name" 
            placeholder="请输入规格名称" 
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="所属商品" prop="goodsId">
          <el-select 
            v-model="currentSpec.goodsId" 
            placeholder="请选择商品" 
            style="width: 100%"
            filterable
          >
            <el-option 
              v-for="goods in goodsList" 
              :key="goods.id" 
              :label="goods.name" 
              :value="goods.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="规格描述" prop="description">
          <el-input
            v-model="currentSpec.description"
            type="textarea"
            :rows="3"
            placeholder="请输入规格描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="规格代码" prop="spec_code">
          <el-input 
            v-model="currentSpec.spec_code" 
            placeholder="请输入规格代码" 
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="currentSpec.price"
            :min="0"
            :precision="2"
            :step="0.1"
            style="width: 100%"
            controls-position="right"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="currentSpec.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddDialog = false" size="large">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveSpec" 
            size="large"
            :loading="loading"
          >
            {{ isEditing ? '更新规格' : '添加规格' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, List, Edit, Delete } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showAddDialog = ref(false)
const isEditing = ref(false)
const specForm = ref()

// 当前编辑的规格数据
const currentSpec = reactive({
  id: '',
  name: '',
  goodsId: '',
  description: '',
  spec_code: '',
  price: 0,
  status: 'active'
})


// 模拟商品数据
const goodsList = ref([
  {
    id: 1,
    name: '月卡会员',
    status: 'active'
  },
  {
    id: 2,
    name: '季卡会员',
    status: 'active'
  },
  {
    id: 3,
    name: '年卡会员',
    status: 'active'
  },
  {
    id: 4,
    name: '生日礼品卡',
    status: 'active'
  },
  {
    id: 5,
    name: '节日礼品卡',
    status: 'active'
  },
  {
    id: 6,
    name: '测试卡A',
    status: 'active'
  }
])

// 模拟规格数据
const specifications = ref([
  {
    id: 1,
    name: '月卡',
    goodsId: 1,
    goodsName: '月卡会员',
    description: '30天有效期的卡密',
    spec_code: 'SPEC001',
    price: 29.99,
    status: 'active'
  },
  {
    id: 2,
    name: '季卡',
    goodsId: 2,
    goodsName: '季卡会员',
    description: '90天有效期的卡密',
    spec_code: 'SPEC002',
    price: 79.99,
    status: 'active'
  },
  {
    id: 3,
    name: '年卡',
    goodsId: 3,
    goodsName: '年卡会员',
    description: '365天有效期的卡密',
    spec_code: 'SPEC003',
    price: 299.99,
    status: 'active'
  },
  {
    id: 4,
    name: '生日卡',
    goodsId: 4,
    goodsName: '生日礼品卡',
    description: '生日专属礼品卡',
    spec_code: 'SPEC004',
    price: 99.99,
    status: 'active'
  },
  {
    id: 5,
    name: '节日卡',
    goodsId: 5,
    goodsName: '节日礼品卡',
    description: '节日专属礼品卡',
    spec_code: 'SPEC005',
    price: 149.99,
    status: 'active'
  }
])

const editSpec = (spec) => {
  isEditing.value = true
  currentSpec.value = { ...spec }
  showAddDialog.value = true
}

const deleteSpec = async (spec) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规格 "${spec.name}" 吗？`,
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

const toggleSpecStatus = (spec) => {
  const action = spec.status === 'active' ? '启用' : '停用'
  ElMessage.success(`${action}成功`)
}

const saveSpec = async () => {
  if (!specForm.value) return
  
  try {
    await specForm.value.validate()
    
    // 检查规格名称是否重复（同一商品下）
    const existingNameSpec = specifications.value.find(
      spec => spec.name === currentSpec.value.name && 
               spec.goodsId === currentSpec.value.goodsId &&
               spec.id !== currentSpec.value.id
    )
    
    if (existingNameSpec) {
      ElMessage.error(`商品下已存在同名规格，请使用其他名称`)
      return
    }
    
    // 检查规格代码是否重复
    const existingSpec = specifications.value.find(
      spec => spec.spec_code === currentSpec.value.spec_code && 
               spec.id !== currentSpec.value.id
    )
    
    if (existingSpec) {
      ElMessage.error(`规格代码 "${currentSpec.value.spec_code}" 已存在，请使用其他代码`)
      return
    }
    
    // 验证规格代码的合理性
    if (!currentSpec.value.spec_code || currentSpec.value.spec_code.trim() === '') {
      ElMessage.error('规格代码不能为空')
      return
    }
    
    // 查找商品名称
    const goods = goodsList.value.find(g => g.id === currentSpec.value.goodsId)
    
    if (!goods) {
      ElMessage.error('商品信息不存在')
      return
    }
    
    if (isEditing.value) {
      // 更新规格
      const index = specifications.value.findIndex(spec => spec.id === currentSpec.value.id)
      if (index !== -1) {
        specifications.value[index] = {
          ...currentSpec.value,
          goodsName: goods.name
        }
      }
      ElMessage.success('规格更新成功')
    } else {
      // 添加新规格
      const newSpec = {
        ...currentSpec.value,
        id: Date.now(),
        goodsName: goods.name
      }
      specifications.value.unshift(newSpec)
      ElMessage.success('规格添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
     console.error('表单验证失败:', error)
   }
 }

// 重置表单
const resetForm = () => {
  currentSpec.value = {
    id: '',
    name: '',
    goodsId: '',
    description: '',
    spec_code: '',
    price: 0,
    status: 'active'
  }
  specForm.value?.clearValidate()
  isEditing.value = false
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
  loading.value = true
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
:root {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
}

.spec-container {
  padding: 24px;
  background: var(--bg-color);
  min-height: calc(100vh - 64px);
  animation: fadeInUp 0.6s ease-out;
}

/* 页面标题区域 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  background: var(--card-bg);
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
  color: var(--text-primary);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.header-actions .el-button {
  background: linear-gradient(135deg, var(--primary-color), #1d4ed8);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.header-actions .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 筛选卡片区域 */
.filter-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.filter-content {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-content .el-input,
.filter-content .el-select {
  flex: 0 0 auto;
}

/* 表格卡片区域 */
.table-card {
  border-radius: 12px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--card-bg);
}

.table-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.table-stats {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

.pagination-container {
  padding: 20px;
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

/* 表格样式 */
:deep(.el-table) {
  border-radius: 0;
  font-size: 14px;
}

:deep(.el-table .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table th) {
  background: #f8f9fa;
  color: var(--text-primary);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-table td) {
  border-bottom: 1px solid var(--border-color);
}

:deep(.el-table__row:hover) {
  background-color: #f8fafc;
}

/* 价格文本样式 */
.price-text {
  font-weight: 600;
  color: var(--primary-color);
}

/* 状态文本样式 */
.status-text {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-text.active {
  color: var(--success-color);
  background-color: #ecfdf5;
}

.status-text.inactive {
  color: var(--text-secondary);
  background-color: #f9fafb;
}

/* 操作按钮样式 */
:deep(.el-button--small) {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
}

.delete-btn {
  color: var(--danger-color) !important;
}

.delete-btn:hover {
  color: #dc2626 !important;
}

/* 弹窗样式 */
.spec-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.spec-dialog :deep(.el-dialog__header) {
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--card-bg);
}

.spec-dialog :deep(.el-dialog__body) {
  padding: 24px;
  background: var(--card-bg);
}

.spec-dialog :deep(.el-dialog__footer) {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--card-bg);
}

.spec-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--text-primary);
}

.spec-dialog :deep(.el-input__wrapper),
.spec-dialog :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.spec-dialog :deep(.el-input__wrapper:hover),
.spec-dialog :deep(.el-textarea__inner:hover) {
  border-color: var(--primary-color);
}

.spec-dialog :deep(.el-input__wrapper.is-focus),
.spec-dialog :deep(.el-textarea__inner.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 动画效果 */
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

/* 滚动条样式 */
:deep(.el-table__body-wrapper)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-content {
    gap: 12px;
  }
  
  .filter-content .el-input {
    width: 200px !important;
  }
}

@media (max-width: 768px) {
  .spec-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  
  .filter-content {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .filter-content .el-input,
  .filter-content .el-select {
    width: 100% !important;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .pagination-container {
    justify-content: center;
  }
  
  .spec-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 20px auto;
  }
}

@media (max-width: 480px) {
  .spec-container {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .table-header {
    padding: 12px 16px;
  }
  
  .pagination-container {
    padding: 16px;
  }
}
</style>