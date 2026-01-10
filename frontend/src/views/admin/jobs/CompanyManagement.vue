<template>
  <div class="admin-company-management">
    <el-card class="company-card">
      <template #header>
        <div class="card-header">
          <span>公司管理</span>
        </div>
      </template>

      <div class="search-bar">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="searchQuery" placeholder="公司名称" clearable @clear="handleSearch()"
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
          <el-col :span="18" class="button-group">
            <el-button type="primary" @click="handleSearch()">查询</el-button>
            <el-button @click="resetFilters()">重置</el-button>
            <div style="flex: 1;"></div>
            <el-button type="primary" @click="handleAddCompany">新增公司</el-button>
          </el-col>
        </el-row>
      </div>

      <div class="table-container">
        <el-table :data="filteredCompanies" v-loading="loading" stripe style="width: 100%" :key="tableKey"
          :reserve-selection="false" :row-key="row => row.id || Math.random()">
          <el-table-column prop="id" label="ID" width="80" align="center" show-overflow-tooltip />
          <el-table-column prop="name" label="公司名称" min-width="200" align="left" :show-overflow-tooltip="true" />
          <el-table-column prop="commentCount" label="评论数" width="100" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
              {{ scope.row.commentCount || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
              {{ formatDateTime(scope.row.createdAt) || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEditCompany(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteCompany(row)">删除</el-button>
            </template>
          </el-table-column>

          <template #empty>
            <div class="empty-container" style="padding: 40px 0;">
              <el-empty description="暂无公司数据" :image-size="120" />
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

    <el-dialog v-model="showAddDialog" :title="editingCompany ? '编辑公司' : '添加公司'" width="500px">
      <el-form :model="companyForm" :rules="companyRules" ref="companyFormRef" label-width="80px">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="companyForm.name" placeholder="请输入公司名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="saveCompany">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '../../../services/api'

const loading = ref(false)

const companies = ref([])

const tableKey = ref(0)

const searchQuery = ref('')

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const showAddDialog = ref(false)
const editingCompany = ref(null)

const companyForm = reactive({
  name: ''
})

const companyRules = {
  name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
}

const filteredCompanies = computed(() => {
  return companies.value
})

const loadCompanies = async () => {
  loading.value = true
  try {
    const response = await api.admin.getCompanyList({
      page: currentPage.value,
      size: pageSize.value,
      name: searchQuery.value
    })

    if (response && response.data) {
      companies.value = response.data.records || response.data.content || []
      total.value = response.data.total || response.data.totalElements || 0
    } else {
      companies.value = []
      total.value = 0
    }
  } catch (error) {
    ElMessage.error('加载公司数据失败，请检查网络连接')
    companies.value = []
    total.value = 0
  } finally {
    loading.value = false
    tableKey.value += 1
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadCompanies()
}

const resetFilters = () => {
  searchQuery.value = ''
  handleSearch()
}

const handleAddCompany = () => {
  showAddDialog.value = true
  editingCompany.value = null
  resetForm()
}

const handleEditCompany = (row) => {
  editingCompany.value = row
  Object.assign(companyForm, row)
  showAddDialog.value = true
}

const saveCompany = async () => {
  try {
    if (editingCompany.value) {
      const response = await api.admin.editCompany(companyForm.id, companyForm);
      if (response && response.code === 200) {
        ElMessage.success('公司更新成功');
        showAddDialog.value = false;
        loadCompanies();
      } else {
        ElMessage.error(response?.message || '保存公司失败');
      }
    } else {
      const response = await api.admin.createCompany(companyForm);
      if (response && response.code === 200) {
        ElMessage.success('公司添加成功');
        showAddDialog.value = false;
        loadCompanies();
      } else {
        ElMessage.error(response?.message || '保存公司失败');
      }
    }
  } catch (error) {
    ElMessage.error('保存公司失败，请检查网络连接');
  }
}

const resetForm = () => {
  editingCompany.value = null
  Object.assign(companyForm, {
    name: ''
  })
}

const handleDeleteCompany = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除公司"${row.name}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await api.admin.deleteCompany(row.id)
    if (response && response.code === 200) {
      ElMessage.success('删除成功')
      loadCompanies()
    } else {
      ElMessage.error('删除失败，请重试')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败，请检查网络连接')
    }
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
  loadCompanies()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadCompanies()
}

onMounted(() => {
  loadCompanies()
})
</script>

<style scoped>
.admin-company-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  color: #303133;
}

.search-bar {
  margin-bottom: 16px;
  padding: 20px;
}

.search-bar :deep(.el-col) {
  display: flex;
  align-items: center;
}

.search-bar :deep(.el-input) {
  flex: 1;
}

.search-bar :deep(.button-group) {
  justify-content: flex-end;
}

.search-bar :deep(.button-group .el-button) {
  margin-left: 8px;
}

.table-container {
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding: 16px;
}

.empty-container {
  padding: 40px 0;
}
</style>
