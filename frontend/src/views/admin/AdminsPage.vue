<template>
  <div class="admin-users">
    <el-card class="users-card">
      <template #header>
        <div class="card-header">
          <span>管理人员</span>
        </div>
      </template>

      <div class="users-content">
        <div class="search-bar">
          <el-row :gutter="16">
            <el-col :xs="24" :sm="8" :md="6" class="mb-10">
              <el-input v-model="searchQuery" placeholder="搜索邮箱" clearable @clear="handleSearch"
                @keyup.enter="handleSearch">
                <template #append>
                  <el-button @click="handleSearch">
                    <el-icon>
                      <Search />
                    </el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :xs="24" :sm="6" :md="4" class="mb-10">
              <el-select v-model="statusFilter" placeholder="管理员状态" clearable @change="handleSearch" style="width: 100%">
                <el-option label="全部" value="" />
                <el-option label="启用" value="active" />
                <el-option label="禁用" value="inactive" />
              </el-select>
            </el-col>
            <el-col :xs="24" :sm="10" :md="14" class="button-group">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="resetFilters">重置</el-button>
              <div class="flex-grow" v-if="!isMobile"></div>
              <el-button type="primary" @click="addUser">
                添加
              </el-button>
            </el-col>
          </el-row>
        </div>

        <div class="table-container">
          <el-table :data="filteredUsers" style="width: 100%" v-loading="loading">
            <el-table-column prop="username" label="管理员名" min-width="120" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="email" label="邮箱" min-width="200" align="center" :show-overflow-tooltip="true" />

            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="注册时间" width="180" align="center"
              :show-overflow-tooltip="true" />
            <el-table-column prop="lastLoginTime" label="最后上线时间" width="180" align="center"
              :show-overflow-tooltip="true" />
            <el-table-column label="操作" width="220" fixed="right" align="center">
              <template #default="scope">
                <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                <el-button size="small" type="info" @click="resetPassword(scope.row)">重置密码</el-button>
                <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="empty-container" style="padding: 40px 0;">
                <el-empty description="暂无管理人员数据" :image-size="120" />
              </div>
            </template>
          </el-table>
        </div>

        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper" :total="totalUsers" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </el-card>

    <el-dialog v-model="showAddUserDialog" :title="editingUser ? '编辑管理人员' : '添加管理人员'" :width="isMobile ? '90%' : '500px'">
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" :label-width="isMobile ? '60px' : '80px'">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editingUser">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddUserDialog = false">取消</el-button>
          <el-button type="primary" @click="saveUser">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '../../services/api'

const loading = ref(false)
const isMobile = ref(false)

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
  loadUsers()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

const users = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const showAddUserDialog = ref(false)
const editingUser = ref(null)
const userFormRef = ref(null)

const userForm = reactive({
  email: '',
  password: '',
  status: 'active'
})

const userRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择管理员状态', trigger: 'change' }
  ]
}

const filteredUsers = computed(() => {
  return users.value
})

const loadUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }

    if (searchQuery.value) {
      params.keyword = searchQuery.value
    }

    if (statusFilter.value) {
      params.status = statusFilter.value
    }

    const response = await api.admin.getUserList(params)

    if (response && response.data) {
      users.value = response.data.records || response.data.content || []
      totalUsers.value = response.data.total || response.data.totalElements || 0
    } else {
      users.value = []
      totalUsers.value = 0
    }
  } catch (error) {
    ElMessage.error('加载管理人员数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
  loadUsers()
}

const resetPassword = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置管理人员 "${user.email}" 的密码为"123456"吗？`,
      '确认重置密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await api.user.adminResetPassword({
      email: user.email,
      newPassword: '123456'
    })
    ElMessage.success(`密码重置成功，新密码为：123456`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('重置密码失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  loadUsers()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadUsers()
}

const editUser = (user) => {
  editingUser.value = user
  userForm.email = user.email
  userForm.status = user.status
  userForm.password = ''
  showAddUserDialog.value = true
}

const saveUser = async () => {
  if (!userFormRef.value) return

  try {
    await userFormRef.value.validate()

    const userData = {
      email: userForm.email,
      status: userForm.status
    }

    if (!editingUser.value && userForm.password) {
      userData.password = userForm.password
    }

    if (editingUser.value) {
      await api.user.updateUser(editingUser.value.id, userData)
    } else {
      await api.user.createUser(userData)
    }

    ElMessage.success(editingUser.value ? '管理人员更新成功' : '管理人员添加成功')
    showAddUserDialog.value = false
    editingUser.value = null
    resetUserForm()
    loadUsers()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存管理人员失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

const addUser = () => {
  editingUser.value = null
  resetUserForm()
  showAddUserDialog.value = true
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除管理人员 "${user.email}" 吗？此操作不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )

    await api.user.deleteUser(user.id)
    ElMessage.success('管理人员删除成功')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除管理人员失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

const resetUserForm = () => {
  Object.assign(userForm, {
    email: '',
    password: '',
    status: 'active'
  })
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.admin-users {
  padding: 0;
}

.search-bar {
  margin-bottom: 16px;
  padding: 20px;
}

.search-bar :deep(.button-group) {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.mb-10 {
  margin-bottom: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.flex-grow {
  flex-grow: 1;
}

.id-display {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding: 16px;
}
</style>
