
<template>
  <div class="admin-users">
    <el-card class="users-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>

      <div class="users-content">
        <!-- 搜索和筛选 -->
        <div class="search-bar">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-input
                v-model="searchQuery"
                placeholder="搜索邮箱"
                clearable
                @clear="handleSearch"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button @click="handleSearch">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-select v-model="statusFilter" placeholder="用户状态" clearable @change="handleSearch">
                <el-option label="全部" value="" />
                <el-option label="正常" value="active" />
                <el-option label="禁用" value="disabled" />
              </el-select>
            </el-col>
            <el-col :span="14" class="button-group">
              <el-button type="primary" @click="showAddUserDialog = true">
                添加用户
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 用户表格 -->
        <div class="table-container">
          <el-table 
            :data="filteredUsers" 
            style="width: 100%" 
            v-loading="loading" 
            :scroll="{ x: 1200 }"
            :header-cell-style="{ textAlign: 'center', background: '#f5f7fa' }"
            :cell-style="{ textAlign: 'center' }"
            stripe
          >
            <el-table-column prop="id" label="ID" width="120" align="center" :show-overflow-tooltip="true">
              <template #default="scope">
                <span class="truncate-id">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" min-width="150" align="center" :show-overflow-tooltip="true">
              <template #default="scope">
                {{ scope.row.username || scope.row.email.split('@')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="200" align="left" :show-overflow-tooltip="true" class-name="email-column" />
            <el-table-column prop="cardKeyCount" label="卡密数量" width="120" align="center">
              <template #default="scope">
                {{ scope.row.cardKeyCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="activatedCardKeys" label="已使用" width="100" align="center">
              <template #default="scope">
                {{ scope.row.activatedCardKeys || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '正常' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastLoginTime" label="最后上线时间" width="180" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="操作" width="220" fixed="right" align="center">
              <template #default="scope">
                <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                <el-button 
                  size="small" 
                  :type="scope.row.status === 'active' ? 'warning' : 'success'"
                  @click="toggleUserStatus(scope.row)"
                >
                  {{ scope.row.status === 'active' ? '停用' : '启用' }}
                </el-button>
                <el-button size="small" type="info" @click="resetPassword(scope.row)">重置密码</el-button>
              </template>
            </el-table-column>
            
            <!-- 空状态 -->
            <template #empty>
              <div class="empty-container" style="padding: 40px 0;">
                <el-empty description="暂无用户数据" :image-size="120" />
              </div>
            </template>
          </el-table>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalUsers"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="showAddUserDialog"
      :title="editingUser ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editingUser">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
              <el-radio label="active">正常</el-radio>
              <el-radio label="disabled">禁用</el-radio>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import api from '../../services/api'

// 数据状态
const loading = ref(false)
const users = ref([])
// 搜索条件
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const showAddUserDialog = ref(false)
const editingUser = ref(null)
const userFormRef = ref(null)

// 用户表单数据
const userForm = reactive({
  email: '',
  password: '',
  status: 'active'
})

// 表单验证规则
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
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ]
}

// 过滤后的用户列表
const filteredUsers = computed(() => {
  let result = users.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.email.toLowerCase().includes(query)
    )
  }
  
  if (statusFilter.value) {
    result = result.filter(user => user.status === statusFilter.value)
  }
  
  return result
})

// 加载用户数据
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await api.admin.getUserList({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchQuery.value,
      status: statusFilter.value
    })
    if (response && response.data) {
      users.value = response.data.records || response.data.content || []
      totalUsers.value = response.data.total || response.data.totalElements || 0
    } else {
      users.value = []
      totalUsers.value = 0
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
    ElMessage.error('加载用户数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

// 重置密码
const resetPassword = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户 "${user.email}" 的密码为"123456"吗？`,
      '确认重置密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 使用用户API重置密码
    await api.user.changePassword({ 
      userId: user.id, 
      newPassword: '123456' 
    })
    ElMessage.success(`密码重置成功，新密码为：123456`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('重置密码失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  loadUsers()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadUsers()
}

// 编辑用户
const editUser = (user) => {
  editingUser.value = user
  userForm.email = user.email
  userForm.status = user.status
  userForm.password = '' // 编辑时不显示密码
  showAddUserDialog.value = true
}

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    
    // 调用后端API保存用户数据
    const userData = {
      email: userForm.email,
      password: userForm.password,
      status: userForm.status === 'active' ? 1 : 0
    }
    
    if (editingUser.value) {
      // 更新用户
      await api.user.updateUserInfo(userData)
    } else {
      // 添加用户 - 使用用户注册接口
      await api.user.register(userData)
    }
    
    ElMessage.success(editingUser.value ? '用户更新成功' : '用户添加成功')
    showAddUserDialog.value = false
    editingUser.value = null
    resetUserForm()
    loadUsers()
  } catch (error) {
    if (error !== false) { // 不是表单验证错误
      ElMessage.error('保存用户失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

// 切换用户状态
const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === 'active' ? 'disabled' : 'active'
    const enabled = newStatus === 'active'
    
    // 更新用户状态
    await api.user.updateUserInfo({
      status: enabled ? 1 : 0
    })
    
    ElMessage.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`)
    loadUsers()
  } catch (error) {
    ElMessage.error('切换用户状态失败: ' + (error.response?.data?.message || error.message))
  }
}

// 重置用户表单
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
  background-color: #f0f2f5;
}

.users-card {
  margin-bottom: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.users-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.users-card :deep(.el-card__body) {
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
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-bar:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  transition: all 0.2s ease;
}

.search-bar :deep(.button-group .el-button:hover) {
  transform: translateY(-1px);
}

.table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.table-container :deep(.el-table) {
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.table-container :deep(.el-table__header-wrapper) {
  background-color: #f5f7fa;
}

.table-container :deep(.el-table th) {
  background-color: #f5f7fa !important;
  color: #606266;
  font-weight: 600;
  padding: 12px 0;
}

.table-container :deep(.el-table td) {
  padding: 12px 0;
  transition: background-color 0.2s ease;
}

.table-container :deep(.el-table tr:hover td) {
  background-color: #f8f9fa;
}

.table-container :deep(.el-table .cell) {
  padding: 0 12px;
  word-break: break-word;
}

.table-container :deep(.el-button) {
  transition: all 0.2s ease;
}

.table-container :deep(.el-button:hover) {
  transform: translateY(-1px);
}

.truncate-id {
  display: inline-block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e6e8eb;
}

.empty-container {
  padding: 40px 0;
  transition: all 0.3s ease;
}

/* 表格样式优化 */
:deep(.el-table) {
  min-width: 100%;
  font-size: 14px;
}

:deep(.el-table__header) {
  background-color: #f8f9fa;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

:deep(.el-table td) {
  border-bottom: 1px solid #e9ecef;
  padding: 12px 8px;
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

:deep(.el-table .cell) {
  white-space: nowrap;
  line-height: 1.4;
}

:deep(.el-table .el-table__row:hover) {
  background-color: #f8f9fa;
}

/* 邮箱列特殊样式 */
:deep(.el-table .email-column .cell) {
  text-align: left;
  padding-left: 12px;
}

/* 操作按钮样式 */
:deep(.el-table .el-button) {
  margin: 2px;
}

/* 对话框样式调整 */
:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>