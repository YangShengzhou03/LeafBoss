<template>
  <div class="users-container">
    <!-- 搜索和筛选 -->
    <div class="card-header">
      <span>用户管理</span>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加用户
      </el-button>
    </div>

    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名或邮箱"
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterRole" placeholder="用户角色" clearable style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" placeholder="用户状态" clearable style="width: 100%">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-col>
        <el-col :span="10" style="text-align: right">
          <el-button type="success" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 用户表格 -->
    <div class="table-container">
      <el-table :data="paginatedUsers" v-loading="loading">
        <el-table-column prop="id" label="用户ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="toggleUserStatus(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
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
    </div>

    <!-- 添加/编辑用户弹窗 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="isEditing ? '编辑用户' : '添加用户'" 
      width="500px"
    >
      <el-form :model="currentUser" label-width="80px" :rules="formRules" ref="userForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentUser.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEditing">
          <el-input 
            v-model="currentUser.password" 
            type="password" 
            placeholder="请输入密码" 
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="currentUser.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="currentUser.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchKeyword = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)
const showAddDialog = ref(false)
const isEditing = ref(false)
const userForm = ref(null)

const currentUser = ref({
  id: '',
  username: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active'
})

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 模拟用户数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@leafcard.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30:00',
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'user001',
    email: 'user001@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-15 13:15:00',
    createdAt: '2024-01-10 09:30:00'
  },
  {
    id: 3,
    username: 'user002',
    email: 'user002@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-14 16:45:00',
    createdAt: '2024-01-12 14:20:00'
  }
])

const filteredUsers = computed(() => {
  const keyword = searchKeyword.value.toLowerCase()
  const role = filterRole.value
  const status = filterStatus.value
  
  // 如果没有任何筛选条件，直接返回原始数据避免不必要的计算
  if (!keyword && !role && !status) {
    return users.value
  }
  
  return users.value.filter(user => {
    const matchesKeyword = !keyword || 
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    const matchesRole = !role || user.role === role
    const matchesStatus = !status || user.status === status
    return matchesKeyword && matchesRole && matchesStatus
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const editUser = (user) => {
  isEditing.value = true
  currentUser.value = { ...user }
  showAddDialog.value = true
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定删除用户 "${user.username}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value.splice(index, 1)
      ElMessage.success('用户删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const toggleUserStatus = (user) => {
  ElMessage.success(`用户 ${user.username} 状态已${user.status === 'active' ? '启用' : '禁用'}`)
}

const saveUser = async () => {
  try {
    await userForm.value.validate()
    
    if (isEditing.value) {
      // 编辑用户
      const index = users.value.findIndex(u => u.id === currentUser.value.id)
      if (index !== -1) {
        users.value[index] = { ...currentUser.value }
      }
      ElMessage.success('用户信息更新成功')
    } else {
      // 添加用户
      const newUser = {
        ...currentUser.value,
        id: Math.max(...users.value.map(u => u.id)) + 1,
        lastLogin: '从未登录',
        createdAt: new Date().toLocaleString('zh-CN')
      }
      users.value.push(newUser)
      ElMessage.success('用户添加成功')
    }
    
    showAddDialog.value = false
    resetForm()
  } catch (error) {
    // 表单验证失败
  }
}

const resetForm = () => {
  currentUser.value = {
    id: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  }
  isEditing.value = false
}

onMounted(() => {
  // 页面加载时的初始化操作
})
</script>

<style scoped>
.users-container {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.filter-container {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.table-container {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.pagination-container {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table__header) {
  background-color: #f8f9fa;
}

:deep(.el-table__header th) {
  font-weight: 500;
  color: #606266;
}

/* 对话框样式优化 */
:deep(.el-dialog) {
  border-radius: 4px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

/* 表单样式优化 */
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  border-radius: 4px;
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-container > * {
    width: 100%;
  }
}
</style>