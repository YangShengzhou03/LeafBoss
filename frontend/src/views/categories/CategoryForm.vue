<template>
  <div class="category-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ formTitle }}</span>
        </div>
      </template>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        
        <el-form-item label="父级分类" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择父级分类" clearable>
            <el-option label="无父级分类" :value="0" />
            <el-option 
              v-for="category in categories" 
              :key="category.id" 
              :label="category.name" 
              :value="category.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入分类描述" 
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const defaultForm = {
  id: null,
  name: '',
  parentId: 0,
  sort: 0,
  status: 1,
  description: ''
}

export default {
  name: 'CategoryForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref()
    const form = reactive({ ...defaultForm })
    const categories = ref([])
    
    const formTitle = computed(() => {
      return route.params.id ? '编辑分类' : '新增分类'
    })
    
    const rules = {
      name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 2, max: 50, message: '分类名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      sort: [
        { required: true, message: '请输入排序值', trigger: 'blur' }
      ]
    }
    
    const loadCategories = async () => {
      // 模拟加载分类列表
      categories.value = [
        { id: 1, name: '电子产品' },
        { id: 2, name: '服装鞋帽' },
        { id: 3, name: '家居用品' }
      ]
    }
    
    const loadCategoryDetail = async (id) => {
      // 模拟加载分类详情
      const category = {
        id: id,
        name: '示例分类',
        parentId: 1,
        sort: 10,
        status: 1,
        description: '这是一个示例分类'
      }
      Object.assign(form, category)
    }
    
    const handleSubmit = async () => {
      try {
        await formRef.value.validate()
        
        // 模拟保存操作
        ElMessage.success(route.params.id ? '分类更新成功' : '分类创建成功')
        router.push('/categories')
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const handleCancel = () => {
      router.push('/categories')
    }
    
    onMounted(() => {
      loadCategories()
      
      if (route.params.id) {
        loadCategoryDetail(route.params.id)
      }
    })
    
    return {
      formRef,
      form,
      categories,
      formTitle,
      rules,
      handleSubmit,
      handleCancel
    }
  }
}
</script>

<style scoped>
.category-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>