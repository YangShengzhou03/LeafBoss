<template>
  <div class="card-list">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="卡号">
          <el-input
            v-model="searchForm.cardNumber"
            placeholder="请输入卡号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="卡等级">
          <el-select v-model="searchForm.cardLevel" placeholder="请选择卡等级" clearable>
            <el-option
              v-for="level in cardLevels"
              :key="level.value"
              :label="level.label"
              :value="level.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品类别">
          <el-select v-model="searchForm.productCategory" placeholder="请选择商品类别" clearable>
            <el-option
              v-for="category in productCategories"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡状态">
          <el-select v-model="searchForm.cardStatus" placeholder="请选择卡状态" clearable>
            <el-option
              v-for="status in cardStatuses"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
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
        新增卡
      </el-button>
      <el-button type="success" @click="showImportDialog = true">
        <el-icon><Upload /></el-icon>
        导入卡
      </el-button>
      <el-button @click="showExportDialog = true">
        <el-icon><Download /></el-icon>
        导出数据
      </el-button>
    </div>

    <!-- 表格区域 -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="cardNumber" label="卡号" min-width="150" />
        <el-table-column prop="cardLevel" label="卡等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.cardLevel)">
              {{ getLevelLabel(row.cardLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productCategory" label="商品类别" width="120" />
        <el-table-column prop="cardStatus" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.cardStatus)">
              {{ getStatusLabel(row.cardStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="expireTime" label="过期时间" width="160" />
        <el-table-column prop="rechargeTimes" label="补充次数" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              v-if="row.cardStatus === 0" 
              link 
              type="success" 
              @click="handleActivate(row)"
            >
              激活
            </el-button>
            <el-button 
              v-if="row.cardStatus === 1" 
              link 
              type="warning" 
              @click="handleRecharge(row)"
            >
              补充
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="showImportDialog" title="导入卡数据" width="500px">
      <div class="import-dialog">
        <div class="import-tips">
          <p>支持格式：Excel (.xlsx, .xls), CSV (.csv)</p>
          <p>文件大小限制：10MB</p>
        </div>
        
        <div class="import-actions">
          <el-button type="primary" @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
          <el-button type="success" @click="handleFileSelect">
            <el-icon><Upload /></el-icon>
            选择文件
          </el-button>
        </div>
        
        <div v-if="selectedFile" class="file-info">
          <el-icon><Document /></el-icon>
          <span>{{ selectedFile.name }}</span>
          <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          :loading="importLoading" 
          :disabled="!selectedFile"
          @click="handleImport"
        >
          开始导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 导出对话框 -->
    <el-dialog v-model="showExportDialog" title="导出卡数据" width="500px">
      <div class="export-dialog">
        <div class="export-tips">
          <p>导出格式：Excel (.xlsx)</p>
          <p>导出范围：当前筛选条件下的所有数据</p>
        </div>
        
        <div class="export-options">
          <el-form :model="exportForm" label-width="80px">
            <el-form-item label="导出范围">
              <el-radio-group v-model="exportForm.range">
                <el-radio label="current">当前页数据</el-radio>
                <el-radio label="all">全部数据</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文件格式">
              <el-radio-group v-model="exportForm.format">
                <el-radio label="xlsx">Excel (.xlsx)</el-radio>
                <el-radio label="csv">CSV (.csv)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          :loading="exportLoading" 
          @click="handleExport"
        >
          开始导出
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Upload, Document } from '@element-plus/icons-vue'
import type { Card, CardQueryParams } from '@/api/card'
import { getCardList, deleteCard, activateCard, rechargeCard, importCards, downloadTemplate, exportCards } from '@/api/card'

const router = useRouter()

// 搜索表单
const searchForm = reactive({
  cardNumber: '',
  cardLevel: '',
  productCategory: '',
  cardStatus: undefined as number | undefined
})

// 表格数据
const tableData = ref<Card[]>([])
const loading = ref(false)

// 导入相关
const showImportDialog = ref(false)
const importLoading = ref(false)
const selectedFile = ref<File | null>(null)

// 导出相关
const showExportDialog = ref(false)
const exportLoading = ref(false)
const exportForm = reactive({
  range: 'all',
  format: 'xlsx'
})

// 分页
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 枚举数据
const cardLevels = [
  { value: '普通会员', label: '普通会员' },
  { value: '超级会员', label: '超级会员' },
  { value: '钻石会员', label: '钻石会员' }
]

const productCategories = [
  { value: '视频会员', label: '视频会员' },
  { value: '音乐会员', label: '音乐会员' },
  { value: '电商优惠券', label: '电商优惠券' },
  { value: '游戏点卡', label: '游戏点卡' }
]

const cardStatuses = [
  { value: 0, label: '未激活' },
  { value: 1, label: '已激活' },
  { value: 2, label: '已使用' },
  { value: 3, label: '已过期' },
  { value: 4, label: '已冻结' }
]

// 获取标签类型
const getLevelTagType = (level: string) => {
  const map: Record<string, string> = {
    '普通会员': '',
    '超级会员': 'warning',
    '钻石会员': 'success'
  }
  return map[level] || ''
}

const getStatusTagType = (status: number) => {
  const map: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: '',
    3: 'warning',
    4: 'danger'
  }
  return map[status] || ''
}

// 获取标签文本
const getLevelLabel = (level: string) => level
const getStatusLabel = (status: number) => {
  const map: Record<number, string> = {
    0: '未激活',
    1: '已激活',
    2: '已使用',
    3: '已过期',
    4: '已冻结'
  }
  return map[status] || '未知'
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params: CardQueryParams = {
      page: pagination.current,
      size: pagination.size,
      ...searchForm
    }
    const response = await getCardList(params)
    tableData.value = response.records
    pagination.total = response.total
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  loadData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    cardNumber: '',
    cardLevel: '',
    productCategory: '',
    cardStatus: undefined
  })
  handleSearch()
}

// 新增
const handleAdd = () => {
  router.push('/cards/add')
}

// 查看
const handleView = (row: Card) => {
  router.push(`/cards/detail/${row.id}`)
}

// 编辑
const handleEdit = (row: Card) => {
  router.push(`/cards/edit/${row.id}`)
}

// 激活
const handleActivate = async (row: Card) => {
  try {
    await ElMessageBox.confirm('确定要激活这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await activateCard(row.id!)
    ElMessage.success('激活成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 补充
const handleRecharge = async (row: Card) => {
  try {
    await ElMessageBox.confirm('确定要补充这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await rechargeCard(row.id!)
    ElMessage.success('补充成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 删除
const handleDelete = async (row: Card) => {
  try {
    await ElMessageBox.confirm('确定要删除这张卡吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteCard(row.id!)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    // 用户取消操作
  }
}

// 文件选择
const handleFileSelect = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.xlsx,.xls,.csv'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    // 检查文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过10MB')
      return
    }
    
    // 检查文件类型
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      ElMessage.error('请选择Excel或CSV格式的文件')
      return
    }
    
    selectedFile.value = file
  }
  input.click()
}

// 导入
const handleImport = async () => {
  if (!selectedFile.value) return
  
  try {
    importLoading.value = true
    await importCards(selectedFile.value)
    ElMessage.success('导入成功')
    showImportDialog.value = false
    selectedFile.value = null
    loadData()
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败，请检查文件格式')
  } finally {
    importLoading.value = false
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadTemplate()
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '卡导入模板.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('模板下载成功')
  } catch (error) {
    console.error('下载模板失败:', error)
    ElMessage.error('下载模板失败')
  }
}

// 导出
const handleExport = async () => {
  try {
    exportLoading.value = true
    
    // 构建导出参数
    const params: CardQueryParams = {
      ...searchForm
    }
    
    if (exportForm.range === 'current') {
      params.page = pagination.current
      params.size = pagination.size
    } else {
      params.page = 1
      params.size = pagination.total
    }
    
    const response = await exportCards(params)
    
    // 创建下载链接
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    // 设置文件名
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const extension = exportForm.format === 'csv' ? 'csv' : 'xlsx'
    link.download = `卡数据_${timestamp}.${extension}`
    
    link.href = url
    link.click()
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
    showExportDialog.value = false
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 分页
const handleSizeChange = (size: number) => {
  pagination.size = size
  pagination.current = 1
  loadData()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.card-list {
  padding: 0;
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

.import-dialog {
  text-align: center;
}

.import-tips {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.import-tips p {
  margin: 5px 0;
}

.import-actions {
  margin-bottom: 20px;
}

.import-actions .el-button {
  margin: 0 10px;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;
}

.file-info .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.file-size {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

.export-dialog {
  text-align: center;
}

.export-tips {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.export-tips p {
  margin: 5px 0;
}

.export-options {
  text-align: left;
}

.export-options .el-form-item {
  margin-bottom: 15px;
}
</style>