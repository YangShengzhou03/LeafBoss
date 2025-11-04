<template>
  <div class="card-key-management">
    <div class="page-header">
      <h2>卡密管理</h2>
      <div class="header-actions">
        <el-button type="success" @click="handleVerify">
          <el-icon><Check /></el-icon>
          验证卡密
        </el-button>
        <el-button type="primary" @click="handleBatchExport" :disabled="!selectedKeys.length">
          <el-icon><Download /></el-icon>
          批量导出
        </el-button>
      </div>
    </div>
    
    <!-- 搜索和筛选区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="卡密">
          <el-input v-model="searchForm.key" placeholder="请输入卡密" clearable />
        </el-form-item>
        <el-form-item label="商品规格">
          <el-select v-model="searchForm.specId" placeholder="请选择商品规格" clearable style="width: 200px">
            <el-option
              v-for="spec in specOptions"
              :key="spec.id"
              :label="`${spec.productName} - ${spec.name}`"
              :value="spec.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡密状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="未售出" value="unsold" />
            <el-option label="已售出" value="sold" />
            <el-option label="已使用" value="used" />
            <el-option label="已过期" value="expired" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 卡密列表 -->
    <el-card class="table-card">
      <el-table 
        :data="keyList" 
        v-loading="loading" 
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="key" label="卡密" min-width="200">
          <template #default="scope">
            <el-button type="text" @click="copyKey(scope.row.key)">
              {{ scope.row.key }}
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="150" />
      <el-table-column prop="specName" label="规格名称" min-width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="validityPeriod" label="有效期" width="120">
        <template #default="scope">
          {{ scope.row.validityPeriod }}天
        </template>
      </el-table-column>
        <el-table-column prop="createTime" label="生成时间" width="180" />
        <el-table-column prop="usedTime" label="使用时间" width="180">
          <template #default="scope">
            {{ scope.row.usedTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="viewDetails(scope.row)">详情</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)" v-if="scope.row.status === 'unsold'">删除</el-button>
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
    
    <!-- 验证卡密对话框 -->
    <el-dialog
      v-model="verifyVisible"
      title="验证卡密"
      width="500px"
    >
      <el-form
        ref="verifyFormRef"
        :model="verifyForm"
        :rules="verifyRules"
        label-width="100px"
      >
        <el-form-item label="卡密" prop="key">
          <el-input v-model="verifyForm.key" placeholder="请输入要验证的卡密" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="verifyVisible = false">取消</el-button>
          <el-button type="primary" @click="submitVerify">验证</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 卡密详情对话框 -->
    <el-dialog
      v-model="detailsVisible"
      title="卡密详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="卡密">{{ currentKey.key }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentKey.status)">
            {{ getStatusText(currentKey.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ currentKey.productName }}</el-descriptions-item>
        <el-descriptions-item label="规格名称">{{ currentKey.specName }}</el-descriptions-item>
        <el-descriptions-item label="有效期">{{ currentKey.validityPeriod }}天</el-descriptions-item>
        <el-descriptions-item label="生成时间">{{ currentKey.createTime }}</el-descriptions-item>
        <el-descriptions-item label="使用时间">{{ currentKey.usedTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="使用人">{{ currentKey.buyer || '-' }}</el-descriptions-item>
        <el-descriptions-item label="使用时间">{{ currentKey.buyTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailsVisible = false">关闭</el-button>
          <el-button type="primary" @click="copyKey(currentKey.key)">复制卡密</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Download, CopyDocument } from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 规格选项
const specOptions = ref([])

// 搜索表单
const searchForm = reactive({
  key: '',
  specId: null,
  status: '',
  dateRange: []
})

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 卡密列表
const keyList = ref([])

// 选中的卡密
const selectedKeys = ref([])

// 验证卡密对话框
const verifyVisible = ref(false)
const verifyFormRef = ref(null)
const verifyForm = reactive({
  key: ''
})

const verifyRules = {
  key: [
    { required: true, message: '请输入卡密', trigger: 'blur' }
  ]
}

// 卡密详情对话框
const detailsVisible = ref(false)
const currentKey = ref({})

// 获取规格选项
const fetchSpecOptions = () => {
  // 模拟API调用
  setTimeout(() => {
    specOptions.value = [
      { id: 1, productName: '游戏点卡100元', name: '标准版' },
      { id: 2, productName: '游戏点卡100元', name: '优惠版' },
      { id: 3, productName: '视频会员月卡', name: '普通会员' },
      { id: 4, productName: '视频会员月卡', name: '高级会员' },
      { id: 5, productName: '音乐会员季卡', name: '基础版' }
    ]
  }, 300)
}

// 获取卡密列表
const fetchKeyList = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    const mockData = [
      {
        id: 1,
        key: 'LEAF-2023-ABCD-1234-EFGH',
        productName: '游戏点卡100元',
        specName: '标准版',

        status: 'unsold',
        validityPeriod: 365,
        createTime: '2023-11-20 10:30:00',
        usedTime: null,
        buyer: null,
        buyTime: null
      },
      {
        id: 2,
        key: 'LEAF-2023-IJKL-5678-MNOP',
        productName: '游戏点卡100元',
        specName: '标准版',

        status: 'sold',
        validityPeriod: 365,
        createTime: '2023-11-20 10:30:00',
        usedTime: null,
        buyer: 'user123',
        buyTime: '2023-11-21 14:25:00'
      },
      {
        id: 3,
        key: 'LEAF-2023-QRST-9012-UVWX',
        productName: '视频会员月卡',
        specName: '普通会员',

        status: 'used',
        validityPeriod: 30,
        createTime: '2023-11-19 09:15:00',
        usedTime: '2023-11-22 16:30:00',
        buyer: 'user456',
        buyTime: '2023-11-20 11:20:00'
      },
      {
        id: 4,
        key: 'LEAF-2023-YZAB-3456-CDEF',
        productName: '视频会员月卡',
        specName: '高级会员',

        status: 'expired',
        validityPeriod: 30,
        createTime: '2023-10-15 14:20:00',
        usedTime: '2023-10-18 10:15:00',
        buyer: 'user789',
        buyTime: '2023-10-16 09:30:00'
      },
      {
        id: 5,
        key: 'LEAF-2023-GHIJ-7890-KLMN',
        productName: '音乐会员季卡',
        specName: '基础版',

        status: 'unsold',
        validityPeriod: 90,
        createTime: '2023-11-18 16:45:00',
        usedTime: null,
        buyer: null,
        buyTime: null
      }
    ]
    
    // 应用搜索过滤
    let filteredData = mockData
    if (searchForm.key) {
      filteredData = filteredData.filter(item => 
        item.key.toLowerCase().includes(searchForm.key.toLowerCase())
      )
    }
    if (searchForm.specId) {
      filteredData = filteredData.filter(item => {
        const spec = specOptions.value.find(s => s.id === searchForm.specId)
        return spec && item.productName === spec.productName && item.specName === spec.name
      })
    }
    if (searchForm.status) {
      filteredData = filteredData.filter(item => item.status === searchForm.status)
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const [startDate, endDate] = searchForm.dateRange
      filteredData = filteredData.filter(item => {
        const createTime = item.createTime.split(' ')[0]
        return createTime >= startDate && createTime <= endDate
      })
    }
    
    // 更新总数
    pagination.total = filteredData.length
    
    // 应用分页
    const start = (pagination.currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    keyList.value = filteredData.slice(start, end)
    
    loading.value = false
  }, 500)
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchKeyList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.key = ''
  searchForm.specId = null
  searchForm.status = ''
  searchForm.dateRange = []
  pagination.currentPage = 1
  fetchKeyList()
}

// 分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchKeyList()
}

// 当前页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchKeyList()
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedKeys.value = selection
}

// 复制卡密
const copyKey = (key) => {
  // 创建一个临时的文本区域元素
  const textarea = document.createElement('textarea')
  textarea.value = key
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  
  ElMessage.success('卡密已复制到剪贴板')
}

// 验证卡密
const handleVerify = () => {
  verifyForm.key = ''
  verifyVisible.value = true
}

// 提交验证
const submitVerify = () => {
  verifyFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API调用
      setTimeout(() => {
        // 查找卡密
        const key = keyList.value.find(item => item.key === verifyForm.key)
        
        if (key) {
          let message = `卡密验证成功！\n`
          message += `商品：${key.productName} - ${key.specName}\n`
          message += `状态：${getStatusText(key.status)}\n`
          message += `有效期：${key.validityPeriod}天`
          
          if (key.status === 'unsold') {
            ElMessage.success(message)
          } else if (key.status === 'sold') {
            ElMessage.info(message)
          } else if (key.status === 'used') {
            ElMessage.warning(`卡密已被使用！\n使用时间：${key.usedTime}`)
          } else if (key.status === 'expired') {
            ElMessage.error('卡密已过期！')
          }
        } else {
          ElMessage.error('卡密不存在！')
        }
        
        verifyVisible.value = false
      }, 300)
    } else {
      ElMessage.error('请输入卡密')
      return false
    }
  })
}

// 批量导出
const handleBatchExport = () => {
  if (!selectedKeys.value.length) {
    ElMessage.warning('请选择要导出的卡密')
    return
  }
  
  ElMessageBox.confirm(
    `确定要导出选中的${selectedKeys.value.length}个卡密吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 模拟导出操作
    setTimeout(() => {
      ElMessage.success(`成功导出${selectedKeys.value.length}个卡密`)
      selectedKeys.value = []
    }, 300)
  }).catch(() => {
    ElMessage.info('已取消导出')
  })
}

// 查看详情
const viewDetails = (row) => {
  currentKey.value = { ...row }
  detailsVisible.value = true
}

// 删除卡密
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除卡密"${row.key}"吗？此操作不可恢复！`,
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
      fetchKeyList()
    }, 300)
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    'unsold': 'info',
    'sold': 'warning',
    'used': 'success',
    'expired': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'unsold': '未售出',
    'sold': '已售出',
    'used': '已使用',
    'expired': '已过期'
  }
  return textMap[status] || status
}

// 组件挂载时获取数据
onMounted(() => {
  fetchSpecOptions()
  fetchKeyList()
})
</script>

<style scoped>
.card-key-management {
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

.header-actions {
  display: flex;
  gap: 10px;
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