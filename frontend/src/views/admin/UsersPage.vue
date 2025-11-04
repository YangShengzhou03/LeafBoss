
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
          <el-row :gutter="20">
            <el-col :span="8">
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
            <el-col :span="6">
              <el-select v-model="statusFilter" placeholder="用户状态" clearable @change="handleSearch">
                <el-option label="全部" value="" />
                <el-option label="使用中" value="active" />
                <el-option label="未使用" value="disabled" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="roleFilter" placeholder="用户角色" clearable @change="handleSearch">
                <el-option label="全部" value="" />
                <el-option label="普通用户" value="user" />
                <el-option label="管理员" value="admin" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button @click="resetFilters">重置</el-button>
                        <el-button type="primary" @click="showAddUserDialog = true">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 用户表格 -->
        <div class="table-container">
          <el-table :data="filteredUsers" style="width: 100%" v-loading="loading" :scroll="{ x: 1000 }">
            <el-table-column prop="id" label="ID" width="120" :show-overflow-tooltip="true">
              <template #default="scope">
                <span class="truncate-id">{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="200" :show-overflow-tooltip="true" />
            <el-table-column prop="gender" label="性别" width="80">
              <template #default="scope">
                {{ scope.row.gender === 'MALE' ? '男' : scope.row.gender === 'FEMALE' ? '女' : '未设置' }}
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="120" :show-overflow-tooltip="true" />
            <el-table-column prop="role" label="角色" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
                  {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="cardKeyCount" label="卡密数量" width="100">
              <template #default="scope">
                {{ scope.row.cardKeyCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="activatedCardKeys" label="已使用" width="80">
              <template #default="scope">
                {{ scope.row.activatedCardKeys || 0 }}
              </template>
            </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '使用中' : '未使用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastLoginTime" label="最后上线时间" width="160" :show-overflow-tooltip="true" />
            <el-table-column label="操作" width="200" fixed="right">
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
      <!-- 用户头像显示区域 -->
      <div v-if="editingUser" class="avatar-section">
        <div class="avatar-display">
          <el-avatar 
            v-if="editingUser.avatar" 
            :size="80" 
            :src="editingUser.avatar" 
            fit="cover"
          />
          <el-avatar 
            v-else 
            :size="80" 
            :style="{ backgroundColor: '#409EFF' }"
          >
            {{ '默认头像' }}
          </el-avatar>
        </div>
      </div>
      
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editingUser">
          <el-input v-model="userForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userForm.gender" style="width: 100%">
            <el-option label="男" value="MALE" />
            <el-option label="女" value="FEMALE" />
            <el-option label="未设置" value="NOT_SET" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
              <el-radio label="active">使用中</el-radio>
              <el-radio label="disabled">未使用</el-radio>
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
import { Plus, Search } from '@element-plus/icons-vue'
import { AdminService } from '@/services/api.js'

// 数据状态
const loading = ref(false)
const users = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const totalUsers = ref(0)
const showAddUserDialog = ref(false)
const editingUser = ref(null)
const userFormRef = ref(null)

// 用户表单数据
const userForm = reactive({
  email: '',
  password: '',
  gender: 'NOT_SET',
  phone: '',
  role: 'user',
  status: 'active',
  storageQuota: 1 // 默认1GB，单位GB
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
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择用户状态', trigger: 'change' }
  ],
  storageQuota: [
    { required: true, message: '请设置存储配额', trigger: 'blur' }
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
  
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
  }
  
  return result
})

// 格式化存储大小
const formatStorage = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 计算存储使用率
const calculateUsagePercentage = (used, quota) => {
  if (!quota || quota === 0) return 0
  return Math.round((used / quota) * 100)
}

// 加载用户数据
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await AdminService.getUserList({
      page: currentPage.value - 1,
      size: pageSize.value,
      keyword: searchQuery.value,
      status: statusFilter.value,
      role: roleFilter.value
    })
    users.value = response.content
    totalUsers.value = response.totalElements
  } catch (error) {
    // 错误已由AdminService处理，这里不需要额外处理
    console.error('加载用户数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadUsers()
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  roleFilter.value = ''
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
    
    await AdminService.resetUserPassword(user.id, '123456')
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
  userForm.gender = user.gender
  userForm.phone = user.phone
  userForm.role = user.role
  userForm.status = user.status
  // 将字节转换为GB显示
  userForm.storageQuota = Math.round(user.storageQuota / (1024 * 1024 * 1024))
  userForm.password = '' // 编辑时不显示密码
  showAddUserDialog.value = true
}

// 保存用户
const saveUser = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    
    // 将GB转换为字节
    const storageQuotaInBytes = userForm.storageQuota * 1024 * 1024 * 1024
    
    // 调用后端API保存用户数据
    const userData = {
      email: userForm.email,
      password: userForm.password,
      gender: userForm.gender === 'MALE' ? 1 : userForm.gender === 'FEMALE' ? 2 : 0,
      phone: userForm.phone,
      role: userForm.role === 'admin' ? 1 : 0,
      status: userForm.status === 'active' ? 1 : 0,
      storageQuota: storageQuotaInBytes
    }
    
    if (editingUser.value) {
      // 更新用户
      await Server.put(`/admin/user/${editingUser.value.id}`, userData)
    } else {
      // 添加用户 - 使用管理员创建用户接口
      const newUser = {
        email: userForm.email,
        password: userForm.password,
        nickname: userForm.email.split('@')[0], // 默认昵称
        gender: userForm.gender === 'MALE' ? 1 : userForm.gender === 'FEMALE' ? 2 : 0,
        phone: userForm.phone,
        role: userForm.role === 'admin' ? 1 : 0,
        status: userForm.status === 'active' ? 1 : 0,
        storageQuota: storageQuotaInBytes
      }
      // 使用管理员创建用户接口
      await Server.post('/admin/user', newUser)
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
    await Server.put(`/admin/user/${user.id}/status?enabled=${enabled}`)
    ElMessage.success(`用户已${newStatus === 'active' ? '启用' : '禁用'}`)
    loadUsers()
  } catch (error) {
    ElMessage.error('切换用户状态失败: ' + (error.response?.data?.message || error.message))
  }
}

// 删除用户
const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.email}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await Server.delete(`/admin/user/${user.id}`)
    ElMessage.success('用户删除成功')
    loadUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除用户失败: ' + (error.response?.data?.message || error.message))
    }
  }
}

