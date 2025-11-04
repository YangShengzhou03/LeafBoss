<template>
  <div class="card-key-verify">
    <el-card class="verify-card">
      <template #header>
        <div class="card-header">
          <span>卡密验证</span>
        </div>
      </template>
      
      <div class="verify-content">
        <el-form :model="verifyForm" :rules="verifyRules" ref="verifyFormRef" label-width="100px">
          <el-form-item label="卡密" prop="cardKey">
            <el-input 
              v-model="verifyForm.cardKey" 
              placeholder="请输入卡密进行验证"
              clearable
              @keyup.enter="handleVerify"
            >
              <template #append>
                <el-button @click="handleVerify" :loading="verifying">验证</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        
        <div v-if="verifyResult" class="result-section">
          <el-divider />
          <div class="result-content">
            <h3>验证结果</h3>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="卡密状态">
                <el-tag :type="verifyResult.status === 'valid' ? 'success' : 'danger'">
                  {{ verifyResult.status === 'valid' ? '有效' : '无效' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="商品名称">{{ verifyResult.productName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="规格">{{ verifyResult.specification || '-' }}</el-descriptions-item>
              <el-descriptions-item label="有效期">{{ verifyResult.validityPeriod || '-' }}</el-descriptions-item>
              <el-descriptions-item label="使用次数">{{ verifyResult.usageCount || 0 }}/{{ verifyResult.maxUsage || 0 }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ verifyResult.createTime || '-' }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const verifyFormRef = ref()
const verifying = ref(false)
const verifyResult = ref(null)

const verifyForm = reactive({
  cardKey: ''
})

const verifyRules = {
  cardKey: [
    { required: true, message: '请输入卡密', trigger: 'blur' }
  ]
}

const handleVerify = async () => {
  try {
    const valid = await verifyFormRef.value.validate()
    if (!valid) return
    
    verifying.value = true
    
    // 模拟验证请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟验证结果
    verifyResult.value = {
      status: 'valid',
      productName: '测试商品',
      specification: '标准版',
      validityPeriod: '2024-12-31',
      usageCount: 1,
      maxUsage: 5,
      createTime: '2024-01-01 10:00:00'
    }
    
    ElMessage.success('验证成功')
  } catch (error) {
    console.error('验证失败:', error)
    ElMessage.error('验证失败，请重试')
  } finally {
    verifying.value = false
  }
}
</script>

<style scoped>
.card-key-verify {
  padding: 0;
  background-color: #f0f2f5;
}

.verify-card {
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.verify-card :deep(.el-card__body) {
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

.verify-content {
  padding: 12px 0;
}

.result-section {
  margin-top: 24px;
}

.result-content h3 {
  margin-bottom: 16px;
  color: #303133;
}

:deep(.el-descriptions__label) {
  width: 100px;
}

:deep(.el-descriptions__content) {
  width: calc(100% - 100px);
}
</style>