<template>
  <div class="admin-product-management">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <span>卡密管理</span>
          <el-button type="primary" @click="handleAddProduct">
            <el-icon><Plus /></el-icon>
            新增卡密
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-input
              v-model="searchQuery"
              placeholder="卡密名称"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="categoryFilter" placeholder="卡密分类" clearable>
              <el-option label="虚拟卡密" value="virtual" />
              <el-option label="实体卡密" value="physical" />
              <el-option label="服务类" value="service" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="statusFilter" placeholder="卡密状态" clearable>
              <el-option label="使用中" value="active" />
              <el-option label="未使用" value="inactive" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 卡密列表 -->
      <div class="table-container">
        <el-table :data="filteredProducts" v-loading="loading" stripe>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="卡密名称" min-width="200" />
          <el-table-column prop="category" label="分类" width="100">
            <template #default="{ row }">
              <el-tag :type="getCategoryTagType(row.category)">
                {{ getCategoryText(row.category) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120">
            <template #default="{ row }">
              ¥{{ row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '使用中' : '未使用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEditProduct(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteProduct(row)">删除</el-button>
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
import { Plus, Search } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 卡密列表数据
const products = ref([])

// 搜索条件
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 计算属性：筛选后的卡密列表
const filteredProducts = computed(() => {
  let filtered = products.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query)
    )
  }
  
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(product => product.status === statusFilter.value)
  }
  
  return filtered
})

// 分类标签类型映射
const getCategoryTagType = (category) => {
  const typeMap = {
    virtual: 'primary',
    physical: 'success',
    service: 'warning'
  }
  return typeMap[category] || 'info'
}

// 分类文本映射
const getCategoryText = (category) => {
  const textMap = {
    virtual: '虚拟卡密',
    physical: '实体卡密',
    service: '服务类'
  }
  return textMap[category] || '未知'
}

// 加载卡密数据
const loadProducts = async () => {
  loading.value = true
  try {
    // 模拟数据 - 实际项目中应该调用API
    products.value = [
      {
        id: 1,
        name: 'VIP会员月卡',
        category: 'virtual',
        price: 29.99,
        stock: 1000,
        status: 'active',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        name: '实体礼品卡',
        category: 'physical',
        price: 199.99,
        stock: 50,
        status: 'active',
        createTime: '2024-01-02 14:30:00'
      },
      {
        id: 3,
        name: '在线课程服务',
        category: 'service',
        price: 399.99,
        stock: 200,
        status: 'inactive',
        createTime: '2024-01-03 09:15:00'
      }
    ]
    total.value = products.value.length
  } catch (error) {
    ElMessage.error('加载卡密数据失败')
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
  categoryFilter.value = ''
  statusFilter.value = ''
  handleSearch()
}

// 新增卡密
const handleAddProduct = () => {
  ElMessage.info('新增卡密功能开发中')
}

// 编辑卡密
const handleEditProduct = (row) => {
  ElMessage.info(`编辑卡密: ${row.name}`)
}

// 删除卡密
const handleDeleteProduct = (row) => {
  ElMessageBox.confirm(
    `确定要删除卡密"${row.name}"吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    loadProducts()
  }).catch(() => {
    // 取消操作
  })
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
  background-color: #f0f2f5;
}

.product-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card :deep(.el-card__body) {
  padding: 16px;
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
}

.table-container {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>