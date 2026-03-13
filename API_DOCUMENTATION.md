# LEAF-BOSS API 接口文档

本文档详细说明了 LEAF-BOSS 业务运营支撑系统的所有后端 API 接口。所有接口均以 `/api` 开头。

## 认证接口 (Auth)

用于系统登录、注册、登出及当前用户信息维护。

### 1. 管理员登录
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **请求体**:
  ```json
  {
    "email": "admin@qq.com",
    "password": "密码"
  }
  ```
- **成功响应**: 返回 JWT Token 及管理员基本信息。

### 2. 获取当前登录用户信息
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <Token>`
- **功能**: 获取当前 Token 对应的管理员/用户资料。

### 3. 更新当前用户信息
- **URL**: `/api/auth/me`
- **Method**: `PUT`
- **Header**: `Authorization: Bearer <Token>`
- **请求体**: 管理员/用户实体对象。

### 4. 修改当前用户密码
- **URL**: `/api/auth/password`
- **Method**: `PUT`
- **Header**: `Authorization: Bearer <Token>`
- **请求体**: `{"newPassword": "新密码"}`

### 5. 获取存储配额信息
- **URL**: `/api/auth/storage`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <Token>`
- **功能**: 获取系统存储统计信息。

### 6. 管理员注册 (公共)
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **请求体**: 管理员实体对象。

### 7. 管理员登出
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **功能**: 登出系统。

---

## 管理员管理 (Admins)

仅限超级管理员调用，用于管理后台账号。

### 1. 分页查询管理员列表
- **URL**: `/api/admins`
- **Method**: `GET`
- **参数**: `page`, `size`, `keyword`, `status`

### 2. 获取指定管理员
- **URL**: `/api/admins/{id}`
- **Method**: `GET`

### 3. 创建管理员
- **URL**: `/api/admins`
- **Method**: `POST`
- **请求体**: 管理员实体对象。

### 4. 更新指定管理员信息
- **URL**: `/api/admins/{id}`
- **Method**: `PUT`
- **请求体**: 管理员实体对象。

### 5. 删除管理员
- **URL**: `/api/admins/{id}`
- **Method**: `DELETE`

### 6. 重置管理员密码 (通过验证码)
- **URL**: `/api/admins/reset-password`
- **Method**: `POST`
- **请求体**: `{"email": "邮箱", "verificationCode": "验证码", "newPassword": "新密码"}`

### 7. 管理员直接重置密码
- **URL**: `/api/admins/admin-reset-password`
- **Method**: `POST`
- **请求体**: `{"email": "邮箱", "newPassword": "新密码"}`

### 8. 发送重置验证码
- **URL**: `/api/admins/send-reset-code`
- **Method**: `POST`
- **请求体**: `{"email": "邮箱"}`

### 9. 获取存储配额信息
- **URL**: `/api/admins/storage`
- **Method**: `GET`
- **Header**: `Authorization: Bearer <Token>`
- **功能**: 获取系统存储统计信息。

---

## 商品与规格管理 (Products & Specifications)

### 1. 商品管理
- **查询列表**: `GET /api/products` (支持 `page`, `size`, `name`, `status` 筛选)
- **查询指定商品**: `GET /api/products/{id}`
- **创建商品**: `POST /api/products`
- **更新商品**: `PUT /api/products/{id}`
- **删除商品**: `DELETE /api/products/{id}`
- **获取统计**: `GET /api/products/statistics`

### 2. 规格管理
- **查询规格 (分页)**: `GET /api/specifications` (支持 `page`, `size`, `keyword`, `productId` 筛选)
- **查询指定规格**: `GET /api/specifications/{id}`
- **根据产品ID查询规格**: `GET /api/specifications/product/{productId}`
- **根据状态查询规格**: `GET /api/specifications/status/{status}`
- **创建规格**: `POST /api/specifications`
- **更新规格**: `PUT /api/specifications/{id}`
- **删除规格**: `DELETE /api/specifications/{id}`
- **获取统计**: `GET /api/specifications/statistics`
- **查询规格 DTO (全量)**: `GET /api/specifications/dto`
- **查询规格 DTO (分页)**: `GET /api/specifications/dto/pagination` (支持 `page`, `size`, `keyword`, `productId` 筛选)

