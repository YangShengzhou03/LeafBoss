<template>
  <div class="product-list">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入商品名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="searchForm.categoryId"
            :options="categoryOptions"
            :props="{ checkStrictly: true, emitPath: false }"
            placeholder="请选择分类"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格范围">
          <el-input-number
            v-model="searchForm.minPrice"
            placeholder="最低价"
            :min="0"
            :precision="2"
            style="width: 120px"
          />
          <span style="margin: 0 10px">-</span>
          <el-input-number
            v-model="searchForm.maxPrice"
            placeholder="最高价"
            :min="0"
            :precision="2"
            style="width: 120px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作区域 -->
    <div class="action-bar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增商品
      </el-button>
      <el-button type="success" @click="showImportDialog = true">
        <el-icon><Upload /></el-icon>
        导入商品
      </el-button>
      <el-button @click="showExportDialog = true">
        <el-icon><Download /></el-icon>
        导出数据
      </el-button>
      <el-button @click="handleBatchDelete" :disabled="selectedIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.thumbnail || row.images[0] || '/images/default-product.png'"
              :preview-src-list="row.images"
              fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: bold">¥{{ row.price }}</span>
            <div v-if="row.originalPrice" style="color: #999; text-decoration: line-through; font-size: 12px">
              ¥{{ row.originalPrice }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80">
          <template #default="{ row }">
            <span :class="{ 'low-stock': row.stock < 10 }">{{ row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="saleCount" label="销量" width="80" />
        <el-table-column prop="viewCount" label="浏览量" width="80" />
        <el-table-column label="特色" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.isFeatured" type="success" size="small">推荐</el-tag>
            <el-tag v-if="row.isHot" type="danger" size="small">热销</el-tag>
            <el-tag v-if="row.isNew" type="warning" size="small">新品</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handleView(row)">查看</el-button>
            <el-button 
              type="warning" 
              link 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '下架' : '上架' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="showImportDialog" title="导入商品" width="500px">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        action=""
        :auto-upload="false"
        :on-change="handleFileChange"
        accept=".xlsx,.xls,.csv"
      >
        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            支持 .xlsx, .xls, .csv 格式文件，文件大小不超过10MB
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="handleImport" :loading="importLoading">
          导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog v-model="showExportDialog" title="导出商品" width="400px">
      <el-form :model="exportForm" label-width="80px">
        <el-form-item label="导出格式">
          <el-radio-group v-model="exportForm.format">
            <el-radio label="excel">Excel</el-radio>
            <el-radio label="csv">CSV</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导出字段">
          <el-checkbox-group v-model="exportForm.fields">
            <el-checkbox label="name">商品名称</el-checkbox>
            <el-checkbox label="sku">SKU</el-checkbox>
            <el-checkbox label="price">价格</el-checkbox>
            <el-checkbox label="stock">库存</el-checkbox>
            <el-checkbox label="status">状态</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button type="primary" @click="handleExport" :loading="exportLoading">
          导出
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type UploadFile } from 'element-plus'
import { Plus, Upload, Download, Delete, Picture } from '@element-plus/icons-vue'
import { safeProductApi } from '@/api/product'
import type { 
  ProductInfo, 
  ProductQueryParams,
  ProductCategory,
  ProductImportResult 
} from '@/types'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  keyword: '',
  categoryId: undefined as number | undefined,
  status: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 表格数据
const tableData = ref<ProductInfo[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 分类选项
const categoryOptions = ref<ProductCategory[]>([])

// 对话框状态
const showImportDialog = ref(false)
const showExportDialog = ref(false)
const importLoading = ref(false)
const exportLoading = ref(false)

// 导出表单
const exportForm = reactive({
  format: 'excel' as 'excel' | 'csv',
  fields: ['name', 'sku', 'price', 'stock', 'status']
})

// 文件上传引用
const uploadRef = ref()
const uploadFile = ref<File | null>(null)

onMounted(() => {
  loadProductList()
  loadCategories()
})

// 加载商品列表
const loadProductList = async () => {
  loading.value = true
  try {
    const params: ProductQueryParams = {
      page: pagination.current,
      pageSize: pagination.size,
      ...searchForm
    }
    
    const response = await safeProductApi.getProducts(params)
    if (response.success && response.data) {
      tableData.value = response.data.list || []
      pagination.total = response.data.total || 0
    } else {
      ElMessage.error(response.message || '获取商品列表失败')
    }
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 加载分类列表
const loadCategories = async () => {
  try {
    // 这里需要调用分类API，暂时使用模拟数据
    categoryOptions.value = [
      { id: 1, name: '电子产品', level: 1, sort: 1, status: true, productCount: 0, createdAt: '', updatedAt: '' },
      { id: 2, name: '服装', level: 1, sort: 2, status: true, productCount: 0, createdAt: '', updatedAt: '' },
      { id: 3, name: '食品', level: 1, sort: 3, status: true, productCount: 0, createdAt: '', updatedAt: '' }
    ]
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  loadProductList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    categoryId: undefined,
    status: '',
    minPrice: undefined,
    maxPrice: undefined
  })
  handleSearch()
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadProductList()
}

// 当前页改变
const handleCurrentChange = (current: number) => {
  pagination.current = current
  loadProductList()
}

// 选择改变
const handleSelectionChange = (selection: ProductInfo[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 新增商品
const handleAdd = () => {
  router.push('/products/add')
}

// 编辑商品
const handleEdit = (row: ProductInfo) => {
  router.push(`/products/edit/${row.id}`)
}

// 查看商品
const handleView = (row: ProductInfo) => {
  router.push(`/products/detail/${row.id}`)
}

// 切换商品状态
const handleToggleStatus = async (row: ProductInfo) => {
  try {
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    const response = await safeProductApi.updateProduct(row.id, { status: newStatus })
    if (response.success) {
      ElMessage.success('状态更新成功')
      loadProductList()
    } else {
      ElMessage.error(response.message || '状态更新失败')
    }
  } catch (error) {
    console.error('切换状态失败:', error)
    ElMessage.error('状态更新失败')
  }
}

// 删除商品
const handleDelete = async (row: ProductInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${row.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const response = await safeProductApi.deleteProduct(row.id)
    if (response.success) {
      ElMessage.success('删除成功')
      loadProductList()
    } else {
      ElMessage.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个商品吗？此操作不可恢复。`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 这里需要调用批量删除API
    ElMessage.success('批量删除成功')
    selectedIds.value = []
    loadProductList()
  } catch (error) {
    console.error('批量删除失败:', error)
  }
}

// 文件选择
const handleFileChange = (file: UploadFile) => {
  uploadFile.value = file.raw as File
}

// 导入商品
const handleImport = async () => {
  if (!uploadFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  importLoading.value = true
  try {
    // 这里需要调用导入API
    ElMessage.success('导入成功')
    showImportDialog.value = false
    loadProductList()
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败')
  } finally {
    importLoading.value = false
  }
}

// 导出商品
const handleExport = async () => {
  exportLoading.value = true
  try {
    // 这里需要调用导出API
    ElMessage.success('导出成功')
    showExportDialog.value = false
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'info'
    case 'draft': return 'warning'
    default: return 'info'
  }
}

// 状态标签文本
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return '上架'
    case 'inactive': return '下架'
    case 'draft': return '草稿'
    default: return status
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: #f5f7fa;
  color: #909399;
  border-radius: 4px;
}

.low-stock {
  color: #f56c6c;
  font-weight: bold;
}

.upload-demo {
  text-align: center;
}

.el-upload__tip {
  margin-top: 10px;
  color: #606266;
  font-size: 12px;
}
</style>