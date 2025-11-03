<template>
  <div class="product-form">
    <el-card>
      <template #header>
        <div class="form-header">
          <span>{{ isEdit ? '编辑商品' : '新增商品' }}</span>
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="left"
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">基本信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入商品名称"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="sku">
              <el-input
                v-model="formData.sku"
                placeholder="请输入SKU编码"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品分类" prop="categoryId">
              <el-cascader
                v-model="formData.categoryId"
                :options="categoryOptions"
                :props="{ checkStrictly: true, emitPath: false }"
                placeholder="请选择商品分类"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品品牌">
              <el-input
                v-model="formData.brand"
                placeholder="请输入商品品牌"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <!-- 价格库存 -->
        <el-divider content-position="left">价格库存</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="销售价格" prop="price">
              <el-input-number
                v-model="formData.price"
                :min="0"
                :precision="2"
                :step="0.01"
                placeholder="请输入销售价格"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原价">
              <el-input-number
                v-model="formData.originalPrice"
                :min="0"
                :precision="2"
                :step="0.01"
                placeholder="请输入原价"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存数量" prop="stock">
              <el-input-number
                v-model="formData.stock"
                :min="0"
                :step="1"
                placeholder="请输入库存数量"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="重量">
              <el-input-number
                v-model="formData.weight"
                :min="0"
                :precision="2"
                :step="0.01"
                placeholder="请输入重量"
                style="width: 100%"
              />
              <template #label>
                <span>重量</span>
                <el-tooltip content="单位：千克" placement="top">
                  <el-icon style="margin-left: 4px"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计量单位">
              <el-input
                v-model="formData.unit"
                placeholder="请输入计量单位"
                maxlength="10"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择商品状态" style="width: 100%">
                <el-option label="上架" value="active" />
                <el-option label="下架" value="inactive" />
                <el-option label="草稿" value="draft" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 商品图片 -->
        <el-divider content-position="left">商品图片</el-divider>
        
        <el-form-item label="商品图片" prop="images">
          <el-upload
            v-model:file-list="imageList"
            action=""
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePicturePreview"
            :on-remove="handleRemove"
            :on-change="handleImageChange"
            :before-upload="beforeImageUpload"
            accept="image/*"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">
            支持 jpg、png、gif 格式图片，单张图片大小不超过2MB，最多上传10张图片
          </div>
        </el-form-item>

        <!-- 商品标签 -->
        <el-divider content-position="left">商品标签</el-divider>
        
        <el-form-item label="商品标签">
          <el-tag
            v-for="tag in formData.tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleRemoveTag(tag)"
            style="margin-right: 10px; margin-bottom: 5px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            size="small"
            style="width: 100px"
            @keyup.enter="handleTagInputConfirm"
            @blur="handleTagInputConfirm"
          />
          <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
        </el-form-item>

        <!-- 商品规格 -->
        <el-divider content-position="left">商品规格</el-divider>
        
        <el-form-item label="商品规格">
          <div class="specifications">
            <div 
              v-for="(spec, index) in formData.specifications" 
              :key="index"
              class="spec-item"
            >
              <el-input
                v-model="spec.name"
                placeholder="规格名称"
                style="width: 150px; margin-right: 10px"
              />
              <el-input
                v-model="spec.value"
                placeholder="规格值"
                style="width: 150px; margin-right: 10px"
              />
              <el-input
                v-model="spec.unit"
                placeholder="单位"
                style="width: 100px; margin-right: 10px"
              />
              <el-button 
                type="danger" 
                link 
                @click="removeSpecification(index)"
              >
                删除
              </el-button>
            </div>
            <el-button type="primary" link @click="addSpecification">
              + 添加规格
            </el-button>
          </div>
        </el-form-item>

        <!-- 营销设置 -->
        <el-divider content-position="left">营销设置</el-divider>
        
        <el-form-item label="营销设置">
          <el-checkbox-group v-model="marketingSettings">
            <el-checkbox label="isFeatured">推荐商品</el-checkbox>
            <el-checkbox label="isHot">热销商品</el-checkbox>
            <el-checkbox label="isNew">新品上市</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEdit ? '更新商品' : '创建商品' }}
          </el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleSaveDraft" :loading="loading">
            保存为草稿
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="dialogVisible" title="图片预览">
      <img :src="dialogImageUrl" alt="预览图片" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type UploadFile, type UploadUserFile } from 'element-plus'
import { Plus, QuestionFilled } from '@element-plus/icons-vue'
import { safeProductApi } from '@/api/product'
import type { 
  ProductInfo, 
  CreateProductParams, 
  UpdateProductParams,
  ProductCategory,
  ProductSpecification 
} from '@/types'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()

// 是否为编辑模式
const isEdit = computed(() => route.name === 'ProductEdit')
const productId = computed(() => parseInt(route.params.id as string) || 0)

