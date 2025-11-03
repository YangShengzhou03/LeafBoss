// 卡状态枚举
export const CardStatus = {
  DRAFT: 'draft',      // 草稿
  PUBLISHED: 'published', // 已上架
  SOLD_OUT: 'sold_out',   // 已下架
  DISABLED: 'disabled'    // 已禁用
}

// 卡信息类
export class CardInfo {
  constructor(data = {}) {
    this.id = data.id || ''
    this.cardNumber = data.cardNumber || ''
    this.productId = data.productId || ''
    this.specificationId = data.specificationId || ''
    this.status = data.status || CardStatus.DRAFT
    this.price = data.price || 0
    this.stock = data.stock || 0
    this.soldCount = data.soldCount || 0
    this.createdAt = data.createdAt || ''
    this.updatedAt = data.updatedAt || ''
    this.product = data.product || null
    this.specification = data.specification || null
  }
}

// 商品信息类
export class ProductInfo {
  constructor(data = {}) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.description = data.description || ''
    this.category = data.category || ''
    this.status = data.status || 'active'
    this.specifications = data.specifications || []
    this.createdAt = data.createdAt || ''
    this.updatedAt = data.updatedAt || ''
  }
}

// 规格信息类
export class SpecificationInfo {
  constructor(data = {}) {
    this.id = data.id || ''
    this.productId = data.productId || ''
    this.name = data.name || ''
    this.value = data.value || ''
    this.price = data.price || 0
    this.stock = data.stock || 0
    this.status = data.status || 'active'
    this.createdAt = data.createdAt || ''
    this.updatedAt = data.updatedAt || ''
  }
}

// 卡查询参数类
export class CardQueryParams {
  constructor(data = {}) {
    this.page = data.page || 1
    this.size = data.size || 10
    this.keyword = data.keyword || ''
    this.status = data.status
    this.productId = data.productId
    this.specificationId = data.specificationId
  }
}

// 商品查询参数类
export class ProductQueryParams {
  constructor(data = {}) {
    this.page = data.page || 1
    this.size = data.size || 10
    this.keyword = data.keyword || ''
    this.category = data.category
    this.status = data.status
  }
}

// 规格查询参数类
export class SpecificationQueryParams {
  constructor(data = {}) {
    this.page = data.page || 1
    this.size = data.size || 10
    this.productId = data.productId || ''
    this.keyword = data.keyword || ''
    this.status = data.status
  }
}

// 创建卡参数类
export class CreateCardParams {
  constructor(data = {}) {
    this.cardNumber = data.cardNumber || ''
    this.productId = data.productId || ''
    this.specificationId = data.specificationId || ''
    this.price = data.price || 0
    this.stock = data.stock || 0
  }
}

// 更新卡参数类
export class UpdateCardParams {
  constructor(data = {}) {
    this.price = data.price
    this.stock = data.stock
    this.status = data.status
  }
}

// 创建商品参数类
export class CreateProductParams {
  constructor(data = {}) {
    this.name = data.name || ''
    this.description = data.description || ''
    this.category = data.category || ''
  }
}

// 更新商品参数类
export class UpdateProductParams {
  constructor(data = {}) {
    this.name = data.name
    this.description = data.description
    this.category = data.category
    this.status = data.status
  }
}

// 创建规格参数类
export class CreateSpecificationParams {
  constructor(data = {}) {
    this.productId = data.productId || ''
    this.name = data.name || ''
    this.value = data.value || ''
    this.price = data.price || 0
    this.stock = data.stock || 0
  }
}

// 更新规格参数类
export class UpdateSpecificationParams {
  constructor(data = {}) {
    this.name = data.name
    this.value = data.value
    this.price = data.price
    this.stock = data.stock
    this.status = data.status
  }
}

// API响应类
export class ApiResponse {
  constructor(data = {}) {
    this.success = data.success || false
    this.data = data.data
    this.message = data.message || ''
    this.code = data.code
  }
}

// 分页响应类
export class PaginatedResponse {
  constructor(data = {}) {
    this.items = data.items || []
    this.total = data.total || 0
    this.page = data.page || 1
    this.size = data.size || 10
    this.totalPages = data.totalPages || 0
  }
}