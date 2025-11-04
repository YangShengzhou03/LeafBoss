<template>
  <div class="admin-product-spec">
    <el-card class="product-spec-card">
      <template #header>
        <div class="card-header">
          <span>商品规格管理</span>
        </div>
      </template>
      
      <div class="product-spec-content">
        <!-- 搜索和筛选 -->
        <div class="search-bar">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input
                v-model="searchQuery"
                placeholder="搜索商品名称或规格名称"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button @click="handleSearch">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-select v-model="statusFilter" placeholder="规格状态" clearable @change="handleSearch">
                <el-option label="全部" value="" />
                <el-option label="发放中" value="active" />
                <el-option label="已停用" value="disabled" />
              </el-select>
            </el-col>
            <el-col :span="14" class="button-group">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetFilters">重置</el-button>
              <div style="flex: 1;"></div>
              <el-button type="primary" @click="showAddDialog = true">添加规格</el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 商品规格列表 -->
        <div class="table-container">
          <el-table :data="filteredSpecs" style="width: 100%" v-loading="loading" :scroll="{ x: 1200 }">
            <el-table-column prop="id" label="ID" width="80" align="center" />
            <el-table-column prop="productName" label="商品名称" min-width="180" align="left" :show-overflow-tooltip="true" />
            <el-table-column prop="name" label="规格名称" min-width="150" align="left" :show-overflow-tooltip="true" />
            <el-table-column prop="price" label="价格" width="120" align="center">
              <template #default="scope">
                ¥{{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="totalKeys" label="卡密总数" width="120" align="center">
              <template #default="scope">
                {{ scope.row.totalKeys || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="usedKeys" label="已使用" width="100" align="center">
              <template #default="scope">
                {{ scope.row.usedKeys || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="usageRate" label="使用率" width="120" align="center">
              <template #default="scope">
                <span :class="getUsageRateClass(scope.row.usedKeys, scope.row.totalKeys)">
                  {{ calculateUsageRate(scope.row.usedKeys, scope.row.totalKeys) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="规格状态" width="120" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '发放中' : '已停用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="操作" width="200" fixed="right" align="center">
              <template #default="scope">
                <el-button size="small" @click="editSpec(scope.row)">编辑</el-button>
                <el-button 
                  size="small" 
                  :type="scope.row.status === 'active' ? 'warning' : 'success'"
                  @click="toggleSpecStatus(scope.row)"
                >
                  {{ scope.row.status === 'active' ? '停用' : '启用' }}
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
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSpecs"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
    
    <!-- 添加/编辑规格对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingSpec ? '编辑规格' : '添加规格'"
      width="500px"
    >
      <el-form :model="specForm" :rules="specRules" ref="specFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="specForm.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="specForm.name" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="specForm.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveSpec">确定</el-button>
        </span>
      </template>
    </el-dialog>
    

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 商品规格列表
const specs = ref([])

// 搜索条件
const searchQuery = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const totalSpecs = ref(0)

// 对话框状态
const showAddDialog = ref(false)
const editingSpec = ref(null)

// 表单数据
const specForm = reactive({
  productName: '',
  name: '',
  price: 0
})



// 表单验证规则
const specRules = {
  productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}



// 计算属性：筛选后的规格列表
const filteredSpecs = computed(() => {
  let filtered = specs.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(spec => 
      spec.productName.toLowerCase().includes(query) || 
      spec.name.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(spec => spec.status === statusFilter.value)
  }
  
  return filtered
})

// 计算使用率
const calculateUsageRate = (used, total) => {
  if (!total || total === 0) return 0
  return Math.round((used / total) * 100)
}

// 获取使用率样式类
const getUsageRateClass = (used, total) => {
  const rate = calculateUsageRate(used, total)
  if (rate >= 80) return 'high-usage'
  if (rate >= 50) return 'medium-usage'
  return 'low-usage'
}

// 加载商品规格数据
const loadSpecs = async () => {
  loading.value = true
  try {
    // 模拟数据 - 实际项目中应该调用API
    specs.value = [
      {
        id: 1,
        productName: 'VIP会员',
        name: '月卡',
        price: 29.9,
        totalKeys: 100,
        usedKeys: 75,
        status: 'active',
        createTime: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        productName: 'VIP会员',
        name: '季卡',
        price: 79.9,
        totalKeys: 50,
        usedKeys: 30,
        status: 'active',
        createTime: '2024-01-10 14:20:00'
      },
      {
        id: 3,
        productName: '超级会员',
        name: '年卡',
        price: 299.9,
        totalKeys: 20,
        usedKeys: 5,
        status: 'active',
        createTime: '2024-01-05 09:15:00'
      }
    ]
    totalSpecs.value = specs.value.length
  } catch (error) {
    ElMessage.error('加载商品规格失败')
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
  statusFilter.value = ''
  handleSearch()
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

// 编辑规格
const editSpec = (spec) => {
  editingSpec.value = spec
  Object.assign(specForm, spec)
  showAddDialog.value = true
}

// 切换规格状态
const toggleSpecStatus = async (spec) => {
  try {
    await ElMessageBox.confirm(
      `确定要${spec.status === 'active' ? '停用' : '启用'}该规格吗？`,
      '提示',
      { type: 'warning' }
    )
    
    // 实际项目中应该调用API
    spec.status = spec.status === 'active' ? 'disabled' : 'active'
    ElMessage.success('操作成功')
  } catch (error) {
    // 用户取消操作
  }
}



// 保存规格
const saveSpec = async () => {
  try {
    // 实际项目中应该调用API
    if (editingSpec.value) {
      // 更新规格
      const index = specs.value.findIndex(s => s.id === editingSpec.value.id)
      if (index !== -1) {
        specs.value[index] = { ...specs.value[index], ...specForm }
      }
    } else {
      // 添加新规格
      const newSpec = {
        id: Date.now(),
        ...specForm,
        totalKeys: 0,
        usedKeys: 0,
        createTime: new Date().toLocaleString()
      }
      specs.value.unshift(newSpec)
    }
    
    showAddDialog.value = false
    ElMessage.success(editingSpec.value ? '更新成功' : '添加成功')
    resetForm()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}



// 重置表单
const resetForm = () => {
  editingSpec.value = null
  Object.assign(specForm, {
    productName: '',
    name: '',
    price: 0
  })
}

onMounted(() => {
  loadSpecs()
})
</script>

<style scoped>
.admin-product-spec {
  padding: 0;
  background-color: #f0f2f5;
}

.product-spec-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-spec-card :deep(.el-card__body) {
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

.high-usage {
  color: #f56c6c;
  font-weight: bold;
}

.medium-usage {
  color: #e6a23c;
  font-weight: bold;
}

.low-usage {
  color: #67c23a;
  font-weight: bold;
}
</style>