// 表单数据
const formData = reactive<CreateProductParams>({
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined,
  stock: 0,
  sku: '',
  categoryId: 0,
  brand: '',
  weight: undefined,
  unit: '',
  images: [],
  thumbnail: '',
  status: 'draft',
  isFeatured: false,
  isHot: false,
  isNew: false,
  tags: [],
  specifications: []
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '商品名称长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  sku: [
    { required: true, message: '请输入SKU编码', trigger: 'blur' },
    { min: 1, max: 50, message: 'SKU编码长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入销售价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量必须大于等于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ]
}

// 分类选项
const categoryOptions = ref<ProductCategory[]>([])

// 图片上传相关
const imageList = ref<UploadUserFile[]>([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

// 标签输入相关
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref()

// 营销设置
const marketingSettings = computed({
  get: () => {
    const settings: string[] = []
    if (formData.isFeatured) settings.push('isFeatured')
    if (formData.isHot) settings.push('isHot')
    if (formData.isNew) settings.push('isNew')
    return settings
  },
  set: (value: string[]) => {
    formData.isFeatured = value.includes('isFeatured')
    formData.isHot = value.includes('isHot')
    formData.isNew = value.includes('isNew')
  }
})

// 加载状态
const loading = ref(false)

onMounted(() => {
  loadCategories()
  if (isEdit.value && productId.value) {
    loadProductDetail()
  }
})

// 加载分类列表
const loadCategories = async () => {
  try {
    // 这里需要调用分类API，暂时使用模拟数据
    categoryOptions.value = [
      { id: 1, name: '电子产品', level: 1, sort: 1, status: true, productCount: 0, createdAt: '', updatedAt: '' },
      { id: 2, name: '服装', level: 1, sort: 2, status: true, productCount: 0, createdAt: '', updatedAt: '' },
      { id: 3, name: '食品', level: 1, sort: 3, status: true, productCount: 0, createdAt: '', updatedAt: '' }
    ]
  } catch (error) {
    console.error('加载分类列表失败:', error)
  }
}

// 加载商品详情
const loadProductDetail = async () => {
  try {
    const response = await safeProductApi.getProduct(productId.value)
    if (response.success && response.data) {
      Object.assign(formData, response.data)
      
      // 处理图片列表
      if (response.data.images && response.data.images.length > 0) {
        imageList.value = response.data.images.map((url: string, index: number) => ({
          name: `image-${index}`,
          url: url
        }))
      }
    } else {
      ElMessage.error(response.message || '获取商品详情失败')
      goBack()
    }
  } catch (error) {
    console.error('加载商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
    goBack()
  }
}

// 图片预览
const handlePicturePreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url || ''
  dialogVisible.value = true
}

// 删除图片
const handleRemove = (file: UploadFile) => {
  const index = imageList.value.findIndex(item => item.uid === file.uid)
  if (index > -1) {
    imageList.value.splice(index, 1)
  }
}

// 图片变化
const handleImageChange = (file: UploadFile) => {
  imageList.value.push(file)
}

// 图片上传前验证
const beforeImageUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isGIF = file.type === 'image/gif'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG && !isGIF) {
    ElMessage.error('上传图片只能是 JPG、PNG、GIF 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 显示标签输入框
const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

// 确认标签输入
const handleTagInputConfirm = () => {
  if (tagInputValue.value) {
    if (!formData.tags) formData.tags = []
    if (!formData.tags.includes(tagInputValue.value)) {
      formData.tags.push(tagInputValue.value)
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

// 删除标签
const handleRemoveTag = (tag: string) => {
  if (formData.tags) {
    const index = formData.tags.indexOf(tag)
    if (index > -1) {
      formData.tags.splice(index, 1)
    }
  }
}

// 添加规格
const addSpecification = () => {
  if (!formData.specifications) formData.specifications = []
  formData.specifications.push({
    name: '',
    value: '',
    unit: ''
  })
}

// 删除规格
const removeSpecification = (index: number) => {
  if (formData.specifications) {
    formData.specifications.splice(index, 1)
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 处理图片数据
    const imageUrls = imageList.value.map(file => file.url || '').filter(url => url)
    formData.images = imageUrls
    formData.thumbnail = imageUrls[0] || ''

    let response
    if (isEdit.value) {
      response = await safeProductApi.updateProduct(productId.value, formData as UpdateProductParams)
    } else {
      response = await safeProductApi.createProduct(formData)
    }

    if (response.success) {
      ElMessage.success(isEdit.value ? '更新商品成功' : '创建商品成功')
      goBack()
    } else {
      ElMessage.error(response.message || (isEdit.value ? '更新商品失败' : '创建商品失败'))
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    ElMessage.error('表单验证失败，请检查输入信息')
  } finally {
    loading.value = false
  }
}

// 保存为草稿
const handleSaveDraft = async () => {
  if (!formRef.value) return

  try {
    formData.status = 'draft'
    
    // 处理图片数据
    const imageUrls = imageList.value.map(file => file.url || '').filter(url => url)
    formData.images = imageUrls
    formData.thumbnail = imageUrls[0] || ''

    let response
    if (isEdit.value) {
      response = await safeProductApi.updateProduct(productId.value, formData as UpdateProductParams)
    } else {
      response = await safeProductApi.createProduct(formData)
    }

    if (response.success) {
      ElMessage.success('保存草稿成功')
      goBack()
    } else {
      ElMessage.error(response.message || '保存草稿失败')
    }
  } catch (error) {
    console.error('保存草稿失败:', error)
    ElMessage.error('保存草稿失败')
  }
}

// 重置表单
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    imageList.value = []
    if (formData.tags) formData.tags = []
    if (formData.specifications) formData.specifications = []
  }
}

// 返回列表
const goBack = () => {
  router.push('/products')
}
</script>

<style scoped>
.product-form {
  padding: 20px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-tip {
  margin-top: 10px;
  color: #606266;
  font-size: 12px;
}

.specifications {
  .spec-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}

:deep(.el-upload-list--picture-card) {
  .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
}

:deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>