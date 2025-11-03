// 商品管理相关类型定义

// 商品基本信息
export interface ProductInfo {
  id: number
  name: string
  description?: string
  price: number
  originalPrice?: number
  stock: number
  sku: string
  categoryId: number
  categoryName?: string
  brand?: string
  weight?: number
  unit?: string
  images: string[]
  thumbnail?: string
  status: 'active' | 'inactive' | 'draft'
  isFeatured: boolean
  isHot: boolean
  isNew: boolean
  tags?: string[]
  specifications?: ProductSpecification[]
  viewCount: number
  saleCount: number
  rating?: number
  reviewCount: number
  createdBy: number
  updatedBy?: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// 商品规格
export interface ProductSpecification {
  name: string
  value: string
  unit?: string
}

// 商品分类
export interface ProductCategory {
  id: number
  name: string
  description?: string
  icon?: string
  image?: string
  parentId?: number
  level: number
  sort: number
  status: boolean
  children?: ProductCategory[]
  productCount: number
  createdAt: string
  updatedAt: string
}

// 商品品牌
export interface ProductBrand {
  id: number
  name: string
  logo?: string
  description?: string
  website?: string
  status: boolean
  productCount: number
  createdAt: string
  updatedAt: string
}

// 商品库存记录
export interface StockRecord {
  id: number
  productId: number
  productName: string
  type: 'in' | 'out' | 'adjust'
  quantity: number
  beforeStock: number
  afterStock: number
  reason: string
  operator: string
  remark?: string
  createdAt: string
}

// 商品价格记录
export interface PriceRecord {
  id: number
  productId: number
  productName: string
  oldPrice: number
  newPrice: number
  changeType: 'increase' | 'decrease' | 'adjust'
  reason: string
  operator: string
  remark?: string
  createdAt: string
}

// 创建商品参数
export interface CreateProductParams {
  name: string
  description?: string
  price: number
  originalPrice?: number
  stock: number
  sku: string
  categoryId: number
  brand?: string
  weight?: number
  unit?: string
  images: string[]
  thumbnail?: string
  status: 'active' | 'inactive' | 'draft'
  isFeatured?: boolean
  isHot?: boolean
  isNew?: boolean
  tags?: string[]
  specifications?: ProductSpecification[]
}

// 更新商品参数
export interface UpdateProductParams {
  name?: string
  description?: string
  price?: number
  originalPrice?: number
  stock?: number
  sku?: string
  categoryId?: number
  brand?: string
  weight?: number
  unit?: string
  images?: string[]
  thumbnail?: string
  status?: 'active' | 'inactive' | 'draft'
  isFeatured?: boolean
  isHot?: boolean
  isNew?: boolean
  tags?: string[]
  specifications?: ProductSpecification[]
}

// 创建商品分类参数
export interface CreateProductCategoryParams {
  name: string
  description?: string
  icon?: string
  image?: string
  parentId?: number
  sort?: number
  status?: boolean
}

// 更新商品分类参数
export interface UpdateProductCategoryParams {
  name?: string
  description?: string
  icon?: string
  image?: string
  parentId?: number
  sort?: number
  status?: boolean
}

// 创建商品品牌参数
export interface CreateProductBrandParams {
  name: string
  logo?: string
  description?: string
  website?: string
  status?: boolean
}

// 更新商品品牌参数
export interface UpdateProductBrandParams {
  name?: string
  logo?: string
  description?: string
  website?: string
  status?: boolean
}

// 商品查询参数
export interface ProductQueryParams extends PaginationParams {
  categoryId?: number
  brandId?: number
  keyword?: string
  tags?: string[]
  status?: 'active' | 'inactive' | 'draft'
  isFeatured?: boolean
  isHot?: boolean
  isNew?: boolean
  minPrice?: number
  maxPrice?: number
  minStock?: number
  maxStock?: number
  startDate?: string
  endDate?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'price' | 'stock' | 'saleCount' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

// 商品分类查询参数
export interface ProductCategoryQueryParams extends PaginationParams {
  keyword?: string
  status?: boolean
  level?: number
}

// 商品品牌查询参数
export interface ProductBrandQueryParams extends PaginationParams {
  keyword?: string
  status?: boolean
}

// 商品统计信息
export interface ProductStatistics {
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  draftProducts: number
  featuredProducts: number
  hotProducts: number
  newProducts: number
  totalCategories: number
  totalBrands: number
  totalStock: number
  totalSales: number
  todayAdded: number
  todaySold: number
  todayViewed: number
}

// 商品导入结果
export interface ProductImportResult {
  total: number
  success: number
  failed: number
  errors: string[]
}

// 商品导出参数
export interface ProductExportParams {
  categoryId?: number
  brandId?: number
  status?: 'active' | 'inactive' | 'draft'
  isFeatured?: boolean
  isHot?: boolean
  isNew?: boolean
  startDate?: string
  endDate?: string
  fields?: string[]
  format?: 'excel' | 'csv'
}