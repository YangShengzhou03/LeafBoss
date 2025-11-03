<template>
  <div class="forgot-password-container">
    <div class="forgot-password-form">
      <div class="forgot-password-header">
        <h2>忘记密码</h2>
        <p>请输入您的邮箱地址，我们将发送重置密码的链接</p>
      </div>
      
      <div class="forgot-password-content">
        <el-form
          ref="forgotPasswordFormRef"
          :model="forgotPasswordForm"
          :rules="forgotPasswordRules"
          label-width="0"
        >
          <el-form-item prop="email">
            <el-input
              v-model="forgotPasswordForm.email"
              placeholder="请输入邮箱地址"
              size="large"
              :prefix-icon="Message"
              @keyup.enter="handleSendResetLink"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              :loading="loading"
              @click="handleSendResetLink"
            >
              发送重置链接
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Message } from '@element-plus/icons-vue'
import { safeAuthApi } from '@/services/auth'
import { Validator } from '@/utils/validate'

const router = useRouter()
const forgotPasswordFormRef = ref<FormInstance>()
const loading = ref(false)

const forgotPasswordForm = reactive({
  email: ''
})

const forgotPasswordRules: FormRules = {
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
  ]
}

const handleSendResetLink = async () => {
  if (!forgotPasswordFormRef.value) return

  try {
    await forgotPasswordFormRef.value.validate()
    loading.value = true
    
    // 调用忘记密码API
    const response = await safeAuthApi.forgotPassword({
      email: forgotPasswordForm.email
    })
    
    if (response.success) {
      ElMessage.success('重置链接已发送到您的邮箱，请查收')
      // 可以跳转到提示页面或返回登录页
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      ElMessage.error(response.message || '发送重置链接失败')
    }
  } catch (error: any) {
    console.error('发送重置链接失败:', error)
    ElMessage.error(error.message || '发送重置链接失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.forgot-password-form {
  width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 40px;
}

.forgot-password-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.forgot-password-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.forgot-password-content {
  margin-top: 20px;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
  color: #666;
}
</style>