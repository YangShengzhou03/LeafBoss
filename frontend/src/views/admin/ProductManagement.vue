<template>
  <div class="admin-product-management">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="searchQuery"
              placeholder="商品名称"
              clearable
              @clear="handleSearch()"
              @keyup.enter="handleSearch()"
            >
              <template #append>
                <el-button @click="handleSearch()">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="statusFilter" placeholder="商品状态" clearable @change="handleSearch()">
              <el-option label="全部" value="" />
              <el-option label="在售" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </el-col>
          <el-col :span="14" class="button-group">
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button @click="resetFilters()">重置</el-button>
            <div style="flex: 1;"></div>
            <el-button type="primary" @click="handleAddProduct">新增商品</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 商品列表 -->
      <div class="table-container">
        <el-table :data="filteredProducts" v-loading="loading" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="100" align="center" show-overflow-tooltip />
            <el-table-column prop="name" label="商品名称" min-width="180" align="left" :show-overflow-tooltip="true" />
            <el-table-column prop="description" label="商品描述" min-width="200" align="left" :show-overflow-tooltip="true" />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'primary' : 'danger'">
                  {{ scope.row.status === 'active' ? '上架' : '下架' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180" align="center" :show-overflow-tooltip="true">
              <template #default="scope">
                {{ formatDateTime(scope.row.createdAt) || '-' }}
              </template>
            </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="handleEditProduct(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDeleteProduct(row)">删除</el-button>
              </template>
            </el-table-column>
          
          <!-- 空状态 -->
          <template #empty>
            <div class="empty-container" style="padding: 40px 0;">
              <el-empty description="暂无商品数据" :image-size="120" />
            </div>
          </template>
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
    
    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingProduct ? '编辑商品' : '添加商品'"
      width="500px"
    >
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="productForm.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="inactive">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '../../services/api'

// 加载状态
const loading = ref(false)

// 商品列表数据
const products = ref([])

// 搜索条件
const searchQuery = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框状态
const showAddDialog = ref(false)
const editingProduct = ref(null)

// 表单数据
const productForm = reactive({
  name: '',
  description: '',
  status: 'active'
})

// 表单验证规则
const productRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
}

// 计算属性：筛选后的商品列表
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }
  
  return filtered
})

// 分类标签类型映射函数已移除，因为所有商品都是虚拟卡密，不需要分类
// 分类文本映射函数已移除，因为所有商品都是虚拟卡密，不需要分类

// 加载商品数据
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await api.admin.getProductList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchQuery.value,
      status: statusFilter.value
    })
    
    if (response && response.data) {
      products.value = response.data.records || response.data.content || []
      total.value = response.data.total || response.data.totalElements || 0
    } else {
      products.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('加载商品数据失败，请检查网络连接')
    products.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}

// 重置筛选
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  handleSearch()
}

// 新增商品
const handleAddProduct = () => {
  showAddDialog.value = true
  editingProduct.value = null
  resetForm()
}

// 编辑商品
const handleEditProduct = (row) => {
  editingProduct.value = row
  Object.assign(productForm, row)
  showAddDialog.value = true
}

// 保存商品
const saveProduct = async () => {
  try {
    if (editingProduct.value) {
      // 更新商品
      const response = await api.admin.editProduct(productForm.id, productForm);
      if (response && response.code === 200) {
        ElMessage.success('商品更新成功');
        showAddDialog.value = false;
        loadProducts();
      } else {
        ElMessage.error(response?.message || '保存商品失败');
      }
    } else {
      // 添加商品
      const response = await api.admin.createProduct(productForm);
      if (response && response.code === 200) {
        ElMessage.success('商品添加成功');
        showAddDialog.value = false;
        loadProducts();
      } else {
        ElMessage.error(response?.message || '保存商品失败');
      }
    }
  } catch (error) {
    ElMessage.error('保存商品失败，请检查网络连接');
  }
};

// 重置表单
const resetForm = () => {
  editingProduct.value = null
  Object.assign(productForm, {
    name: '',
    description: '',
    status: 'active'
  })
}

// 删除商品
const handleDeleteProduct = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await api.admin.deleteProduct(row.id)
    if (response && response.code === 200) {
      ElMessage.success('删除成功')
      loadProducts()
    } else {
      ElMessage.error('删除失败，请重试')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      ElMessage.error('删除失败，请检查网络连接')
    }
  }
}

// 时间格式化函数
const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  try {
    const date = new Date(dateTime)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    console.error('时间格式化错误:', error)
    return dateTime
  }
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
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding: 16px;
}

.empty-container {
  padding: 40px 0;
}
</style>