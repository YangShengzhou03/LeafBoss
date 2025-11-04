<template>
  <div class="product-management">
    <div class="page-header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加商品
      </el-button>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 商品列表 -->
    <el-card class="table-card">
      <el-table :data="productList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" min-width="150" />
        <el-table-column prop="category" label="商品类别" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" link @click="manageSpecs(scope.row)">规格管理</el-button>
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
    
    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品类别" prop="category">
          <el-select v-model="productForm.category" placeholder="请选择商品类别" style="width: 100%">
            <el-option label="游戏点卡" value="game" />
            <el-option label="视频会员" value="video" />
            <el-option label="音乐会员" value="music" />
            <el-option label="软件授权" value="software" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <el-upload
            class="image-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <img v-if="productForm.image" :src="productForm.image" class="uploaded-image" />
            <el-icon v-else class="image-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="productForm.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="inactive">下架</el-radio>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 商品列表
const productList = ref([])

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('添加商品')
const isEdit = ref(false)
const currentProductId = ref(null)

// 商品表单
const productFormRef = ref(null)
const productForm = reactive({
  name: '',
  category: '',
  description: '',
  image: '',
  status: 'active'
})

// 表单验证规则
const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品类别', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在 5 到 200 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ]
}

// 获取商品列表
const fetchProductList = () => {
  loading.value = true
  
  // 模拟API调用，实际项目中应该调用后端API
  setTimeout(() => {
    const mockData = [
      {
        id: 1,
        name: '游戏点卡100元',
        category: 'game',
        price: 85.00,
        stock: 500,
        status: 'active',
        createTime: '2023-11-15 10:30:00'
      },
      {
        id: 2,
        name: '视频会员月卡',
        category: 'video',
        price: 15.00,
        stock: 1000,
        status: 'active',
        createTime: '2023-11-14 14:20:00'
      },
      {
        id: 3,
        name: '音乐会员季卡',
        category: 'music',
        price: 30.00,
        stock: 0,
        status: 'inactive',
        createTime: '2023-11-13 09:15:00'
      },
      {
        id: 4,
        name: '办公软件年卡',
        category: 'software',
        price: 365.00,
        stock: 200,
        status: 'active',
        createTime: '2023-11-12 16:45:00'
      },
      {
        id: 5,
        name: '学习资料包',
        category: 'other',
        price: 50.00,
        stock: 100,
        status: 'active',
        createTime: '2023-11-11 11:30:00'
      }
    ]
    
    // 应用搜索过滤
    let filteredData = mockData
    if (searchForm.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchForm.name.toLowerCase())
      )
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
    }
    
    // 更新总数
    pagination.total = filteredData.length
    
    // 应用分页
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    productList.value = filteredData.slice(start, end)
    
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchProductList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
  pagination.currentPage = 1
  fetchProductList()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchProductList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchProductList()
}

// 添加商品
const handleAdd = () => {
  dialogTitle.value = '添加商品'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑商品
const handleEdit = (row) => {
  dialogTitle.value = '编辑商品'
  isEdit.value = true
  currentProductId.value = row.id
  
  // 填充表单数据
  productForm.name = row.name
  productForm.category = row.category
  productForm.description = `${row.name}，优质商品，欢迎选购`
  productForm.image = `https://picsum.photos/seed/product${row.id}/200/200.jpg`
  productForm.status = row.status
  
  dialogVisible.value = true
}

// 删除商品
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除商品"${row.name}"吗？此操作不可恢复！`,
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
      fetchProductList()
    }, 300)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 管理规格
const manageSpecs = (row) => {
  router.push(`/admin/product-specs?productId=${row.id}`)
}

// 图片上传处理
const handleImageChange = (file) => {
  // 这里应该上传到服务器，现在只是模拟
  const reader = new FileReader()
  reader.onload = (e) => {
    productForm.image = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 提交表单
const submitForm = () => {
  productFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API调用
      setTimeout(() => {
        if (isEdit.value) {
          ElMessage.success('商品更新成功')
        } else {
          ElMessage.success('商品添加成功')
        }
        dialogVisible.value = false
        fetchProductList()
      }, 300)
    } else {
      ElMessage.error('请检查表单输入')
      return false
    }
  })
}

// 重置表单
const resetForm = () => {
  productForm.name = ''
  productForm.category = ''
  productForm.description = ''
  productForm.image = ''
  productForm.status = 'active'
  if (productFormRef.value) {
    productFormRef.value.resetFields()
  }
}

// 对话框关闭处理
const handleDialogClose = () => {
  resetForm()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchProductList()
})
</script>

<style scoped>
.product-management {
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

.image-uploader .uploaded-image {
  width: 178px;
  height: 178px;
  display: block;
}

.image-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.image-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}
</style>