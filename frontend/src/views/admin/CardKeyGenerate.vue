<template>
  <div class="admin-cardkey-generate">
    <el-card class="generate-card">
      <template #header>
        <div class="card-header">
          <span>卡密生成</span>
        </div>
      </template>

      <!-- 生成配置 -->
      <div class="config-section">
        <el-form :model="generateForm" label-width="100px">
          <!-- 第一行：生成数量、卡密长度、商品、规格 -->
          <el-row :gutter="8">
            <el-col :span="4">
              <el-form-item label="生成数量">
                <el-input-number 
                  v-model="generateForm.count" 
                  :min="1" 
                  :max="10000" 
                  controls-position="right"
                  placeholder="请输入数量"
                  class="form-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="卡密长度">
                <el-input-number 
                  v-model="generateForm.length" 
                  :min="8" 
                  :max="32" 
                  controls-position="right"
                  placeholder="请输入长度"
                  class="form-input"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="商品">
                <el-select v-model="generateForm.productId" placeholder="请选择商品" clearable class="form-input">
                  <el-option 
                    v-for="product in productList" 
                    :key="product.id" 
                    :label="product.name" 
                    :value="product.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="规格">
                <el-select v-model="generateForm.specId" placeholder="请选择规格" clearable class="form-input">
                  <el-option 
                    v-for="spec in specList" 
                    :key="spec.id" 
                    :label="spec.name" 
                    :value="spec.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作">
                <div class="action-buttons">
                  <el-button type="primary" @click="generateCardKeys" :loading="generating" class="generate-btn">
                    生成卡密
                  </el-button>
                  <el-button @click="resetForm" class="reset-btn">
                    重置
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          
          <!-- 第二行：字符集 -->
          <el-row :gutter="12">
            <el-col :span="24">
              <el-form-item label="字符集">
                <el-checkbox-group v-model="generateForm.charset" class="charset-group">
                  <el-checkbox label="numbers" class="charset-checkbox">数字 (0-9)</el-checkbox>
                  <el-checkbox label="uppercase" class="charset-checkbox">大写字母 (A-Z)</el-checkbox>
                  <el-checkbox label="lowercase" class="charset-checkbox">小写字母 (a-z)</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 生成结果 -->
      <div v-if="generatedKeys.length > 0" class="result-section">
        <div class="result-header">
          <div class="result-header-content">
            <span class="result-title">生成结果 ({{ generatedKeys.length }} 条)</span>
            
            <!-- 商品规格信息 -->
            <div v-if="generateForm.productId && generateForm.specId" class="product-spec-info">
              <span class="info-label">商品：</span>
              <span class="info-value">{{ getProductName(generateForm.productId) }}</span>
              <span class="info-label">规格：</span>
              <span class="info-value">{{ getSpecName(generateForm.specId) }}</span>
            </div>
            
            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button 
                type="success" 
                @click="addToStock" 
                :loading="addingToStock" 
                :disabled="!generateForm.productId || !generateForm.specId"
                class="action-btn"
              >
                <el-icon><Upload /></el-icon>
                导入系统
              </el-button>
              <el-button type="primary" @click="exportCardKeys" class="export-btn">
                <el-icon><Download /></el-icon>
                导出卡密
              </el-button>
            </div>
          </div>
        </div>
        
        <el-table :data="paginatedKeys" border stripe class="result-table">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="key" label="卡密代码" min-width="220" align="center" />
          <el-table-column prop="productName" label="商品" width="120" align="center" />
          <el-table-column prop="specName" label="规格" width="120" align="center" />
          <el-table-column label="操作" width="140" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button type="link" @click="copyCardKey(row.key)" class="copy-btn">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container" v-if="generatedKeys.length > 10">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="generatedKeys.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CopyDocument, Download, Upload } from '@element-plus/icons-vue'
import Server from '@/utils/Server.js'

// 生成状态
const generating = ref(false)
const addingToStock = ref(false)

// 生成表单
const generateForm = reactive({
  count: 100,
  length: 32,
  productId: '',
  specId: '',
  charset: ['numbers', 'uppercase', 'lowercase']
})

// 商品列表
const productList = ref([])
// 规格列表
const specList = ref([])

// 生成的卡密列表
const generatedKeys = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 计算当前页显示的数据
const paginatedKeys = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return generatedKeys.value.slice(startIndex, endIndex)
})

// 分页事件处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 加载商品列表
const loadProducts = async () => {
  try {
    const response = await Server.get('/api/products')
    if (response.data && response.data.success) {
      productList.value = response.data.data || []
    } else {
      ElMessage.error('加载商品列表失败')
    }
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('加载商品列表失败，请检查网络连接')
  }
}

// 加载规格列表
const loadSpecs = async () => {
  try {
    const response = await Server.get('/api/specifications')
    if (response.data && response.data.success) {
      specList.value = response.data.data || []
    } else {
      ElMessage.error('加载规格列表失败')
    }
  } catch (error) {
    console.error('加载规格列表失败:', error)
    ElMessage.error('加载规格列表失败，请检查网络连接')
  }
}

