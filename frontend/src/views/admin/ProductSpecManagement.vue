<template>
  <div class="product-spec-management">
    <div class="page-header">
      <h2>商品规格管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加规格
      </el-button>
    </div>
    
    <!-- 商品选择 -->
    <el-card class="filter-card">
      <el-form :inline="true" class="search-form">
        <el-form-item label="选择商品">
          <el-select 
            v-model="selectedProductId" 
            placeholder="请选择商品" 
            clearable 
            @change="handleProductChange"
            style="width: 300px"
          >
            <el-option
              v-for="product in productOptions"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格名称">
          <el-input v-model="searchForm.name" placeholder="请输入规格名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 规格列表 -->
    <el-card class="table-card">
      <el-table :data="specList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="productName" label="商品名称" min-width="150" />
        <el-table-column prop="name" label="规格名称" min-width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="validityPeriod" label="有效期" width="120">
          <template #default="scope">
            {{ scope.row.validityPeriod }}天
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="success" link @click="generateKeys(scope.row)">生成卡密</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑规格对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="specFormRef"
        :model="specForm"
        :rules="specRules"
        label-width="100px"
      >
        <el-form-item label="所属商品" prop="productId">
          <el-select v-model="specForm.productId" placeholder="请选择商品" style="width: 100%">
            <el-option
              v-for="product in productOptions"
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
          <el-input-number 
            v-model="specForm.price" 
            :precision="2" 
            :step="0.1" 
            :min="0" 
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number 
            v-model="specForm.stock" 
            :min="0" 
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="有效期" prop="validityPeriod">
          <el-input-number 
            v-model="specForm.validityPeriod" 
            :min="1" 
            style="width: 100%"
          />
          <span style="margin-left: 10px;">天</span>
        </el-form-item>
        <el-form-item label="规格描述" prop="description">
          <el-input
            v-model="specForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入规格描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="specForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 生成卡密对话框 -->
    <el-dialog
      v-model="generateKeysVisible"
      title="生成卡密"
      width="500px"
    >
      <el-form
        ref="generateFormRef"
        :model="generateForm"
        :rules="generateRules"
        label-width="100px"
      >
        <el-form-item label="规格信息">
          <el-input v-model="currentSpecInfo" readonly />
        </el-form-item>
        <el-form-item label="生成数量" prop="count">
          <el-input-number 
            v-model="generateForm.count" 
            :min="1" 
            :max="1000" 
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="卡密前缀" prop="prefix">
          <el-input v-model="generateForm.prefix" placeholder="可选，如不填写将使用默认前缀" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="generateKeysVisible = false">取消</el-button>
          <el-button type="primary" @click="submitGenerateKeys">确定生成</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 加载状态
const loading = ref(false)

// 选中的商品ID
const selectedProductId = ref(null)

// 商品选项
const productOptions = ref([])

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 规格列表
const specList = ref([])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('添加规格')
const isEdit = ref(false)
const currentSpecId = ref(null)

// 规格表单
const specFormRef = ref(null)
const specForm = reactive({
  productId: null,
  name: '',
  price: 0,
  stock: 0,
  validityPeriod: 30,
  description: '',
  status: 'active'
})

