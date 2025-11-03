<template>
  <div class="page-layout">
    <!-- 页面头部 -->
    <div v-if="showHeader" class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="page-title">{{ title }}</h2>
          <el-breadcrumb v-if="breadcrumb" separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div v-if="$slots.headerActions" class="header-actions">
          <slot name="headerActions" />
        </div>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-content" :class="{ 'with-header': showHeader }">
      <!-- 搜索和筛选区域 -->
      <div v-if="$slots.filter" class="filter-section">
        <el-card class="filter-card">
          <slot name="filter" />
        </el-card>
      </div>

      <!-- 统计信息区域 -->
      <div v-if="$slots.stats" class="stats-section">
        <slot name="stats" />
      </div>

      <!-- 主要内容区域 -->
      <div class="main-section">
        <el-card class="main-card">
          <template v-if="$slots.toolbar" #header>
            <div class="toolbar">
              <slot name="toolbar" />
            </div>
          </template>
          <slot />
        </el-card>
      </div>

      <!-- 分页区域 -->
      <div v-if="$slots.pagination" class="pagination-section">
        <slot name="pagination" />
      </div>
    </div>

    <!-- 弹窗区域 -->
    <slot name="dialogs" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  breadcrumb: {
    type: Array,
    default: () => []
  },
  showHeader: {
    type: Boolean,
    default: true
  }
})

const hasBreadcrumb = computed(() => props.breadcrumb.length > 0)
</script>

<style scoped>
.page-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  padding: var(--spacing-lg) var(--spacing-xl);
  box-shadow: var(--shadow-light);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.page-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.breadcrumb {
  font-size: var(--font-size-sm);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.page-content {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.page-content.with-header {
  padding-top: var(--spacing-lg);
}

.filter-section {
  margin-bottom: var(--spacing-lg);
}

.filter-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-light);
}

.stats-section {
  margin-bottom: var(--spacing-lg);
}

.main-section {
  flex: 1;
  margin-bottom: var(--spacing-lg);
}

.main-card {
  min-height: 400px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    padding: var(--spacing-base);
  }
  
  .header-content {
    flex-direction: column;
    gap: var(--spacing-base);
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: flex-start;
  }
  
  .page-content {
    padding: var(--spacing-base);
  }
  
  .toolbar {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }
}
</style>