<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <h2>枫叶卡管</h2>
        <p>Leaf Card - 智能卡管理系统</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form-content"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-link type="primary" @click="handleForgotPassword">忘记密码？</el-link>
        </div>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="register-link">
          <span>还没有账号？</span>
          <el-link type="primary" @click="goToRegister">立即注册</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores'
import { safeAuthApi } from '@/services/auth'
import { Validator } from '@/utils/validate'
import { AppStorage } from '@/utils/storage'

const router = useRouter()
const appStore = useAppStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

// 记住我功能：从本地存储恢复用户名
onMounted(() => {
  const rememberedUsername = AppStorage.getUserInfo()?.username
  if (rememberedUsername) {
    loginForm.username = rememberedUsername
    rememberMe.value = true
  }
})

const loginRules: FormRules = {
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
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 调用真实API登录
    const response = await safeAuthApi.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    if (response.success && response.data) {
      const { token, user } = response.data
      
      // 存储token和用户信息
      appStore.setToken(token)
      appStore.setUserInfo(user)
      
      // 记住我功能
      if (rememberMe.value) {
        AppStorage.setUserInfo({ username: user.username })
      } else {
        AppStorage.removeUserInfo()
      }
      
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } else {
      ElMessage.error(response.message || '登录失败')
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

// 忘记密码功能
const handleForgotPassword = () => {
  ElMessage.info('请联系管理员重置密码')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .el-checkbox {
      color: #666;
    }
    
    .el-link {
      font-size: 14px;
    }
  }
  
  .register-link {
    text-align: center;
    margin-top: 20px;
    color: #666;
    
    .el-link {
      margin-left: 5px;
    }
  }
}</style>