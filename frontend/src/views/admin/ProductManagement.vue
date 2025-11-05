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
            <el-select v-model="statusFilter" placeholder="商品状态" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="在售" value="active" />
              <el-option label="下架" value="inactive" />
            </el-select>
          </el-col>
          <el-col :span="14" class="button-group">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetFilters">重置</el-button>
            <div style="flex: 1;"></div>
            <el-button type="primary" @click="handleAddProduct">新增商品</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 商品列表 -->
      <div class="table-container">
        <el-table :data="filteredProducts" v-loading="loading" stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="60" align="center" />
          <el-table-column prop="name" label="商品名称" width="160" show-overflow-tooltip />
          <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              {{ row.description || '暂无描述' }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="70" align="center" />
          <el-table-column prop="status" label="状态" width="70" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                {{ row.status === 'active' ? '在售' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
          <el-table-column label="操作" width="110" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="handleEditProduct(row)">编辑</el-button>
              <el-button size="small" type="danger" link @click="handleDeleteProduct(row)">删除</el-button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
    console.error('加载商品数据失败:', error)
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
  ElMessage.info('新增商品功能开发中')
}

// 编辑商品
const handleEditProduct = (row) => {
  ElMessage.info(`编辑商品: ${row.name}`)
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