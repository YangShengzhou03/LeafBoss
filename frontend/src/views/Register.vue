<template>
  <div class="register-container">
    <div class="register-form">
      <div class="register-header">
        <h2>注册 LeafCard</h2>
        <p>LeafCard - 枫叶卡后台管理系统</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form-content"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="nickname">
          <el-input
            v-model="registerForm.nickname"
            placeholder="昵称"
            size="large"
            :prefix-icon="UserFilled"
          />
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input
            v-model="registerForm.email"
            placeholder="邮箱"
            size="large"
            :prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            show-password
          />
          <div class="password-strength">
            <div 
              class="strength-bar"
              :class="checkPasswordStrength(registerForm.password)"
            ></div>
            <span class="strength-text">
              {{ getPasswordStrengthText(registerForm.password) }}
            </span>
          </div>
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleRegister"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="login-link">
          <span>已有账号？</span>
          <el-link type="primary" @click="goToLogin">立即登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Message, UserFilled } from '@element-plus/icons-vue'
import { safeAuthApi } from '@/services/auth'
import { Validator } from '@/utils/validate'

const router = useRouter()
const registerFormRef = ref<FormInstance>()
const loading = ref(false)

const registerForm = reactive({
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: ''
})



const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!Validator.username(value)) {
          callback(new Error('用户名格式不正确（4-20位字母、数字、下划线）'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!Validator.nickname(value)) {
          callback(new Error('昵称格式不正确（2-20位中英文、数字、下划线）'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!Validator.email(value)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
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
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    // 调用真实API注册
    const response = await safeAuthApi.register({
      username: registerForm.username,
      nickname: registerForm.nickname,
      email: registerForm.email,
      password: registerForm.password
    })
    
    if (response.success) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(response.message || '注册失败')
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    ElMessage.error(error.message || '注册失败，请检查网络连接')
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-form {
  width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.register-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.register-form-content {
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

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link span {
  margin-right: 8px;
}
</style>