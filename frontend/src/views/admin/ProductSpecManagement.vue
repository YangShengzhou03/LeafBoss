<template>
  <div class="admin-product-spec">
    <el-card class="product-spec-card">
      <template #header>
        <div class="card-header">
          <span>商品规格管理</span>
        </div>
      </template>

      <div class="product-spec-content">
        <div class="search-bar">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input v-model="searchQuery" placeholder="搜索商品名称或规格名称" clearable @clear="handleSearch"
                @keyup.enter="handleSearch">
                <template #append>
                  <el-button @click="handleSearch">
                    <el-icon>
                      <Search />
                    </el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-select v-model="productFilter" placeholder="商品筛选" clearable @change="handleSearch">
                <el-option label="全部" value="" />
                <el-option v-for="product in products" :key="product.id" :label="product.name" :value="product.id" />
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

        <div class="table-container">
          <el-table :data="filteredSpecs" style="width: 100%" v-loading="loading" :scroll="{ x: 1200 }">
            <el-table-column prop="id" label="ID" width="100" align="center">
              <template #default="scope">
                <span class="id-display">{{ formatId(scope.row.id) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称" min-width="180" align="left" :show-overflow-tooltip="true">
              <template #default="scope">
                {{ scope.row.productName || '-' }}
              </template>
            </el-table-column>
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
            <el-table-column label="操作" width="250" fixed="right" align="center">
              <template #default="scope">
                <el-button size="small" @click="editSpec(scope.row)">编辑</el-button>
                <el-button size="small" :type="scope.row.status === 'active' ? 'warning' : 'primary'"
                  @click="toggleSpecStatus(scope.row)">
                  {{ scope.row.status === 'active' ? '停用' : '启用' }}
                </el-button>
                <el-button size="small" type="danger" @click="deleteSpec(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="empty-container" style="padding: 40px 0;">
                <el-empty description="暂无规格数据" :image-size="120" />
              </div>
            </template>
          </el-table>
        </div>

        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper" :total="filteredTotal" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </el-card>

    <el-dialog v-model="showAddDialog" :title="editingSpec ? '编辑规格' : '添加规格'" width="500px">
      <el-form :model="specForm" :rules="specRules" ref="specFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="productId">
          <el-select v-model="specForm.productId" placeholder="请选择商品" style="width: 100%">
            <el-option v-for="product in products" :key="product.id" :label="product.name" :value="product.id" />
          </el-select>
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
import api from '../../services/api'

const loading = ref(false)

const specs = ref([])

const products = ref([])

const searchQuery = ref('')
const productFilter = ref('')

const currentPage = ref(1)
const pageSize = ref(10)
const totalSpecs = ref(0)

const showAddDialog = ref(false)
const editingSpec = ref(null)

const specForm = reactive({
  productId: '',
  productName: '',
  name: '',
  price: 0
})

const formatId = (id) => {
  if (!id) return ''
  if (id.length > 8) {
    return `${id.substring(0, 8)}...`
  }
  return id
}

const specRules = {
  productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

const filteredSpecs = computed(() => {
  return specs.value
})

const filteredTotal = computed(() => {
  return totalSpecs.value
})

const calculateUsageRate = (used, total) => {
  if (!total || total === 0) return 0
  return Math.round((used / total) * 100)
}

const getUsageRateClass = (used, total) => {
  const rate = calculateUsageRate(used, total)
  if (rate >= 80) return 'high-usage'
  if (rate >= 50) return 'medium-usage'
  return 'low-usage'
}

const loadProducts = async () => {
  try {
    const response = await api.admin.getProductList({
      page: 1,
      size: 1000,
      status: 'active'
    })

    if (response && response.data) {
      const data = response.data
      if (data.records) {
        products.value = data.records
      } else if (data.content) {
        products.value = data.content
      } else {
        products.value = []
      }
    } else {
      products.value = []
    }
  } catch (error) {
    products.value = []
  }
}

const loadSpecs = async () => {
  loading.value = true
  try {
    const response = await api.admin.getSpecListDTO({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchQuery.value,
      productId: productFilter.value
    })

    if (response && response.data) {
      const pageData = response.data
      const specList = pageData.records || pageData.content || pageData.list || []

      const processedSpecs = specList.map(spec => {
        const product = products.value.find(p => p.id === spec.productId)
        const productName = product ? product.name : spec.productName || '未知商品'

        let createTime = spec.createTime || spec.createdAt || spec.create_time || ''
        if (createTime) {
          if (typeof createTime === 'number' || /^\d+$/.test(createTime)) {
            createTime = new Date(parseInt(createTime)).toLocaleString()
          } else if (typeof createTime === 'string') {
            try {
              createTime = new Date(createTime).toLocaleString()
            } catch (e) {
              createTime = '未知时间'
            }
          }
        }

        return {
          ...spec,
          productName: productName,
          createTime: createTime || '未知时间',
          totalKeys: spec.totalKeys || 0,
          usedKeys: spec.usedKeys || 0,
          unusedKeys: spec.unusedKeys || 0
        }
      })

      specs.value = processedSpecs
      totalSpecs.value = pageData.total || pageData.totalElements || specList.length
    } else {
      specs.value = []
      totalSpecs.value = 0
    }
  } catch (error) {
    ElMessage.error('加载商品规格失败，请检查网络连接')
    specs.value = []
    totalSpecs.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadSpecs()
}

const resetFilters = () => {
  searchQuery.value = ''
  productFilter.value = ''
  handleSearch()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadSpecs()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadSpecs()
}

const editSpec = (spec) => {
  editingSpec.value = spec
  Object.assign(specForm, {
    productId: spec.productId || '',
    name: spec.name || '',
    price: spec.price || 0
  })
  showAddDialog.value = true
}

const toggleSpecStatus = async (spec) => {
  try {
    await ElMessageBox.confirm(
      `确定要${spec.status === 'active' ? '停用' : '启用'}该规格吗？`,
      '提示',
      { type: 'warning' }
    )

    const newStatus = spec.status === 'active' ? 'inactive' : 'active'

    const response = await api.admin.editSpec(spec.id, {
      status: newStatus
    })

    if (response && response.code === 200) {
      spec.status = newStatus
      ElMessage.success('操作成功')

      loadSpecs()
    } else {
      ElMessage.error('操作失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败，请检查网络连接')
    }
  }
}

const deleteSpec = async (spec) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规格"${spec.name}"吗？此操作不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await api.admin.deleteSpec(spec.id)
    if (response && response.code === 200) {
      ElMessage.success('删除成功')

      const index = specs.value.findIndex(s => s.id === spec.id)
      if (index !== -1) {
        specs.value.splice(index, 1)
      }

      loadSpecs()
    } else {
      ElMessage.error('删除失败，请重试')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请检查网络连接')
    }
  }
}

const saveSpec = async () => {
  try {
    const selectedProduct = products.value.find(p => p.id === specForm.productId)
    if (!selectedProduct) {
      ElMessage.error('请选择有效的商品')
      return
    }

    const submitData = {
      ...specForm,
      productName: selectedProduct.name
    }

    if (editingSpec.value) {
      await api.admin.editSpec(editingSpec.value.id, submitData)

      const index = specs.value.findIndex(s => s.id === editingSpec.value.id)
      if (index !== -1) {
        specs.value[index] = {
          ...specs.value[index],
          ...submitData,
          productName: selectedProduct.name
        }
      }
    } else {
      const response = await api.admin.createSpec(submitData)

      const newSpec = {
        id: response.data?.id || Date.now(),
        ...submitData,
        productName: selectedProduct.name,
        totalKeys: 0,
        usedKeys: 0,
        status: 'active',
        createTime: new Date().toLocaleString()
      }
      specs.value.unshift(newSpec)
    }

    showAddDialog.value = false
    ElMessage.success(editingSpec.value ? '更新成功' : '添加成功')
    resetForm()

    loadSpecs()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const resetForm = () => {
  editingSpec.value = null
  Object.assign(specForm, {
    productId: '',
    productName: '',
    name: '',
    price: 0
  })
}

onMounted(async () => {
  await loadProducts()
  await loadSpecs()
})
</script>

<style scoped>
.admin-product-spec {
  padding: 0;
}

.search-bar {
  margin-bottom: 16px;
  padding: 20px;
}

.search-bar :deep(.button-group) {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.id-display {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
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