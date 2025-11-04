<template>
  <div class="product-goods-container">
    <!-- 搜索筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-content">
        <div class="filter-group">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品名称"
            clearable
            class="search-input"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="filterStatus"
            placeholder="选择状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
          
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>
        
        <div class="filter-stats">
          共 {{ totalCount }} 个商品
        </div>
      </div>
    </el-card>

    <!-- 商品表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-wrapper">
        <el-table
          :data="paginatedGoods"
          v-loading="loading"
          class="data-table"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="name" label="商品名称" min-width="200" />
          <el-table-column prop="description" label="商品描述" min-width="250" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <div class="status-cell">
                <el-switch
                  v-model="row.status"
                  :active-value="'active'"
                  :inactive-value="'inactive'"
                  class="status-switch"
                  @change="handleStatusChange(row)"
                />
                <span :class="['status-text', row.status === 'active' ? 'active' : 'inactive']">
                  {{ row.status === 'active' ? '启用' : '禁用' }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="specCount" label="规格数量" width="100" align="center">
            <template #default="{ row }">
              <el-tag class="count-tag" :type="row.specCount > 0 ? 'primary' : 'info'">
                {{ row.specCount }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="260" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleEdit(row)"
                  :icon="Edit"
                >
                  编辑
                </el-button>
                <el-button
                  type="success"
                  size="small"
                  @click="handleViewSpecs(row)"
                  :icon="List"
                >
                  规格
                </el-button>
                <el-popconfirm
                  title="确定删除这个商品吗？删除商品将同时删除其所有规格"
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  @confirm="handleDelete(row)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      size="small"
                      :icon="Delete"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页控件 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          class="custom-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑商品弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      class="category-dialog"
      :before-close="handleClose"
    >
      <el-form
        ref="goodsFormRef"
        :model="goodsForm"
        :rules="goodsRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="goodsForm.name"
            placeholder="请输入商品名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="goodsForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="goodsForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Plus,
  Edit,
  Delete,
  List
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const goodsFormRef = ref()

// 商品表单数据
const goodsForm = reactive({
  id: '',
  name: '',
  description: '',
  status: 'active'
})

// 表单验证规则
const goodsRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '商品名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '商品描述不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 移除了商品分类数据

// 模拟数据 - 商品列表
const goodsList = ref([
  {
    id: 1,
    name: '王者荣耀点券',
    description: '王者荣耀游戏内点券充值',
    status: 'active',
    specCount: 3
  },
  {
    id: 2,
    name: 'Photoshop激活码',
    description: 'Adobe Photoshop正版软件激活码',
    status: 'active',
    specCount: 2
  },
  {
    id: 3,
    name: '视频会员月卡',
    description: '各大视频平台会员月卡服务',
    status: 'inactive',
    specCount: 0
  }
])

// 计算属性 - 筛选后的商品列表
const filteredGoods = computed(() => {
  let filtered = [...goodsList.value]
  
  // 按关键词搜索
  if (searchKeyword.value) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 按状态筛选
  if (filterStatus.value) {
    filtered = filtered.filter(item => item.status === filterStatus.value)
  }
  
  return filtered
})

// 计算属性 - 分页后的商品列表
const paginatedGoods = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGoods.value.slice(start, end)
})

// 计算属性 - 总记录数
const totalCount = computed(() => filteredGoods.value.length)

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

const handleAdd = () => {
  dialogTitle.value = '新增商品'
  dialogVisible.value = true
  resetForm()
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑商品'
  dialogVisible.value = true
  Object.assign(goodsForm, row)
}

const handleViewSpecs = (row) => {
  // 跳转到规格管理页面，并筛选该商品的规格
  ElMessage.info(`查看商品"${row.name}"的规格列表`)
  // 实际项目中这里应该跳转到规格管理页面并传递商品ID
}

const handleStatusChange = (row) => {
  ElMessage.success(`商品"${row.name}"已${row.status === 'active' ? '启用' : '禁用'}`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定删除商品"${row.name}"吗？删除商品将同时删除其所有规格，此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 模拟删除操作
    const index = goodsList.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      goodsList.value.splice(index, 1)
      
      // 如果有规格，这里应该调用API删除对应规格
      if (row.specCount > 0) {
        console.log(`已删除商品"${row.name}"及其${row.specCount}个规格`)
        // 实际项目中，这里应该调用API删除商品及其规格
        // await deleteProductWithSpecs(row.id)
      }
      
      ElMessage.success('删除成功')
    }
  } catch (error) {
    ElMessage.info('取消删除')
  }
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

const handleSubmit = async () => {
  if (!goodsFormRef.value) return
  
  try {
    await goodsFormRef.value.validate()
    
    // 模拟保存操作
    if (goodsForm.id) {
      // 编辑
      const index = goodsList.value.findIndex(item => item.id === goodsForm.id)
      if (index !== -1) {
        goodsList.value[index] = {
          ...goodsForm,
          updateTime: new Date().toLocaleString()
        }
      }
      ElMessage.success('编辑成功')
    } else {
      // 新增
      const newId = goodsList.value.length > 0 ? Math.max(...goodsList.value.map(item => item.id)) + 1 : 1
      goodsList.value.unshift({
        ...goodsForm,
        id: newId,
        specCount: 0,
        createTime: new Date().toLocaleString()
      })
      ElMessage.success('新增成功')
    }
    
    handleClose()
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const resetForm = () => {
  if (goodsFormRef.value) {
    goodsFormRef.value.resetFields()
  }
  Object.assign(goodsForm, {
    id: '',
    name: '',
    description: '',
    status: 'active'
  })
}

// 监听筛选条件变化
import { watch } from 'vue'

watch([searchKeyword, filterStatus], () => {
  currentPage.value = 1
})

// 生命周期
onMounted(() => {
  // 初始化数据
  loading.value = false
  console.log('商品管理页面初始化完成')
})
</script>

<style scoped>
.product-goods-container {
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

.count-tag {
  font-weight: 500;
  border-radius: var(--border-radius-md);
  min-width: 40px;
  text-align: center;
}

.status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.status-switch {
  transform: scale(0.9);
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  padding: 2px var(--spacing-sm);
  border-radius: var(--border-radius-sm);
}

.status-text.active {
  color: var(--color-success);
  background-color: var(--bg-success-light);
}

.status-text.inactive {
  color: var(--text-secondary);
  background-color: var(--bg-gray);
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

/* 商品弹窗 */
.category-dialog :deep(.el-dialog) {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.category-dialog :deep(.el-dialog__header) {
  padding: var(--spacing-xl) var(--spacing-xl) 0;
  margin: 0;
}

.category-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.category-dialog :deep(.el-dialog__body) {
  padding: var(--spacing-xl);
}

.category-dialog :deep(.el-form-item__label) {
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
  .product-goods-container {
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
  .product-goods-container {
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
  .product-goods-container {
    padding: var(--spacing-md);
  }
  
  .page-header {
    padding: var(--spacing-lg);
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .category-dialog :deep(.el-dialog) {
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