// 表单验证规则
const specRules = {
  productId: [
    { required: true, message: '请选择所属商品', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入规格名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
  ],
  validityPeriod: [
    { required: true, message: '请输入有效期', trigger: 'blur' },
    { type: 'number', min: 1, message: '有效期不能小于1天', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入规格描述', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 生成卡密对话框
const generateKeysVisible = ref(false)
const generateFormRef = ref(null)
const generateForm = reactive({
  count: 10,
  prefix: ''
})

const generateRules = {
  count: [
    { required: true, message: '请输入生成数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 1000, message: '生成数量在1-1000之间', trigger: 'blur' }
  ]
}

// 当前规格信息
const currentSpecInfo = computed(() => {
  if (!currentSpecId.value) return ''
  const spec = specList.value.find(item => item.id === currentSpecId.value)
  if (!spec) return ''
  return `${spec.productName} - ${spec.name} (¥${spec.price})`
})

// 获取商品列表
const fetchProductOptions = () => {
  // 模拟API调用
  setTimeout(() => {
    productOptions.value = [
      { id: 1, name: '游戏点卡100元' },
      { id: 2, name: '视频会员月卡' },
      { id: 3, name: '音乐会员季卡' },
      { id: 4, name: '办公软件年卡' },
      { id: 5, name: '学习资料包' }
    ]
  }, 300)
}

// 获取规格列表
const fetchSpecList = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    const mockData = [
      {
        id: 1,
        productId: 1,
        productName: '游戏点卡100元',
        name: '标准版',
        price: 85.00,
        stock: 500,
        validityPeriod: 365,
        status: 'active',
        createTime: '2023-11-15 10:30:00'
      },
      {
        id: 2,
        productId: 1,
        productName: '游戏点卡100元',
        name: '优惠版',
        price: 75.00,
        stock: 200,
        validityPeriod: 180,
        status: 'active',
        createTime: '2023-11-15 10:35:00'
      },
      {
        id: 3,
        productId: 2,
        productName: '视频会员月卡',
        name: '普通会员',
        price: 15.00,
        stock: 1000,
        validityPeriod: 30,
        status: 'active',
        createTime: '2023-11-14 14:20:00'
      },
      {
        id: 4,
        productId: 2,
        productName: '视频会员月卡',
        name: '高级会员',
        price: 25.00,
        stock: 500,
        validityPeriod: 30,
        status: 'active',
        createTime: '2023-11-14 14:25:00'
      },
      {
        id: 5,
        productId: 3,
        productName: '音乐会员季卡',
        name: '基础版',
        price: 30.00,
        stock: 0,
        validityPeriod: 90,
        status: 'inactive',
        createTime: '2023-11-13 09:15:00'
      }
    ]
    
    // 应用搜索过滤
    let filteredData = mockData
    if (selectedProductId.value) {
      filteredData = filteredData.filter(item => item.productId === selectedProductId.value)
    }
    if (searchForm.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchForm.name.toLowerCase())
      )
    }
    
    // 更新总数
    pagination.total = filteredData.length
    
    // 应用分页
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    specList.value = filteredData.slice(start, end)
    
    loading.value = false
  }, 500)
}

// 商品选择变化
const handleProductChange = () => {
  pagination.currentPage = 1
  fetchSpecList()
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchSpecList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  selectedProductId.value = null
  pagination.currentPage = 1
  fetchSpecList()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchSpecList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchSpecList()
}

// 添加规格
const handleAdd = () => {
  dialogTitle.value = '添加规格'
  isEdit.value = false
  resetForm()
  
  // 如果有选中的商品，自动填充
  if (selectedProductId.value) {
    specForm.productId = selectedProductId.value
  }
  
  dialogVisible.value = true
}

// 编辑规格
const handleEdit = (row) => {
  dialogTitle.value = '编辑规格'
  isEdit.value = true
  currentSpecId.value = row.id
  
  // 填充表单数据
  specForm.productId = row.productId
  specForm.name = row.name
  specForm.price = row.price
  specForm.stock = row.stock
  specForm.validityPeriod = row.validityPeriod
  specForm.description = `${row.name}，优质规格，欢迎选购`
  specForm.status = row.status
  
  dialogVisible.value = true
}

// 删除规格
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除规格"${row.name}"吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('删除成功')
      fetchSpecList()
    }, 300)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 生成卡密
const generateKeys = (row) => {
  currentSpecId.value = row.id
  generateForm.count = 10
  generateForm.prefix = ''
  generateKeysVisible.value = true
}

// 提交表单
const submitForm = () => {
  specFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          ElMessage.success('规格更新成功')
        } else {
          ElMessage.success('规格添加成功')
        }
        dialogVisible.value = false
        fetchSpecList()
      }, 300)
    } else {
      ElMessage.error('请检查表单输入')
      return false
    }
  })
}

// 提交生成卡密
const submitGenerateKeys = () => {
  generateFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API调用
      setTimeout(() => {
        ElMessage.success(`成功生成${generateForm.count}个卡密`)
        generateKeysVisible.value = false
        router.push('/admin/card-keys')
      }, 300)
    } else {
      ElMessage.error('请检查表单输入')
      return false
    }
  })
}

// 重置表单
const resetForm = () => {
  specForm.productId = null
  specForm.name = ''
  specForm.price = 0
  specForm.stock = 0
  specForm.validityPeriod = 30
  specForm.description = ''
  specForm.status = 'active'
  if (specFormRef.value) {
    specFormRef.value.resetFields()
  }
}

// 对话框关闭处理
const handleDialogClose = () => {
  resetForm()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchProductOptions()
  
  // 检查URL参数中是否有productId
  if (route.query.productId) {
    selectedProductId.value = parseInt(route.query.productId)
  }
  
  fetchSpecList()
})
</script>

<style scoped>
.product-spec-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.filter-card {
  margin-bottom: 20px;
}

.search-form {
  margin-bottom: 0;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>