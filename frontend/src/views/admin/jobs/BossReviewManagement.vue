<template>
  <div class="admin-boss-review-management">
    <el-card class="review-card" shadow="never">

      <div class="search-bar">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="10" :md="8" class="mb-10">
            <el-input v-model="searchQuery" placeholder="搜索卡密/公司/评论内容" clearable @clear="handleSearch()"
              @keyup.enter="handleSearch()">
              <template #append>
                <el-button @click="handleSearch()">
                  <el-icon>
                    <Search />
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="14" :md="16" class="button-group">
            <el-button @click="resetFilters()">重置</el-button>
            <div class="flex-grow" v-if="!isMobile"></div>
            <el-button type="primary" @click="handleAddReview">新增评论</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="filteredReviews" v-loading="loading" style="width: 100%" :key="tableKey"
          :reserve-selection="false" :row-key="row => row.id || Math.random()">

          <el-table-column prop="cardKey" label="卡密" width="200" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
              <span>{{ maskCardKey(scope.row.cardKey) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="公司" min-width="150" align="left" :show-overflow-tooltip="true" />
          <el-table-column prop="content" label="评论内容" min-width="250" align="left" :show-overflow-tooltip="true" />
          <el-table-column prop="createdAt" label="评论时间" width="180" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
              {{ formatDateTime(scope.row.createdAt) || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="{ row }">
              <el-popconfirm
                title="确定删除该评论吗？"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handleDeleteReview(row)">
                <template #reference>
                  <el-button size="default" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>

          <template #empty>
            <div class="empty-container" style="padding: 40px 0;">
              <el-empty description="暂无评论数据" :image-size="120" />
            </div>
          </template>
        </el-table>
      </div>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <el-dialog v-model="showAddDialog" title="新增评论" :width="isMobile ? '90%' : '500px'">
      <el-form :model="reviewForm" :rules="reviewRules" ref="reviewFormRef" :label-width="isMobile ? '60px' : '80px'">
        <el-form-item label="卡密" prop="cardKey">
          <el-input v-model="reviewForm.cardKey" placeholder="请输入卡密" />
        </el-form-item>
        <el-form-item label="公司" prop="companyId">
          <el-select v-model="reviewForm.companyId" placeholder="请选择公司" style="width: 100%;">
            <el-option v-for="company in companies" :key="company.id" :label="company.name" :value="company.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input v-model="reviewForm.content" type="textarea" :rows="4" placeholder="请输入评论内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveReview">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '../../../services/api'
import { maskCardKey } from '@/utils/utils.js'

const loading = ref(false)
const isMobile = ref(false)

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
  loadReviews()
  loadCompanies()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

const reviews = ref([])
const companies = ref([])

const tableKey = ref(0)

const searchQuery = ref('')

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const showAddDialog = ref(false)

const reviewForm = reactive({
  cardKey: '',
  companyId: null,
  content: ''
})



const reviewRules = {
  cardKey: [{ required: true, message: '请输入卡密', trigger: 'blur' }],
  companyId: [{ required: true, message: '请选择公司', trigger: 'change' }],
  content: [{ required: true, message: '请输入评论内容', trigger: 'blur' }]
}

const filteredReviews = computed(() => {
  return reviews.value
})

const loadReviews = async () => {
  loading.value = true
  try {
    const response = await api.admin.getBossReviewList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchQuery.value
    })

    if (response && response.data) {
      reviews.value = response.data.records || response.data.content || []
      total.value = response.data.total || response.data.totalElements || 0
    } else {
      reviews.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('加载评论数据失败，请检查网络连接')
    reviews.value = []
    total.value = 0
  } finally {
    loading.value = false
    tableKey.value += 1
  }
}

const loadCompanies = async () => {
  try {
    const response = await api.admin.getCompanyList({ page: 1, size: 1000 })
    if (response && response.data) {
      companies.value = response.data.records || response.data.content || []
    }
  } catch (error) {
    ElMessage.error('加载公司数据失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadReviews()
}

const resetFilters = () => {
  searchQuery.value = ''
  handleSearch()
}

const handleAddReview = () => {
  showAddDialog.value = true
  resetForm()
}

const saveReview = async () => {
  try {
    const response = await api.admin.createBossReview(reviewForm)
    if (response && response.code === 200) {
      ElMessage.success('评论添加成功')
      showAddDialog.value = false
      loadReviews()
    } else {
      ElMessage.error(response?.message || '保存评论失败')
    }
  } catch (error) {
    ElMessage.error('保存评论失败，请检查网络连接')
  }
}

const resetForm = () => {
  Object.assign(reviewForm, {
    cardKey: '',
    companyId: null,
    content: ''
  })
}

const handleDeleteReview = async (row) => {
  const response = await api.admin.deleteBossReview(row.id)
  if (response && response.code === 200) {
    ElMessage.success('删除成功')
    loadReviews()
  } else {
    ElMessage.error('删除失败，请重试')
  }
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  try {
    const date = new Date(dateTime)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return dateTime
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadReviews()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadReviews()
}

</script>

<style scoped>
.admin-boss-review-management {
  padding: 0;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-feature-settings: "ss01";
}

.review-card {
  border-radius: 6px;
  border: 1px solid #e5edf5;
  box-shadow: rgba(23, 23, 23, 0.06) 0px 3px 6px;
}

.search-bar {
  margin-bottom: 0;
  padding: 20px;
  border-bottom: 1px solid #e5edf5;
}

.mb-10 {
  margin-bottom: 10px;
}

.flex-grow {
  flex-grow: 1;
}

.table-container {
  padding: 0;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 0;
  padding: 16px 20px;
  border-top: 1px solid #e5edf5;
}

.empty-container {
  padding: 40px 0;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
