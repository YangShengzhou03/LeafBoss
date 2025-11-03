<template>
  <div class="specification-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ formTitle }}</span>
        </div>
      </template>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入规格名称" />
        </el-form-item>
        
        <el-form-item label="规格类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择规格类型">
            <el-option label="文本" value="text" />
            <el-option label="数字" value="number" />
            <el-option label="颜色" value="color" />
            <el-option label="图片" value="image" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="是否必填" prop="required">
          <el-switch v-model="form.required" />
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
        
        <el-form-item label="规格值" prop="values" v-if="form.type === 'text' || form.type === 'number'">
          <el-input 
            v-model="form.values" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入规格值，多个值用逗号分隔" 
          />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入规格描述" 
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
  type: 'text',
  required: false,
  sort: 0,
  status: 1,
  values: '',
  description: ''
}

export default {
  name: 'SpecificationForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const formRef = ref()
    const form = reactive({ ...defaultForm })
    
    const formTitle = computed(() => {
      return route.params.id ? '编辑规格' : '新增规格'
    })
    
    const rules = {
      name: [
        { required: true, message: '请输入规格名称', trigger: 'blur' },
        { min: 2, max: 50, message: '规格名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择规格类型', trigger: 'change' }
      ]
    }
    
    const loadSpecificationDetail = async (id) => {
      // 模拟加载规格详情
      const specification = {
        id: id,
        name: '示例规格',
        type: 'text',
        required: true,
        sort: 10,
        status: 1,
        values: '大,中,小',
        description: '这是一个示例规格'
      }
      Object.assign(form, specification)
    }
    
    const handleSubmit = async () => {
      try {
        await formRef.value.validate()
        
        // 模拟保存操作
        ElMessage.success(route.params.id ? '规格更新成功' : '规格创建成功')
        router.push('/specifications')
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }
    
    const handleCancel = () => {
      router.push('/specifications')
    }
    
    onMounted(() => {
      if (route.params.id) {
        loadSpecificationDetail(route.params.id)
      }
    })
    
    return {
      formRef,
      form,
      formTitle,
      rules,
      handleSubmit,
      handleCancel
    }
  }
}
</script>

<style scoped>
.specification-form {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>