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
                <el-option label="已停用" value="inactive" />
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
                <el-button 
                  size="small" 
                  :type="scope.row.status === 'active' ? 'warning' : 'primary'"
                  @click="toggleSpecStatus(scope.row)"
                >
                  {{ scope.row.status === 'active' ? '停用' : '启用' }}
                </el-button>
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="deleteSpec(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
            
            <!-- 空状态 -->
            <template #empty>
              <div class="empty-container" style="padding: 40px 0;">
                <el-empty description="暂无规格数据" :image-size="120" />
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
            layout="total, sizes, prev, pager, next, jumper"
            :total="filteredTotal"
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
        <el-form-item label="商品名称" prop="productId">
          <el-select v-model="specForm.productId" placeholder="请选择商品" style="width: 100%">
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
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

// 加载状态
const loading = ref(false)

// 商品规格列表
const specs = ref([])

// 商品列表（用于下拉选择）
const products = ref([])

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
  productId: '',
  productName: '',
  name: '',
  price: 0
})

// 格式化ID显示
const formatId = (id) => {
  if (!id) return ''
  // 直接显示前8位，后面用省略号
  if (id.length > 8) {
    return `${id.substring(0, 8)}...`
  }
  return id
}

// 表单验证规则
const specRules = {
  productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  name: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

// 计算属性：直接显示当前页的数据
const filteredSpecs = computed(() => {
  return specs.value
})

// 计算属性：显示后端返回的总数
const filteredTotal = computed(() => {
  return totalSpecs.value
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

// 加载商品列表
const loadProducts = async () => {
  try {
    const response = await api.admin.getProductList({
      page: 1,
      size: 1000, // 获取所有商品
      status: 'active' // 只获取上架的商品
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

// 加载商品规格数据
const loadSpecs = async () => {
  loading.value = true
  try {
    // 构建查询参数（后端分页）
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    // 调用分页API获取商品规格列表（后端分页）
    const response = await api.admin.getSpecList(params)
    
    // 处理API响应数据格式
    if (response && response.data) {
      const data = response.data
      let specList = []
      
      // 处理分页响应格式
      if (data.records) {
        specList = data.records
        totalSpecs.value = data.total || 0
      } else if (data.content) {
        specList = data.content
        totalSpecs.value = data.totalElements || 0
      } else if (Array.isArray(data)) {
        specList = data
        totalSpecs.value = data.length
      } else {
        specList = []
        totalSpecs.value = 0
      }
      
      // 处理规格数据，添加商品名称和格式化创建时间
      const processedSpecs = specList.map(spec => {
        // 根据productId查找商品名称
        const product = products.value.find(p => p.id === spec.productId)
        const productName = product ? product.name : '未知商品'
        
        // 格式化创建时间
        let createTime = spec.createTime || spec.createdAt || spec.create_time || ''
        if (createTime) {
          // 如果是时间戳，转换为日期格式
          if (typeof createTime === 'number' || /^\d+$/.test(createTime)) {
            createTime = new Date(parseInt(createTime)).toLocaleString()
          } else if (typeof createTime === 'string') {
            // 尝试解析日期字符串
            try {
              createTime = new Date(createTime).toLocaleString()
            } catch (e) {
              // 忽略日期解析错误
            }
          }
        }
        
        return {
          ...spec,
          productName: productName,
          createTime: createTime || '未知时间'
        }
      })
      
      // 存储当前页的规格数据
      specs.value = processedSpecs
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

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadSpecs()
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
  // 重新调用API获取数据
  loadSpecs()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  // 重新调用API获取数据
  loadSpecs()
}

// 编辑规格
const editSpec = (spec) => {
  editingSpec.value = spec
  Object.assign(specForm, {
    productId: spec.productId || '',
    name: spec.name || '',
    price: spec.price || 0
  })
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
    
    // 修复状态切换逻辑：使用英文状态值（数据库只接受active/inactive）
    const newStatus = spec.status === 'active' ? 'inactive' : 'active'
    
    // 调用API更新规格状态 - 使用英文状态值
    const response = await api.admin.editSpec(spec.id, {
      status: newStatus
    })
    
    if (response && response.code === 200) {
      // 更新本地状态 - 使用英文状态值
      spec.status = newStatus
      ElMessage.success('操作成功')
      
      // 重新加载数据确保数据一致性
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

// 删除规格
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
    
    // 调用API删除规格
    const response = await api.admin.deleteSpec(spec.id)
    if (response && response.code === 200) {
      ElMessage.success('删除成功')
      
      // 从本地列表中移除
      const index = specs.value.findIndex(s => s.id === spec.id)
      if (index !== -1) {
        specs.value.splice(index, 1)
      }
      
      // 重新加载数据确保数据一致性
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

// 保存规格
const saveSpec = async () => {
  try {
    // 获取选中的商品信息
    const selectedProduct = products.value.find(p => p.id === specForm.productId)
    if (!selectedProduct) {
      ElMessage.error('请选择有效的商品')
      return
    }
    
    // 准备提交的数据
    const submitData = {
      ...specForm,
      productName: selectedProduct.name
    }
    
    if (editingSpec.value) {
      // 调用API更新规格
      await api.admin.editSpec(editingSpec.value.id, submitData)
      
      // 更新本地数据
      const index = specs.value.findIndex(s => s.id === editingSpec.value.id)
      if (index !== -1) {
        specs.value[index] = { 
          ...specs.value[index], 
          ...submitData,
          productName: selectedProduct.name
        }
      }
    } else {
      // 调用API添加新规格
      const response = await api.admin.createSpec(submitData)
      
      // 添加新规格到本地列表
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
    
    // 重新加载数据确保数据一致性
    loadSpecs()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 重置表单
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