<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :model="searchForm" inline>
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 表格区域 -->
      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="row.status ? 'danger' : 'success'" 
              @click="handleToggleStatus(row)"
            >
              {{ row.status ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserList',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const tableData = ref([])
    
    const searchForm = reactive({
      username: '',
      email: '',
      status: ''
    })
    
    const pagination = reactive({
      current: 1,
      size: 10,
      total: 0
    })
    
    const getRoleText = (role) => {
      const roleMap = {
        'admin': '管理员',
        'user': '普通用户',
        'guest': '访客'
      }
      return roleMap[role] || role
    }
    
    const getRoleType = (role) => {
      const typeMap = {
        'admin': 'danger',
        'user': 'primary',
        'guest': 'info'
      }
      return typeMap[role] || 'info'
    }
    
    const loadUserList = async () => {
      loading.value = true
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500))
        
        tableData.value = [
          {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            status: 1,
            createTime: '2023-01-01 10:00:00'
          },
          {
            id: 2,
            username: 'user1',
            email: 'user1@example.com',
            role: 'user',
            status: 1,
            createTime: '2023-01-02 14:30:00'
          },
          {
            id: 3,
            username: 'user2',
            email: 'user2@example.com',
            role: 'user',
            status: 0,
            createTime: '2023-01-03 09:15:00'
          }
        ]
        
        pagination.total = tableData.value.length
      } catch (error) {
        console.error('加载用户列表失败:', error)
        ElMessage.error('加载用户列表失败')
      } finally {
        loading.value = false
      }
    }
    
    const handleSearch = () => {
      pagination.current = 1
      loadUserList()
    }
    
    const handleReset = () => {
      Object.keys(searchForm).forEach(key => {
        searchForm[key] = ''
      })
      pagination.current = 1
      loadUserList()
    }
    
    const handleAdd = () => {
      router.push('/users/add')
    }
    
    const handleEdit = (row) => {
      router.push(`/users/edit/${row.id}`)
    }
    
    const handleToggleStatus = async (row) => {
      try {
        await ElMessageBox.confirm(
          `确定要${row.status ? '禁用' : '启用'}用户 "${row.username}" 吗？`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 模拟状态切换
        row.status = row.status ? 0 : 1
        ElMessage.success(`用户${row.status ? '启用' : '禁用'}成功`)
      } catch (error) {
        // 用户取消操作
      }
    }
    
    const handleSizeChange = (size) => {
      pagination.size = size
      pagination.current = 1
      loadUserList()
    }
    
    const handleCurrentChange = (current) => {
      pagination.current = current
      loadUserList()
    }
    
    onMounted(() => {
      loadUserList()
    })
    
    return {
      loading,
      tableData,
      searchForm,
      pagination,
      getRoleText,
      getRoleType,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleToggleStatus,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>