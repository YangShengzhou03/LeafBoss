<template>
  <div class="admin-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人资料</span>
          <el-button type="primary" @click="editProfile">
            <el-icon><Edit /></el-icon>
            修改资料
          </el-button>
        </div>
      </template>

      <div class="profile-content">
        <!-- 用户信息展示 -->
        <div class="user-info-display">
          <div class="avatar-section">
            <el-avatar :size="100" :src="userInfo.avatar" class="user-avatar">
              {{ userInfo.nickname ? userInfo.nickname.charAt(0) : 'U' }}
            </el-avatar>
          </div>
          
          <div class="info-section">
            <h2 class="user-name">{{ userInfo.nickname || '未设置昵称' }}</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">邮箱：</span>
                <span class="info-value">{{ userInfo.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">注册时间：</span>
                <span class="info-value">{{ formatDate(userInfo.createTime) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">账户状态：</span>
                <el-tag type="success">正常</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 修改资料对话框 -->
    <el-dialog 
      v-model="profileDialogVisible" 
      title="修改资料" 
      width="500px"
    >
      <el-form 
        :model="profileForm" 
        :rules="profileRules" 
        ref="profileFormRef" 
        label-width="80px"
      >
        <el-form-item label="头像" prop="avatar">
          <div class="avatar-upload">
            <el-avatar :size="80" :src="profileForm.avatar" class="preview-avatar">
              {{ profileForm.nickname ? profileForm.nickname.charAt(0) : 'U' }}
            </el-avatar>
            <el-button type="primary" @click="changeAvatar" style="margin-left: 16px;">
              <el-icon><Camera /></el-icon>
              更换头像
            </el-button>
            <input 
              ref="avatarInput" 
              type="file" 
              accept="image/*" 
              style="display: none" 
              @change="handleAvatarChange"
            />
          </div>
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input 
            v-model="profileForm.nickname" 
            placeholder="请输入昵称" 
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="profileForm.email" 
            placeholder="请输入邮箱" 
            type="email"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="profileForm.password" 
            type="password" 
            placeholder="请输入新密码（留空则不修改）"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="profileDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile" :loading="saving">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera, Edit } from '@element-plus/icons-vue'
import api from '../../services/api'

// 表单引用
const profileFormRef = ref()
const avatarInput = ref()

// 对话框状态
const profileDialogVisible = ref(false)
const saving = ref(false)

// 用户信息
const userInfo = ref({
  id: '',
  nickname: '',
  email: '',
  avatar: '',
  createTime: ''
})

// 个人资料表单
const profileForm = reactive({
  avatar: '',
  nickname: '',
  email: '',
  password: ''
})

// 验证规则
const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}



// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    // 调用API获取用户信息
    const response = await api.user.getUserInfo()
    
    if (response && response.code === 200 && response.data) {
      userInfo.value = response.data
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('加载用户信息失败，请检查网络连接')
  }
}

// 打开修改资料对话框
const editProfile = () => {
  Object.assign(profileForm, userInfo.value)
  profileDialogVisible.value = true
}

// 保存个人资料
const saveProfile = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    saving.value = true
    
    // 准备提交的数据
    const submitData = {
      nickname: profileForm.nickname,
      email: profileForm.email
    }
    
    // 如果有新密码，添加到提交数据
    if (profileForm.password) {
      submitData.password = profileForm.password
    }
    
    // 调用API保存个人资料
    const response = await api.user.updateUserInfo(submitData)
    
    if (response && response.code === 200) {
      // 更新用户信息
      userInfo.value = { ...userInfo.value, ...profileForm }
      profileDialogVisible.value = false
      ElMessage.success('个人资料保存成功')
    } else {
      ElMessage.error('保存失败，请重试')
    }
  } catch (error) {
    console.error('保存个人资料失败:', error)
    if (error.errors) {
      ElMessage.warning('请检查表单填写是否正确')
    } else {
      ElMessage.error('保存失败，请检查网络连接')
    }
  } finally {
    saving.value = false
  }
}

// 更换头像
const changeAvatar = () => {
  avatarInput.value?.click()
}

// 处理头像更改
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  
  // 检查文件大小（限制为2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过2MB')
    return
  }
  
  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.avatar = e.target.result
    ElMessage.success('头像更换成功')
  }
  reader.readAsDataURL(file)
  
  // 重置文件输入
  event.target.value = ''
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.admin-profile {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-card {
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
}

.profile-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 20px;
  color: white;
}

.card-header .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.card-header .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.profile-card :deep(.el-card__body) {
  padding: 32px;
  background: white;
}

.profile-content {
  width: 100%;
}

.user-info-display {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar {
  border: 4px solid #f0f2f5;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.info-section {
  flex: 1;
}

.user-name {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.info-label {
  font-weight: 600;
  color: #4b5563;
  min-width: 80px;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
}

.preview-avatar {
  border: 3px solid #e5e7eb;
  transition: all 0.3s ease;
}

.preview-avatar:hover {
  border-color: #667eea;
}

.avatar-upload .el-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.avatar-upload .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.el-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0;
  padding: 20px 24px;
}

.el-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.el-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.el-dialog :deep(.el-dialog__footer) {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.dialog-footer .el-button {
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dialog-footer .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.dialog-footer .el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .admin-profile {
    padding: 16px;
  }
  
  .user-info-display {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .avatar-upload {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .profile-card :deep(.el-card__body) {
    padding: 20px 16px;
  }
  
  .user-name {
    font-size: 24px;
  }
  
  .info-item {
    padding: 12px;
  }
}
</style>