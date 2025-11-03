<template>
  <div class="specifications-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规格管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加规格
          </el-button>
        </div>
      </template>

      <!-- 搜索和筛选 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索规格名称"
          style="width: 200px"
          clearable
        />
        <el-select v-model="filterGoods" placeholder="商品" clearable>
          <el-option 
            v-for="goods in goodsList" 
            :key="goods.id" 
            :label="goods.name" 
            :value="goods.id" 
          />
        </el-select>
        <el-select v-model="filterStatus" placeholder="状态" clearable>
          <el-option label="启用" value="active" />
          <el-option label="禁用" value="inactive" />
        </el-select>
      </div>

      <!-- 规格表格 -->
      <el-table :data="filteredSpecs" v-loading="loading">
        <el-table-column prop="name" label="规格名称" width="150" />
        <!-- 移除了分类列 -->
        <el-table-column prop="goodsName" label="商品" width="120" />
        <el-table-column prop="type" label="规格类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.type === 'text' ? '文本' : '数字' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="responseNumber" label="响应数字" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="toggleSpecStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editSpec(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteSpec(row)">删除</el-button>
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

    <!-- 添加/编辑规格弹窗 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="isEditing ? '编辑规格' : '添加规格'" 
      width="500px"
    >
      <el-form :model="currentSpec" label-width="80px" :rules="formRules" ref="specForm">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="currentSpec.name" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="商品" prop="goodsId">
          <el-select v-model="currentSpec.goodsId" placeholder="请选择商品">
            <el-option 
              v-for="goods in goodsList" 
              :key="goods.id" 
              :label="goods.name" 
              :value="goods.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格类型">
          <el-select v-model="currentSpec.type" placeholder="请选择规格类型">
            <el-option label="文本" value="text" />
            <el-option label="数字" value="number" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="currentSpec.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入规格描述" 
          />
        </el-form-item>
        <el-form-item label="响应数字" prop="responseNumber">
          <el-input-number 
            v-model="currentSpec.responseNumber" 
            :min="0" 
            :max="999" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSpec">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')
const filterGoods = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)
const showAddDialog = ref(false)
const isEditing = ref(false)
const specForm = ref(null)

const currentSpec = ref({
  id: '',
  name: '',
  goodsId: '',
  type: 'text',
  description: '',
  responseNumber: 0,
  status: 'active'
})

// 响应数字验证函数
const validateResponseNumber = (rule, value, callback) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error('请输入响应数字'))
  } else if (value < 1 || value > 999) {
    callback(new Error('响应数字必须在 1-999 之间'))
  } else {
    // 检查响应数字是否唯一
    const existingSpec = specifications.value.find(spec => 
      spec.responseNumber === value && spec.id !== currentSpec.value.id
    )
    if (existingSpec) {
      callback(new Error(`响应数字 ${value} 已被规格 "${existingSpec.name}" 使用`))
    } else {
      callback()
    }
  }
}