---

## 卡密管理 (Card Keys)

### 1. 管理端接口
- **查询列表**: `GET /api/card-keys` (支持 `page`, `size`, `status` 筛选)
- **详情列表 (分页)**: `GET /api/card-keys/with-details` (支持 `page`, `size`, `keyword`, `specificationId`, `status` 筛选)
- **搜索卡密**: `GET /api/card-keys/search?cardKey={cardKey}`
- **验证卡密**: `GET /api/card-keys/verify/{cardKey}`
- **创建卡密**: `POST /api/card-keys`
- **激活卡密**: `POST /api/card-keys/activate`
- **禁用卡密**: `POST /api/card-keys/disable`
- **切换卡密状态**: `POST /api/card-keys/{cardKey}/status`
- **批量生成卡密**: `POST /api/card-keys/batch-generate`
- **获取统计**: `GET /api/card-keys/statistics`
- **删除指定卡密 (按ID)**: `DELETE /api/card-keys/{id}`
- **删除指定卡密 (按卡密)**: `DELETE /api/card-keys/by-card-key/{cardKey}`
- **批量删除已使用**: `DELETE /api/card-keys/batch-delete-used`

### 2. 公共接口 (无需认证)
- **验证并激活卡密**: `GET /api/public/card-keys/verify/{cardKey}`
- **功能**: 自动将"未使用"卡密转为"已使用"，并返回产品规格信息字符串（格式："产品名-规格名"）

---

## 用户管理 (Users)

### 1. 用户管理
- **查询列表**: `GET /api/users` (支持 `page`, `size`, `keyword`, `status` 筛选)
- **查询指定用户**: `GET /api/users/{id}`
- **创建用户**: `POST /api/users`
- **更新用户**: `PUT /api/users/{id}`
- **删除用户**: `DELETE /api/users/{id}`
- **重置用户密码**: `POST /api/users/reset-password`

---

## 公司与评论管理 (Companies & Reviews)

### 1. 公司管理
- **查询列表**: `GET /api/companies` (支持 `page`, `size`, `name` 筛选)
- **查询指定公司**: `GET /api/companies/{id}`
- **创建公司**: `POST /api/companies`
- **更新公司**: `PUT /api/companies/{id}`
- **删除公司**: `DELETE /api/companies/{id}`

### 2. 评论管理 (管理端)
- **查询列表**: `GET /api/boss-reviews` (支持 `page`, `size`, `companyId`, `cardKey` 筛选)
- **查询指定评论**: `GET /api/boss-reviews/{id}`
- **创建评论**: `POST /api/boss-reviews`
- **删除评论**: `DELETE /api/boss-reviews/{id}`

### 3. 公共评论接口
- **查询评论**: `GET /api/public/boss-reviews` (支持 `company_name`, `page`, `size` 筛选)
- **提交评论**: `POST /api/public/boss-reviews` (需提供有效卡密)

---

## 仪表盘与日志 (Dashboard & Logs)

### 1. 仪表盘统计
- **核心指标**: `GET /api/admin/stats` (包含当日销量、当日营收、昨日销量、昨日营收、总订单数、总营收、月度营收、上月营收、转化率)
- **销售分布**: `GET /api/admin/today-sales-distribution`

### 2. 操作日志
- **查询日志**: `GET /api/operation-logs` (支持按 `page`, `size`, `startDate`, `endDate`, `operationType` 筛选)
- **获取日志统计**: `GET /api/operation-logs/stats` (支持按 `startDate`, `endDate` 筛选)
- **按类型查询日志**: `GET /api/operation-logs/type/{operationType}`
- **清空日志**: `DELETE /api/operation-logs`
- **记录操作日志**: `POST /api/operation-logs` (支持 `operationType`, `description`, `ipAddress` 参数)