// 添加库存
const addToStock = async () => {
  if (generatedKeys.value.length === 0) {
    ElMessage.warning('请先生成卡密')
    return
  }
  
  if (!generateForm.productId || !generateForm.specId) {
    ElMessage.warning('请选择商品和规格')
    return
  }
  
  addingToStock.value = true
  
  try {
    await ElMessageBox.confirm(
      `确定要将 ${generatedKeys.value.length} 个卡密添加到库存吗？`,
      '确认添加库存',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用真实API添加库存
    const response = await Server.post('/card-keys/batch', {
      productId: generateForm.productId,
      specId: generateForm.specId,
      keys: generatedKeys.value.map(key => key.key)
    })
    
    if (response.data && response.data.success) {
      ElMessage.success(`成功添加 ${generatedKeys.value.length} 个卡密到库存`)
      
      // 清空生成的卡密
      generatedKeys.value = []
    } else {
      ElMessage.error('添加库存失败')
    }
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('添加库存失败:', error)
      ElMessage.error('添加库存失败，请检查网络连接')
    }
  } finally {
    addingToStock.value = false
  }
}

// 生成随机卡密
const generateRandomKey = () => {
  let charset = ''
  
  if (generateForm.charset.includes('numbers')) {
    charset += '0123456789'
  }
  if (generateForm.charset.includes('uppercase')) {
    charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  if (generateForm.charset.includes('lowercase')) {
    charset += 'abcdefghijklmnopqrstuvwxyz'
  }
  
  if (charset === '') {
    charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }
  
  let result = ''
  const charsetLength = charset.length
  
  for (let i = 0; i < generateForm.length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charsetLength))
  }
  
  return result
}

// 生成卡密
const generateCardKeys = async () => {
  if (generateForm.count <= 0) {
    ElMessage.warning('请设置生成数量')
    return
  }
  
  if (generateForm.length < 8) {
    ElMessage.warning('卡密长度不能小于8位')
    return
  }
  
  if (!generateForm.productId || !generateForm.specId) {
    ElMessage.warning('请选择商品和规格')
    return
  }
  
  generating.value = true
  
  try {
    generatedKeys.value = []
    
    const product = productList.value.find(p => p.id === generateForm.productId)
    const spec = specList.value.find(s => s.id === generateForm.specId)
    
    for (let i = 0; i < generateForm.count; i++) {
      const key = generateRandomKey()
      generatedKeys.value.push({
        key: key,
        productName: product ? product.name : '',
        specName: spec ? spec.name : ''
      })
    }
    
    ElMessage.success(`成功生成 ${generateForm.count} 个卡密`)
  } catch (error) {
    ElMessage.error('生成卡密失败')
  } finally {
    generating.value = false
  }
}

// 获取商品名称
const getProductName = (productId) => {
  const product = productList.value.find(p => p.id === productId)
  return product ? product.name : ''
}

// 获取规格名称
const getSpecName = (specId) => {
  const spec = specList.value.find(s => s.id === specId)
  return spec ? spec.name : ''
}

// 导出卡密
const exportCardKeys = () => {
  if (generatedKeys.value.length === 0) {
    ElMessage.warning('没有可导出的卡密')
    return
  }
  
  const content = generatedKeys.value.map(key => key.key).join('\n')
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cardkeys_${new Date().getTime()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  ElMessage.success('卡密已导出为TXT文件')
}

// 复制单个卡密
const copyCardKey = async (key) => {
  try {
    await navigator.clipboard.writeText(key)
    ElMessage.success('卡密已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = key
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('卡密已复制到剪贴板')
  }
}



// 重置表单
const resetForm = () => {
  Object.assign(generateForm, {
    count: 100,
    length: 32,
    productId: '',
    specId: '',
    charset: ['numbers', 'uppercase', 'lowercase']
  })
  generatedKeys.value = []
}

onMounted(() => {
  loadProducts()
  loadSpecs()
})
</script>

<style scoped>
.admin-cardkey-generate {
  padding: 0;
  background-color: #f0f2f5;
}

.generate-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.generate-card :deep(.el-card__body) {
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

.config-section {
  margin-bottom: 20px;
}

.config-section :deep(.el-form-item) {
  margin-bottom: 8px;
}

.config-section :deep(.el-form-item__label) {
  font-weight: 500;
  padding-bottom: 4px;
}

.form-input {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 6px;
  justify-content: flex-start;
}

.generate-btn {
  min-width: 80px;
  padding: 8px 12px;
}

.reset-btn {
  min-width: 60px;
  padding: 8px 12px;
}

.result-section {
  border-top: 1px solid #e6e8eb;
  padding-top: 16px;
}

.result-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.result-title {
  font-weight: 600;
  font-size: 16px;
  color: #303133;
  white-space: nowrap;
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.product-spec-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  border: 1px solid #e6e8eb;
  white-space: nowrap;
}

.info-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.info-value {
  font-size: 13px;
  color: #303133;
  font-weight: 600;
}

.result-actions .action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.charset-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

.charset-checkbox {
  margin-right: 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.keys-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e6e8eb;
  border-radius: 4px;
  padding: 12px;
  background-color: #fafafa;
}

.key-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #e6e8eb;
}

.key-item:last-child {
  margin-bottom: 0;
}

.key-text {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #333;
  user-select: all;
}

.copy-btn {
  padding: 4px;
  min-width: auto;
}

.copy-btn:hover {
  background-color: #f5f7fa;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

.pagination-container :deep(.el-pagination) {
  justify-content: flex-end;
}

.pagination-container :deep(.el-pagination__total) {
  margin-right: 16px;
  font-size: 14px;
  color: #606266;
}

.pagination-container :deep(.el-pagination__sizes) {
  margin-right: 16px;
}

.pagination-container :deep(.el-pagination__jump) {
  margin-left: 16px;
}
</style>