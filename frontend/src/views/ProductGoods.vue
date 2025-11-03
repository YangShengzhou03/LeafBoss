<template>
  <div class="product-goods-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品名称"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="filterStatus"
            placeholder="选择状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-col>
        <el-col :span="14" style="text-align: right;">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button type="success" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增商品
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 商品列表 -->
    <div class="table-section">
      <el-table
        :data="paginatedGoods"
        v-loading="loading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="70" align="center" />
        <el-table-column prop="name" label="商品名称" min-width="180" />
        <el-table-column prop="description" label="商品描述" min-width="220" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="specCount" label="规格数量" width="90" align="center" />
        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <div class="table-actions">
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

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 添加/编辑商品弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
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
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
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

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定删除商品"${row.name}"吗？删除商品将同时删除其所有规格，此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
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
      const newId = Math.max(...goodsList.value.map(item => item.id)) + 1
      goodsList.value.push({
        ...goodsForm,
        id: newId,
        specCount: 0
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

// 生命周期
onMounted(() => {
  // 初始化数据
  loading.value = false
})
</script>

<style scoped>
.product-goods-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.table-section {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding: 0 16px;
}

.table-actions {
  display: flex;
  gap: 6px;
  justify-content: center;
}

/* 表格样式优化 - 使用更柔和的色彩 */
:deep(.el-table) {
  margin-top: 8px;
  border-radius: 4px;
  overflow: hidden;
  font-size: 14px;
}

:deep(.el-table .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #606266;
  font-weight: 500;
}

:deep(.el-table--border) {
  border-color: #ebeef5;
}

:deep(.el-table--border::after),
:deep(.el-table--group::after),
:deep(.el-table::before) {
  background-color: #ebeef5;
}

:deep(.el-table td),
:deep(.el-table th.is-leaf) {
  border-bottom: 1px solid #ebeef5;
}

/* 按钮样式优化 - 使用更柔和的色彩 */
:deep(.el-button--small) {
  padding: 5px 10px;
}

:deep(.el-button--primary) {
  background-color: #5b8dee;
  border-color: #5b8dee;
}

:deep(.el-button--primary:hover) {
  background-color: #4b7ed8;
  border-color: #4b7ed8;
}

:deep(.el-button--success) {
  background-color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-button--success:hover) {
  background-color: #5cb32e;
  border-color: #5cb32e;
}

:deep(.el-button--danger) {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

:deep(.el-button--danger:hover) {
  background-color: #e45c5c;
  border-color: #e45c5c;
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
  color: #606266;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}

:deep(.el-input__inner:focus) {
  border-color: #5b8dee;
}

/* 标签样式优化 */
:deep(.el-tag--success) {
  background-color: #f0f9ff;
  border-color: #b3d8ff;
  color: #409eff;
}

:deep(.el-tag--danger) {
  background-color: #fef0f0;
  border-color: #fbc4c4;
  color: #f56c6c;
}

/* 分页样式优化 */
:deep(.el-pagination) {
  color: #606266;
}

:deep(.el-pagination .el-select .el-input .el-input__inner) {
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section {
    padding: 12px;
  }
  
  .table-section {
    padding: 12px;
  }
  
  .table-actions {
    flex-direction: column;
    gap: 4px;
  }
}
</style>