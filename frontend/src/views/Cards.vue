<template>
  <div class="cards-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>卡密管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加卡密
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          :model-value="searchKeyword"
          @update:model-value="debouncedSearch"
          placeholder="搜索卡密编号"
          style="width: 200px"
          clearable
        />
        <el-select v-model="filterCategory" placeholder="商品分类" clearable @change="handleCategoryChange">
          <el-option 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :value="category.id" 
          />
        </el-select>
        <el-select v-model="filterGoods" placeholder="商品" clearable :disabled="!filterCategory">
          <el-option 
            v-for="goods in filteredGoods" 
            :key="goods.id" 
            :label="goods.name" 
            :value="goods.id" 
          />
        </el-select>
        <el-select v-model="filterSpec" placeholder="规格" clearable :disabled="!filterGoods">
          <el-option 
            v-for="spec in filteredSpecs" 
            :key="spec.id" 
            :label="spec.name" 
            :value="spec.id" 
          />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable>
          <el-option label="未使用" value="unused" />
          <el-option label="已使用" value="used" />
        </el-select>
      </div>

      <!-- 卡密表格 -->
      <el-table :data="paginatedCards" v-loading="loading">
        <el-table-column prop="id" label="卡密编号" width="200" />
        <el-table-column prop="categoryName" label="商品分类" width="120" />
        <el-table-column prop="goodsName" label="商品" width="120" />
        <el-table-column prop="specName" label="规格" width="120" />
        <el-table-column prop="responseNumber" label="响应数字" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'unused' ? 'success' : 'info'">
              {{ row.status === 'unused' ? '未使用' : '已使用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="生成时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="viewCard(row)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteCard(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 添加卡密弹窗 -->
    <el-dialog v-model="showAddDialog" title="添加卡密" width="500px" @close="resetForm">
      <el-form ref="cardFormRef" :model="newCard" :rules="formRules" label-width="80px">
        <el-form-item label="规格类型" prop="specType">
          <el-select v-model="newCard.specType" placeholder="请选择规格类型">
            <el-option label="月卡" value="month" />
            <el-option label="季卡" value="quarter" />
            <el-option label="年卡" value="year" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="newCard.quantity" :min="1" :max="1000" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddCards">生成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'
import { generateCardsBatch, validateCardFormat, cardStatusManager, cardCacheManager } from '@/utils/cardUtils'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const filterSpec = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)
const showAddDialog = ref(false)

// 防抖搜索
const debouncedSearch = useDebounceFn((value) => {
  searchKeyword.value = value
}, 300)

// 表单验证规则
const formRules = ref({
  specType: [
    { required: true, message: '请选择规格类型', trigger: 'change' }
  ],
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 1000, message: '数量必须在1-1000之间', trigger: 'blur' }
  ]
})

const newCard = ref({
  specType: '',
  quantity: 1
})

// 表单引用
const cardFormRef = ref()

// 模拟数据 - 优化数据结构
const cards = ref([
  {
    id: 'CARD-20240115-001',
    specType: '月卡',
    responseNumber: 0,
    status: 'unused',
    createdAt: '2024-01-15 10:30:00',
    categoryName: '软件服务',
    goodsName: '办公软件',
    specName: '月卡'
  },
  {
    id: 'CARD-20240115-002',
    specType: '年卡',
    responseNumber: 0,
    status: 'used',
    createdAt: '2024-01-15 09:15:00',
    categoryName: '软件服务',
    goodsName: '办公软件',
    specName: '年卡'
  }
])

// 优化计算属性 - 使用记忆化减少重复计算
const filteredCards = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  const spec = filterSpec.value
  const status = filterStatus.value
  
  return cards.value.filter(card => {
    const matchesKeyword = !keyword || card.id.toLowerCase().includes(keyword)
    const matchesSpec = !spec || card.specType === spec
    const matchesStatus = !status || card.status === status
    return matchesKeyword && matchesSpec && matchesStatus
  })
})

// 添加分页数据计算
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCards.value.slice(start, end)
})

const viewCard = (card) => {
  ElMessage.info(`查看卡密: ${card.id}`)
}

const deleteCard = async (card) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除卡密 ${card.id} 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

// 重置表单
const resetForm = () => {
  if (cardFormRef.value) {
    cardFormRef.value.resetFields()
  }
  newCard.value = {
    specType: '',
    quantity: 1
  }
}

// 添加卡密 - 带完整错误处理
const handleAddCards = async () => {
  try {
    // 表单验证
    if (!cardFormRef.value) return
    
    const valid = await cardFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成卡密
    const generatedCards = generateCards(newCard.value.specType, newCard.value.quantity)
    cards.value = [...generatedCards, ...cards.value]
    
    ElMessage.success(`成功生成 ${newCard.value.quantity} 张卡密`)
    showAddDialog.value = false
    resetForm()
    
  } catch (error) {
    console.error('添加卡密失败:', error)
    ElMessage.error('卡密生成失败，请重试')
  } finally {
    loading.value = false
  }
}

// 使用优化后的卡密生成算法
const generateCards = (specType, quantity) => {
  return generateCardsBatch(specType, quantity, {
    prefix: 'CARD',
    categoryName: '软件服务',
    goodsName: '办公软件'
  })
}

// 内存泄漏防护
let dataLoadingTimer = null

onMounted(() => {
  loading.value = true
  // 模拟加载数据 - 使用可清理的定时器
  dataLoadingTimer = setTimeout(() => {
    loading.value = false
  }, 500)
})

onUnmounted(() => {
  // 清理定时器防止内存泄漏
  if (dataLoadingTimer) {
    clearTimeout(dataLoadingTimer)
    dataLoadingTimer = null
  }
})

// 监听搜索关键词变化，添加防抖
watch(() => searchKeyword.value, (newVal) => {
  debouncedSearch(newVal)
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>