const formRules = {
  name: [
    { required: true, message: '请输入规格名称', trigger: 'blur' },
    { min: 2, max: 20, message: '规格名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  goodsId: [
    { required: true, message: '请选择商品', trigger: 'change' }
  ],
  responseNumber: [
    { required: true, message: '请输入响应数字', trigger: 'blur' },
    { type: 'number', min: 1, max: 999, message: '响应数字必须在 1-999 之间', trigger: 'blur' },
    { validator: validateResponseNumber, trigger: 'blur' }
  ]
}

// 模拟商品数据
const goodsList = ref([
  {
    id: 1,
    name: '月卡会员',
    status: 'active'
  },
  {
    id: 2,
    name: '季卡会员',
    status: 'active'
  },
  {
    id: 3,
    name: '年卡会员',
    status: 'active'
  },
  {
    id: 4,
    name: '生日礼品卡',
    status: 'active'
  },
  {
    id: 5,
    name: '节日礼品卡',
    status: 'active'
  },
  {
    id: 6,
    name: '测试卡A',
    status: 'active'
  }
])

// 模拟规格数据
const specifications = ref([
  {
    id: 1,
    name: '月卡',
    goodsId: 1,
    goodsName: '月卡会员',
    type: 'text',
    description: '30天有效期的卡密',
    responseNumber: 1,
    status: 'active',
    createdAt: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    name: '季卡',
    goodsId: 2,
    goodsName: '季卡会员',
    type: 'text',
    description: '90天有效期的卡密',
    responseNumber: 2,
    status: 'active',
    createdAt: '2024-01-15 09:15:00'
  },
  {
    id: 3,
    name: '年卡',
    goodsId: 3,
    goodsName: '年卡会员',
    type: 'text',
    description: '365天有效期的卡密',
    responseNumber: 3,
    status: 'active',
    createdAt: '2024-01-15 08:00:00'
  },
  {
    id: 4,
    name: '生日卡',
    goodsId: 4,
    goodsName: '生日礼品卡',
    type: 'text',
    description: '生日专属礼品卡',
    responseNumber: 4,
    status: 'active',
    createdAt: '2024-01-14 16:45:00'
  },
  {
    id: 5,
    name: '节日卡',
    goodsId: 5,
    goodsName: '节日礼品卡',
    type: 'text',
    description: '节日专属礼品卡',
    responseNumber: 5,
    status: 'active',
    createdAt: '2024-01-14 15:30:00'
  }
])

const filteredSpecs = computed(() => {
  return specifications.value.filter(spec => {
    const matchesKeyword = !searchKeyword.value || 
      spec.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesGoods = !filterGoods.value || spec.goodsId === filterGoods.value
    const matchesStatus = !filterStatus.value || spec.status === filterStatus.value
    return matchesKeyword && matchesGoods && matchesStatus
  })
})







const editSpec = (spec) => {
  isEditing.value = true
  currentSpec.value = { ...spec }
  showAddDialog.value = true
}

const deleteSpec = async (spec) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除规格 "${spec.name}" 吗？`,
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

const toggleSpecStatus = (spec) => {
  const action = spec.status === 'active' ? '启用' : '停用'
  ElMessage.success(`${action}成功`)
}

const saveSpec = async () => {
  if (!specForm.value) return
  
  try {
    await specForm.value.validate()
    
    // 检查规格名称是否重复（同一商品下）
    const existingNameSpec = specifications.value.find(
      spec => spec.name === currentSpec.value.name && 
               spec.goodsId === currentSpec.value.goodsId &&
               spec.id !== currentSpec.value.id
    )
    
    if (existingNameSpec) {
      ElMessage.error(`商品下已存在同名规格，请使用其他名称`)
      return
    }
    
    // 检查响应数字是否重复
    const existingSpec = specifications.value.find(
      spec => spec.responseNumber === currentSpec.value.responseNumber && 
               spec.id !== currentSpec.value.id
    )
    
    if (existingSpec) {
      ElMessage.error(`响应数字 ${currentSpec.value.responseNumber} 已存在，请使用其他数字`)
      return
    }
    
    // 验证规格类型和响应数字的合理性
    if (currentSpec.value.type === 'number' && currentSpec.value.responseNumber <= 0) {
      ElMessage.error('数字类型规格的响应数字必须大于0')
      return
    }
    
    // 查找商品名称
    const goods = goodsList.value.find(g => g.id === currentSpec.value.goodsId)
    
    if (!goods) {
      ElMessage.error('商品信息不存在')
      return
    }
    
    if (isEditing.value) {
      // 更新规格
      const index = specifications.value.findIndex(spec => spec.id === currentSpec.value.id)
      if (index !== -1) {
        specifications.value[index] = {
          ...currentSpec.value,
          goodsName: goods.name
        }
      }
      ElMessage.success('规格更新成功')
    } else {
      // 添加新规格
      const newSpec = {
        ...currentSpec.value,
        id: Date.now(),
        goodsName: goods.name,
        createdAt: new Date().toLocaleString('zh-CN')
      }
      specifications.value.unshift(newSpec)
      ElMessage.success('规格添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const resetForm = () => {
  currentSpec.value = {
    id: '',
    name: '',
    goodsId: '',
    type: 'text',
    description: '',
    responseNumber: 0,
    status: 'active'
  }
  isEditing.value = false
}

onMounted(() => {
  loading.value = true
  // 模拟加载数据
  setTimeout(() => {
    loading.value = false
  }, 500)
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
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>