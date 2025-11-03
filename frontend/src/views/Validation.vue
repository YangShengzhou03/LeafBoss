<template>
  <div class="validation-container">
    <!-- 页面标题 -->
    <div class="card-header">
      <span>卡密验证</span>
    </div>

    <!-- 验证表单 -->
    <div class="validation-form">
      <el-form :model="validationForm" label-width="80px">
        <el-form-item label="卡密编号">
          <el-input
            v-model="validationForm.cardKey"
            placeholder="请输入卡密编号"
            style="width: 300px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="validateCard"
            :loading="validating"
          >
            验证卡密
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 验证结果 -->
    <div v-if="validationResult" class="validation-result">
      <el-divider>验证结果</el-divider>
      <div class="result-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="卡密编号">
            {{ validationResult.cardKey }}
          </el-descriptions-item>
          <el-descriptions-item label="规格类型">
            <el-tag type="primary">{{ validationResult.specType }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="响应数字">
            <span class="response-number">{{ validationResult.responseNumber }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="验证状态">
            <el-tag :type="validationResult.status === 'valid' ? 'success' : 'error'">
              {{ validationResult.status === 'valid' ? '有效' : '无效' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="验证时间">
            {{ validationResult.validatedAt }}
          </el-descriptions-item>
          <el-descriptions-item label="备注信息" v-if="validationResult.message">
            {{ validationResult.message }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>

    <!-- 验证历史 -->
    <div class="validation-history">
      <el-divider>验证历史</el-divider>
      <el-table :data="validationHistory" size="small">
        <el-table-column prop="cardKey" label="卡密编号" width="200" />
        <el-table-column prop="specType" label="规格类型" width="120" />
        <el-table-column prop="responseNumber" label="响应数字" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag 
              size="small" 
              :type="row.status === 'valid' ? 'success' : 'error'"
            >
              {{ row.status === 'valid' ? '有效' : '无效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="validatedAt" label="验证时间" width="180" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const validating = ref(false)

const validationForm = ref({
  cardKey: ''
})

const validationResult = ref(null)

// 模拟验证历史数据
const validationHistory = ref([
  {
    cardKey: 'CARD-20240115-001',
    specType: '月卡',
    responseNumber: 1,
    status: 'valid',
    validatedAt: '2024-01-15 14:30:00'
  },
  {
    cardKey: 'CARD-20240115-002',
    specType: '年卡',
    responseNumber: 3,
    status: 'invalid',
    validatedAt: '2024-01-15 13:15:00'
  }
])

const validateCard = async () => {
  if (!validationForm.value.cardKey.trim()) {
    ElMessage.warning('请输入卡密编号')
    return
  }

  validating.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟验证结果
    validationResult.value = {
      cardKey: validationForm.value.cardKey,
      specType: '月卡',
      responseNumber: 1,
      status: 'valid',
      validatedAt: new Date().toLocaleString('zh-CN'),
      message: '卡密验证成功'
    }
    
    // 添加到历史记录
    validationHistory.value.unshift({
      ...validationResult.value,
      validatedAt: new Date().toLocaleString('zh-CN')
    })
    
    ElMessage.success('卡密验证成功')
  } catch (error) {
    validationResult.value = {
      cardKey: validationForm.value.cardKey,
      specType: '未知',
      responseNumber: 0,
      status: 'invalid',
      validatedAt: new Date().toLocaleString('zh-CN'),
      message: '卡密验证失败：' + error.message
    }
    ElMessage.error('卡密验证失败')
  } finally {
    validating.value = false
  }
}

onMounted(() => {
  // 页面加载时的初始化操作
})
</script>

<style scoped>
.validation-container {
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

.validation-form {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 16px;
}

.validation-result {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin-bottom: 16px;
}

.result-content {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.response-number {
  font-size: 24px;
  font-weight: 500;
  color: #409EFF;
  margin: 16px 0;
  text-align: center;
}

.validation-history {
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
  .validation-form,
  .validation-result,
  .validation-history {
    padding: 12px;
  }
}
</style>