// 获取使用率颜色类
const getUsageClass = (used, quota) => {
  const percentage = calculateUsagePercentage(used, quota)
  if (percentage >= 90) return 'usage-high'
  if (percentage >= 70) return 'usage-medium'
  return 'usage-low'
}

// 重置用户表单
const resetUserForm = () => {
  Object.assign(userForm, {
    email: '',
    password: '',
    gender: 'NOT_SET',
    phone: '',
    role: 'user',
    status: 'active',
    storageQuota: 1 // 默认1GB，单位GB
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
  padding: 16px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
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
  margin-top: 16px;
  padding: 16px;
  background-color: #fafafa;
  border-top: 1px solid #e6e8eb;
}

/* 表格样式优化 */
:deep(.el-table) {
  min-width: 1200px;
}

:deep(.el-table__header) {
  background-color: #fafafa;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #606266;
  font-weight: 500;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}

/* 使用率颜色样式 */
.usage-high {
  color: #f56c6c;
  font-weight: bold;
}

.usage-medium {
  color: #e6a23c;
  font-weight: bold;
}

.usage-low {
  color: #67c23a;
  font-weight: bold;
}

/* 头像显示区域样式 */
.avatar-section {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.avatar-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
  font-size: 14px;
}

.avatar-display {
  margin-bottom: 8px;
}

.avatar-info {
  font-size: 12px;
  color: #6c757d;
}

/* 对话框样式调整 */
:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>