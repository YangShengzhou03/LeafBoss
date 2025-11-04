<template>
  <div class="cardkey-verify">
    <el-card class="verify-card">
      <template #header>
        <div class="card-header">
          <span>卡密验证</span>
        </div>
      </template>

      <div class="verify-content">
        <!-- 卡密输入区域 -->
        <div class="input-section">
          <el-input
            v-model="cardKeyInput"
            placeholder="请输入卡密代码"
            clearable
            size="large"
            @keyup.enter="handleVerify"
            @clear="clearResult"
            class="cardkey-input"
          />
          <el-button type="primary" @click="handleVerify" :loading="verifying" class="verify-btn">
            验证
          </el-button>
        </div>

        <!-- 验证结果区域 -->
        <div v-if="showResult" class="result-section">
          <el-divider content-position="left">验证结果</el-divider>
          
          <div class="result-card" :class="resultClass">
            <div class="result-header">
              <el-icon :size="24" :color="resultIconColor">
                <component :is="resultIcon" />
              </el-icon>
              <span class="result-title">{{ resultTitle }}</span>
            </div>
            
            <div class="result-content">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="卡密代码">{{ cardKeyInfo.cardKey }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="getStatusTagType(cardKeyInfo.status)">
                    {{ getStatusText(cardKeyInfo.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="商品规格">{{ cardKeyInfo.productSpec || '未设置' }}</el-descriptions-item>
                <el-descriptions-item label="价格">¥{{ cardKeyInfo.price || '0.00' }}</el-descriptions-item>
                <el-descriptions-item label="使用时间">{{ cardKeyInfo.activateTime || '未使用' }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ cardKeyInfo.createTime || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose, Warning } from '@element-plus/icons-vue'

// 卡密输入
const cardKeyInput = ref('')

// 验证状态
const verifying = ref(false)

// 验证结果
const showResult = ref(false)
const cardKeyInfo = ref({})

// 状态文本映射
const getStatusText = (status) => {
  const statusMap = {
    active: '可用',
    used: '已使用',
    disabled: '已禁用',
    expired: '已过期'
  }
  return statusMap[status] || '未知'
}

// 状态标签类型映射
const getStatusTagType = (status) => {
  const typeMap = {
    active: 'success',
    used: 'info',
    disabled: 'warning',
    expired: 'danger'
  }
  return typeMap[status] || 'info'
}

// 验证结果相关计算属性
const resultClass = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active') return 'result-success'
  if (status === 'used') return 'result-info'
  if (status === 'disabled' || status === 'expired') return 'result-warning'
  return 'result-error'
})

const resultTitle = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active') return '卡密验证成功 - 卡密可用'
  if (status === 'used') return '卡密验证成功 - 卡密已使用'
  if (status === 'disabled') return '卡密验证成功 - 卡密已禁用'
  if (status === 'expired') return '卡密验证成功 - 卡密已过期'
  return '卡密验证失败'
})

const resultIcon = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active') return CircleCheck
  if (status === 'used') return CircleCheck
  if (status === 'disabled' || status === 'expired') return Warning
  return CircleClose
})

const resultIconColor = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active') return '#67C23A'
  if (status === 'used') return '#409EFF'
  if (status === 'disabled' || status === 'expired') return '#E6A23C'
  return '#F56C6C'
})

// 验证卡密
const handleVerify = async () => {
  if (!cardKeyInput.value.trim()) {
    ElMessage.warning('请输入卡密代码')
    return
  }

  verifying.value = true
  
  try {
    // 模拟API调用 - 实际项目中应该调用真实的验证接口
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟验证结果
    const mockResults = {
      'ABC123': {
        cardKey: 'ABC123',
        status: 'active',
        productSpec: 'VIP会员月卡',
        price: '29.99',
        activateTime: null,
        createTime: '2024-01-01 10:00:00'
      },
      'DEF456': {
        cardKey: 'DEF456',
        status: 'used',
        productSpec: '实体礼品卡',
        price: '199.99',
        activateTime: '2024-01-15 14:30:00',
        createTime: '2024-01-02 14:30:00'
      },
      'GHI789': {
        cardKey: 'GHI789',
        status: 'disabled',
        productSpec: '在线课程服务',
        price: '399.99',
        activateTime: null,
        createTime: '2024-01-03 09:15:00'
      }
    }
    
    const result = mockResults[cardKeyInput.value.trim()]
    
    if (result) {
      cardKeyInfo.value = result
      showResult.value = true
      ElMessage.success('卡密验证成功')
    } else {
      // 卡密不存在的情况
      cardKeyInfo.value = {
        cardKey: cardKeyInput.value.trim(),
        status: 'not_found'
      }
      showResult.value = true
      ElMessage.error('卡密不存在')
    }
  } catch (error) {
    ElMessage.error('验证失败，请重试')
  } finally {
    verifying.value = false
  }
}

// 清空结果
const clearResult = () => {
  showResult.value = false
  cardKeyInfo.value = {}
}
</script>

<style scoped>
.cardkey-verify {
  padding: 0;
  background-color: #f0f2f5;
}

.verify-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.verify-card :deep(.el-card__body) {
  padding: 16px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.cardkey-input {
  width: 400px;
}

.cardkey-input :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.verify-btn {
  height: 40px;
  padding: 0 20px;
}

.result-section {
  animation: fadeIn 0.5s ease-in-out;
}

.result-card {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid;
  background-color: #ffffff;
}

.result-success {
  border-color: #e1f3d8;
  background-color: #f0f9eb;
}

.result-info {
  border-color: #d9ecff;
  background-color: #ecf5ff;
}

.result-warning {
  border-color: #faecd8;
  background-color: #fdf6ec;
}

.result-error {
  border-color: #fde2e2;
  background-color: #fef0f0;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.result-content {
  margin-top: 16px;
}

.result-content :deep(.el-descriptions__header) {
  margin-bottom: 0;
}

.result-content :deep(.el-descriptions__title) {
  font-size: 14px;
  font-weight: 600;
}

.result-content :deep(.el-descriptions__label) {
  font-weight: 500;
  color: #606266;
}

.result-content :deep(.el-descriptions__content) {
  color: #303133;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cardkey-verify {
    padding: 0;
  }
  
  .input-section :deep(.el-input) {
    width: 100%;
  }
  
  .verify-card :deep(.el-card__body) {
    padding: 16px;
  }
  
  .result-content :deep(.el-descriptions) {
    --el-descriptions-item-bordered-cell-padding: 8px 12px;
  }
}
</style>