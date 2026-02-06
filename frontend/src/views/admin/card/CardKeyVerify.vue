<template>
  <div class="cardkey-verify">
    <el-card class="verify-card">
      <template #header>
        <div class="card-header">
          <span>卡密验证</span>
        </div>
      </template>

      <div class="verify-content">
        <div class="input-section">
          <el-input v-model="cardKeyInput" placeholder="请输入卡密代码" clearable size="large" @keyup.enter="handleVerify"
            @clear="clearResult" class="cardkey-input" />
          <el-button type="primary" @click="handleVerify" :loading="verifying" class="verify-btn">
            验证
          </el-button>
        </div>

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
                <el-descriptions-item label="商品规格">{{ cardKeyInfo.productSpec || cardKeyInfo.specificationName ||
                  cardKeyInfo.specificationId || '未设置' }}</el-descriptions-item>
                <el-descriptions-item label="价格">¥{{ cardKeyInfo.price || '0.00' }}</el-descriptions-item>
                <el-descriptions-item label="使用时间">{{ cardKeyInfo.activateTime || '未使用' }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ cardKeyInfo.createdAt || '-' }}</el-descriptions-item>
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
import Server from '@/utils/Server.js'

const cardKeyInput = ref('')

const verifying = ref(false)

const showResult = ref(false)
const cardKeyInfo = ref({})

const getStatusText = (status) => {
  const statusMap = {
    active: '可用',
    used: '已使用',
    disabled: '已禁用',
    expired: '已过期',
    '未使用': '未使用',
    '已使用': '已使用',
    '已禁用': '已禁用',
    '已过期': '已过期'
  }
  return statusMap[status] || status || '未知'
}

const getStatusTagType = (status) => {
  const typeMap = {
    active: 'success',
    used: 'info',
    disabled: 'warning',
    expired: 'danger',
    '未使用': 'success',
    '已使用': 'info',
    '已禁用': 'warning',
    '已过期': 'danger'
  }
  return typeMap[status] || 'info'
}

const resultClass = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active' || status === '未使用') return 'result-success'
  if (status === 'used' || status === '已使用') return 'result-info'
  if (status === 'disabled' || status === '已禁用' || status === 'expired' || status === '已过期') return 'result-warning'
  if (status === '未知') return 'result-error'
  return 'result-success'
})

const resultTitle = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active' || status === '未使用') return '卡密验证成功 - 卡密可用'
  if (status === 'used' || status === '已使用') return '卡密验证成功 - 卡密已使用'
  if (status === 'disabled' || status === '已禁用') return '卡密验证成功 - 卡密已禁用'
  if (status === 'expired' || status === '已过期') return '卡密验证成功 - 卡密已过期'
  if (status === '未知') return '卡密验证失败'
  return '卡密验证成功'
})

const resultIcon = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active' || status === '未使用') return CircleCheck
  if (status === 'used' || status === '已使用') return CircleCheck
  if (status === 'disabled' || status === '已禁用' || status === 'expired' || status === '已过期') return Warning
  if (status === '未知') return CircleClose
  return CircleCheck
})

const resultIconColor = computed(() => {
  const status = cardKeyInfo.value.status
  if (status === 'active' || status === '未使用') return '#67C23A'
  if (status === 'used' || status === '已使用') return '#409EFF'
  if (status === 'disabled' || status === '已禁用' || status === 'expired' || status === '已过期') return '#E6A23C'
  if (status === '未知') return '#F56C6C'
  return '#67C23A'
})

const handleVerify = async () => {
  if (!cardKeyInput.value.trim()) {
    ElMessage.warning('请输入卡密代码')
    return
  }

  verifying.value = true

  try {
    const response = await Server.get(`/api/card-keys/verify/${cardKeyInput.value.trim()}`)

    if (response && response.code === 200) {
      if (response.data) {
        cardKeyInfo.value = response.data

        if (!cardKeyInfo.value.productSpec && cardKeyInfo.value.specificationName) {
          cardKeyInfo.value.productSpec = cardKeyInfo.value.specificationName
        }

        showResult.value = true
        ElMessage.success('卡密验证成功')
      } else {
        cardKeyInfo.value = {
          cardKey: cardKeyInput.value.trim(),
          status: '未知'
        }
        showResult.value = true
        ElMessage.error('卡密验证失败')
      }
    } else {
      cardKeyInfo.value = {
        cardKey: cardKeyInput.value.trim(),
        status: '未知'
      }
      showResult.value = true
      ElMessage.error('卡密验证失败')
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      cardKeyInfo.value = {
        cardKey: cardKeyInput.value.trim(),
        status: '未知'
      }
      showResult.value = true
      ElMessage.error('卡密验证失败')
    } else if (!error.response) {
      cardKeyInfo.value = {
        cardKey: cardKeyInput.value.trim(),
        status: '未知'
      }
      showResult.value = true
      ElMessage.error('验证失败，请检查网络连接')
    } else {
      cardKeyInfo.value = {
        cardKey: cardKeyInput.value.trim(),
        status: '未知'
      }
      showResult.value = true
      ElMessage.error('卡密验证失败')
    }
  } finally {
    verifying.value = false
  }
}

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