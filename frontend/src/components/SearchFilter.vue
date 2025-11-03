<template>
  <div class="search-filter">
    <el-form 
      :model="formData" 
      ref="formRef" 
      label-width="auto"
      class="filter-form"
      :inline="true"
    >
      <!-- 搜索输入框 -->
      <el-form-item v-if="showSearch" :label="searchLabel">
        <el-input
          v-model="formData.keyword"
          :placeholder="searchPlaceholder"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <!-- 动态筛选字段 -->
      <el-form-item 
        v-for="field in filterFields" 
        :key="field.prop" 
        :label="field.label"
      >
        <component
          :is="getFieldComponent(field.type)"
          v-model="formData[field.prop]"
          v-bind="field.props || {}"
          :placeholder="field.placeholder"
          clearable
          @change="handleSearch"
        >
          <template v-if="field.type === 'select' && field.options">
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </template>
        </component>
      </el-form-item>

      <!-- 日期范围选择器 -->
      <el-form-item v-if="showDateRange" label="时间范围">
        <el-date-picker
          v-model="formData.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleSearch"
        />
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item class="action-buttons">
        <el-button type="primary" @click="handleSearch" :loading="loading">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
        <el-button v-if="showExport" @click="handleExport" :loading="exporting">
          <el-icon><Download /></el-icon>
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  // 是否显示搜索框
  showSearch: {
    type: Boolean,
    default: true
  },
  // 搜索框标签
  searchLabel: {
    type: String,
    default: '关键词'
  },
  // 搜索框占位符
  searchPlaceholder: {
    type: String,
    default: '请输入搜索关键词'
  },
  // 筛选字段配置
  filterFields: {
    type: Array,
    default: () => []
  },
  // 是否显示日期范围选择器
  showDateRange: {
    type: Boolean,
    default: false
  },
  // 是否显示导出按钮
  showExport: {
    type: Boolean,
    default: false
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 导出状态
  exporting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset', 'export'])

const formRef = ref()

// 初始化表单数据
const initialFormData = reactive({
  keyword: '',
  dateRange: []
})

// 动态添加筛选字段的初始值
props.filterFields.forEach(field => {
  initialFormData[field.prop] = field.defaultValue || ''
})

const formData = reactive({ ...initialFormData })

// 获取字段对应的组件
const getFieldComponent = (type) => {
  const componentMap = {
    'select': 'el-select',
    'input': 'el-input',
    'number': 'el-input-number',
    'date': 'el-date-picker',
    'switch': 'el-switch'
  }
  return componentMap[type] || 'el-input'
}

// 搜索处理
const handleSearch = () => {
  emit('search', { ...formData })
}

// 重置处理
const handleReset = () => {
  Object.keys(initialFormData).forEach(key => {
    formData[key] = initialFormData[key]
  })
  emit('reset')
  handleSearch()
}

// 导出处理
const handleExport = () => {
  emit('export', { ...formData })
}

// 监听筛选字段变化，自动更新初始值
watch(() => props.filterFields, (newFields) => {
  newFields.forEach(field => {
    if (!(field.prop in initialFormData)) {
      initialFormData[field.prop] = field.defaultValue || ''
      formData[field.prop] = field.defaultValue || ''
    }
  })
}, { deep: true })

// 暴露方法给父组件
defineExpose({
  getFormData: () => ({ ...formData }),
  setFormData: (data) => {
    Object.keys(data).forEach(key => {
      if (key in formData) {
        formData[key] = data[key]
      }
    })
  },
  resetForm: handleReset
})
</script>

<style scoped>
.search-filter {
  width: 100%;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-base);
  align-items: flex-end;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--text-regular);
}

.action-buttons {
  margin-left: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  :deep(.el-form-item) {
    width: 100%;
  }
  
  .action-buttons {
    margin-left: 0;
    display: flex;
    gap: var(--spacing-sm);
  }
  
  :deep(.action-buttons .el-button) {
    flex: 1;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .filter-form {
    gap: var(--spacing-sm);
  }
  
  :deep(.el-form-item) {
    margin-right: 0;
  }
}
</style>