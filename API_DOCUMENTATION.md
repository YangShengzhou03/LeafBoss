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
- **请求体**: 管理员/用户实体对象。

### 4. 修改当前用户密码
- **URL**: `/api/auth/password`
- **Method**: `PUT`
- **请求体**: `{"newPassword": "新密码"}`

### 5. 获取存储配额信息
- **URL**: `/api/auth/storage`
- **Method**: `GET`
- **功能**: 获取系统存储统计信息。

### 6. 管理员注册 (公共)
- **URL**: `/api/auth/register`
- **Method**: `POST`

---

## 管理员管理 (Admins)

仅限超级管理员调用，用于管理后台账号。

### 1. 分页查询管理员列表
- **URL**: `/api/admins`
- **Method**: `GET`
- **参数**: `page`, `size`, `keyword`, `status`

### 2. 创建管理员
- **URL**: `/api/admins`
- **Method**: `POST`

### 3. 更新指定管理员信息
- **URL**: `/api/admins/{id}`
- **Method**: `PUT`

### 4. 删除管理员
- **URL**: `/api/admins/{id}`
- **Method**: `DELETE`

### 5. 重置管理员密码 (管理员操作)
- **URL**: `/api/admins/admin-reset-password`
- **Method**: `POST`

### 6. 发送/验证重置码
- **URL**: `/api/admins/send-reset-code` / `/api/admins/reset-password`
- **Method**: `POST`

---

## 商品与规格管理 (Products & Specifications)

### 1. 商品管理
- **查询列表**: `GET /api/products` (支持 `keyword`, `status` 筛选)
- **创建商品**: `POST /api/products`
- **更新商品**: `PUT /api/products/{id}`
- **删除商品**: `DELETE /api/products/{id}`

### 2. 规格管理
- **查询规格 DTO (分页)**: `GET /api/specifications/dto/pagination`
- **查询规格 DTO (全量)**: `GET /api/specifications/dto`
- **创建规格**: `POST /api/specifications`
- **更新规格**: `PUT /api/specifications/{id}`
- **删除规格**: `DELETE /api/specifications/{id}`

---

## 卡密管理 (Card Keys)

### 1. 管理端接口
- **详情列表 (分页)**: `GET /api/card-keys/with-details`
- **创建卡密**: `POST /api/card-keys`
- **禁用卡密**: `POST /api/card-keys/disable`
- **批量删除已使用**: `DELETE /api/card-keys/batch-delete-used`
- **删除指定卡密**: `DELETE /api/card-keys/by-card-key/{key}`

### 2. 公共接口 (无需认证)
- **验证并激活卡密**: `GET /api/public/card-keys/verify/{key}`
- **功能**: 自动将“未使用”卡密转为“已使用”，并返回关联的产品信息。

---

## 公司与评论管理 (Companies & Reviews)

### 1. 公司管理
- **接口**: `GET/POST/PUT/DELETE /api/companies`

### 2. 评论管理 (管理端)
- **接口**: `GET/POST/DELETE /api/boss-reviews`

### 3. 公共评论接口
- **查询**: `GET /api/public/boss-reviews`
- **提交**: `POST /api/public/boss-reviews` (需提供有效卡密)

---

## 仪表盘与日志 (Dashboard & Logs)

### 1. 仪表盘统计
- **核心指标**: `GET /api/admin/stats` (包含库存、当日销售、月度营收)
- **销售分布**: `GET /api/admin/today-sales-distribution`

### 2. 操作日志
- **查询日志**: `GET /api/operation-logs` (支持按日期、类型筛选)
- **清空日志**: `DELETE /api/operation-logs`
- **注意**: 日志导出功能已移除。
