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
        <!-- 移除了分类筛选 -->
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
        <el-col :span="4">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <el-button type="primary" @click="handleAdd">
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
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="商品名称" min-width="150" />
        <!-- 移除了分类列 -->
        <el-table-column prop="description" label="商品描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="specCount" label="规格数量" width="100" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
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
              title="确定删除这个商品吗？"
              @confirm="handleDelete(row)"
              v-if="row.specCount === 0"
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
            <el-tooltip
              v-else
              content="该商品下有规格，无法删除"
              placement="top"
            >
              <el-button
                type="danger"
                size="small"
                :icon="Delete"
                disabled
              >
                删除
              </el-button>
            </el-tooltip>
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
        <!-- 移除了商品分类选择字段 -->
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
    specCount: 3,
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: 'Photoshop激活码',
    description: 'Adobe Photoshop正版软件激活码',
    status: 'active',
    specCount: 2,
    createTime: '2024-01-16 14:20:00'
  },
  {
    id: 3,
    name: '视频会员月卡',
    description: '各大视频平台会员月卡服务',
    status: 'inactive',
    specCount: 0,
    createTime: '2024-01-17 09:15:00'
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
      `确定删除商品"${row.name}"吗？此操作不可恢复。`,
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
    categoryId: '',
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
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 20px;
}

.table-section {
  margin-bottom: 20px;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-table) {
  margin-top: 10px;
}

:deep(.el-table .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>