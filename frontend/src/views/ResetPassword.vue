<template>
  <div class="reset-password-container">
    <div class="reset-password-form">
      <div class="reset-password-header">
        <h2>重置密码</h2>
        <p>请输入您的新密码</p>
      </div>
      
      <div class="reset-password-content">
        <el-form
          ref="resetPasswordFormRef"
          :model="resetPasswordForm"
          :rules="resetPasswordRules"
          label-width="0"
        >
          <el-form-item prop="password">
            <el-input
              v-model="resetPasswordForm.password"
              type="password"
              placeholder="新密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
            <div class="password-strength">
              <div 
                class="strength-bar"
                :class="checkPasswordStrength(resetPasswordForm.password)"
              ></div>
              <span class="strength-text">
                {{ getPasswordStrengthText(resetPasswordForm.password) }}
              </span>
            </div>
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="resetPasswordForm.confirmPassword"
              type="password"
              placeholder="确认新密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleResetPassword"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleResetPassword"
            >
              重置密码
            </el-button>
          </el-form-item>
          
          <div class="back-to-login">
            <el-link type="primary" @click="goToLogin">返回登录</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import { safeAuthApi } from '@/services/auth'
import { Validator } from '@/utils/validate'

const router = useRouter()
const route = useRoute()
const resetPasswordFormRef = ref<FormInstance>()
const loading = ref(false)

const resetPasswordForm = reactive({
  password: '',
  confirmPassword: ''
})

const resetPasswordRules: FormRules = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!Validator.password(value)) {
          callback(new Error('密码格式不正确（6-20位，包含字母和数字）'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetPasswordForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  // 检查是否有重置token
  const token = route.query.token as string
  if (!token) {
    ElMessage.error('重置链接无效')
    router.push('/forgot-password')
  }
})

const handleResetPassword = async () => {
  if (!resetPasswordFormRef.value) return

  try {
    await resetPasswordFormRef.value.validate()
    loading.value = true
    
    const token = route.query.token as string
    
    // 调用重置密码API
    const response = await safeAuthApi.resetPassword({
      token,
      newPassword: resetPasswordForm.password
    })
    
    if (response.success) {
      ElMessage.success('密码重置成功，请重新登录')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      ElMessage.error(response.message || '密码重置失败')
    }
  } catch (error: any) {
    console.error('密码重置失败:', error)
    ElMessage.error(error.message || '密码重置失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

// 密码强度检查
const checkPasswordStrength = (password: string) => {
  if (!password) return ''
  
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  if (password.length >= 8 && hasLetter && hasNumber && hasSpecial) {
    return 'strong'
  } else if (password.length >= 6 && hasLetter && hasNumber) {
    return 'medium'
  } else {
    return 'weak'
  }
}

// 获取密码强度文本
const getPasswordStrengthText = (password: string) => {
  if (!password) return ''
  
  const strength = checkPasswordStrength(password)
  switch (strength) {
    case 'strong':
      return '密码强度：强'
    case 'medium':
      return '密码强度：中'
    case 'weak':
      return '密码强度：弱'
    default:
      return ''
  }
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.reset-password-form {
  width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.reset-password-header {
  text-align: center;
  margin-bottom: 40px;
}

.reset-password-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.reset-password-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.reset-password-content {
  margin-top: 20px;
}

.password-strength {
  margin-top: 8px;
  
  .strength-bar {
    height: 4px;
    border-radius: 2px;
    margin-bottom: 4px;
    transition: all 0.3s;
    
    &.weak {
      width: 33%;
      background-color: #f56c6c;
    }
    
    &.medium {
      width: 66%;
      background-color: #e6a23c;
    }
    
    &.strong {
      width: 100%;
      background-color: #67c23a;
    }
  }
  
  .strength-text {
    font-size: 12px;
    color: #909399;
  }
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
</style>