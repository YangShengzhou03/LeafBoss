# LeafBoss API 文档

## 基础信息

### 环境配置

- **开发环境**: http://localhost:8081
- **前端服务**: http://localhost:8080
- **字符编码**: UTF-8
- **时间格式**: yyyy-MM-dd HH:mm:ss
- **时区**: Asia/Shanghai

### 通用响应格式

#### 成功响应
```json
{
    "code": 200,
    "message": "success",
    "data": {}
}
```

#### 错误响应
```json
{
    "code": 400,
    "message": "参数错误",
    "data": null
}
```

#### 分页响应
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [],
        "total": 100,
        "size": 10,
        "current": 1,
        "pages": 10
    }
}
```

---

## 公共 API（无需认证）

### 卡密验证接口

#### 验证并激活卡密

**接口地址**: `GET /api/public/card-keys/verify/{cardKey}`

**功能说明**: 验证安装卡密，验证成功时自动激活（未使用→已使用）

**请求示例**:
```bash
curl -X GET "http://localhost:8081/api/public/card-keys/verify/vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh"
```

**成功响应示例**:
```json
{
    "code": 200,
    "message": "验证成功",
    "data": "VIP会员-月卡"
}
```

**失败响应示例**:
```json
{
    "code": 404,
    "message": "卡密不存在，请检查卡密是否正确或获取有效卡密",
    "data": null
}
```

**失败响应（卡密已被使用）**:
```json
{
    "code": 400,
    "message": "该卡密已被使用，请确认是否已在其他设备使用",
    "data": null
}
```

**失败响应（卡密已禁用）**:
```json
{
    "code": 400,
    "message": "该卡密已被禁用，请联系开发者了解原因",
    "data": null
}
```

---

### 评论管理接口

#### 创建评论

**接口地址**: `POST /api/public/boss-reviews`

**功能说明**: 用户通过卡密和公司名发表评论，每个卡密只能对每个公司评论一次

**请求参数**:
```json
{
    "card_key": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
    "company_name": "测试公司",
    "content": "非常好的服务"
}
```

**请求示例**:
```bash
curl -X POST "http://localhost:8081/api/public/boss-reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "card_key": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
    "company_name": "杨圣洲",
    "content": "服务非常好，推荐！"
  }'
```

**成功响应示例**:
```json
{
    "code": 200,
    "message": "评论发布成功",
    "data": true
}
```

**失败响应示例**:
```json
{
    "code": 400,
    "message": "该卡密未使用，无法发表评论",
    "data": null
}
```

#### 查询公司评论

**接口地址**: `GET /api/public/boss-reviews`

**功能说明**: 根据公司名称查询该公司的所有评论，支持分页

**查询参数**:
- `company_name` (必填): 公司名称
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10

**请求示例**:
```bash
curl -X GET "http://localhost:8081/api/public/boss-reviews?company_name=杨圣洲&page=1&size=10"
```

**成功响应示例**:
```json
{
    "code": 200,
    "message": "评论列表查询成功",
    "data": {
        "page": 1,
        "size": 10,
        "total": 1,
        "records": [
            {
                "id": 1,
                "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
                "companyId": 1,
                "companyName": "杨圣洲",
                "content": "服务非常好，推荐！",
                "createdAt": "2024-01-15T14:30:00"
            }
        ]
    }
}
```

**失败响应示例**:
```json
{
    "code": 400,
    "message": "公司名不能为空",
    "data": null
}
```

---

## 认证管理 API

### 用户登录

**接口地址**: `POST /api/auth/login`

**请求参数**:
```json
{
    "email": "admin@qq.com",
    "password": "123456"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "username": "admin",
            "email": "admin@qq.com",
            "status": "active",
            "lastLoginTime": "2024-01-15T14:30:00",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-15T14:30:00"
        }
    }
}
```

### 获取当前用户信息

**接口地址**: `GET /api/auth/me`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "admin",
        "email": "admin@qq.com",
        "status": "active",
        "lastLoginTime": "2024-01-15T14:30:00",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T14:30:00"
    }
}
```

### 更新当前用户信息

**接口地址**: `PUT /api/auth/me`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "updated_admin@qq.com",
    "username": "updated_admin",
    "status": "active",
    "lastLoginTime": "2024-01-15T14:30:00",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-15T14:30:00"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "用户信息更新成功",
    "data": true
}
```

### 用户注册

**接口地址**: `POST /api/auth/register`

**请求参数**:
```json
{
    "email": "newuser@qq.com",
    "username": "newuser",
    "password": "123456",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "注册成功",
    "data": true
}
```

### 用户登出

**接口地址**: `POST /api/auth/logout`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "登出成功",
    "data": true
}
```

---

## 管理员管理 API

### 管理员登录

**接口地址**: `POST /api/admins/login`

**请求参数**:
```json
{
    "email": "admin@qq.com",
    "password": "123456"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "username": "admin",
            "email": "admin@qq.com",
            "status": "active",
            "lastLoginTime": "2024-01-15T14:30:00",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-15T14:30:00"
        }
    }
}
```

### 获取管理员列表

**接口地址**: `GET /api/admins`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `keyword` (可选): 关键词（用户名或邮箱）
- `status` (可选): 状态

**响应示例**:
```json
{
    "code": 200,
    "message": "管理员列表查询成功",
    "data": {
        "page": 1,
        "size": 10,
        "total": 1,
        "records": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "username": "admin",
                "email": "admin@qq.com",
                "status": "active",
                "lastLoginTime": "2024-01-15T14:30:00",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-15T14:30:00"
            }
        ]
    }
}
```

### 获取管理员详情

**接口地址**: `GET /api/admins/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "admin",
        "email": "admin@qq.com",
        "status": "active",
        "lastLoginTime": "2024-01-15T14:30:00",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T14:30:00"
    }
}
```

### 创建管理员

**接口地址**: `POST /api/admins`

**请求参数**:
```json
{
    "email": "newadmin@qq.com",
    "username": "newadmin",
    "passwordHash": "123456",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "管理员创建成功",
    "data": true
}
```

### 更新管理员

**接口地址**: `PUT /api/admins/{id}`

**请求参数**:
```json
{
    "email": "updated_admin@qq.com",
    "username": "updated_admin",
    "passwordHash": "new_password",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "管理员更新成功",
    "data": true
}
```

### 删除管理员

**接口地址**: `DELETE /api/admins/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "管理员删除成功",
    "data": true
}
```

### 根据用户名获取管理员

**接口地址**: `GET /api/admins/username/{username}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "admin",
        "email": "admin@qq.com",
        "status": "active",
        "lastLoginTime": "2024-01-15T14:30:00",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T14:30:00"
    }
}
```

### 重置管理员密码（需要验证码）

**接口地址**: `POST /api/admins/reset-password`

**请求参数**:
```json
{
    "email": "admin@qq.com",
    "verificationCode": "123456",
    "newPassword": "newpassword123"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "密码重置成功",
    "data": true
}
```

### 管理员直接重置用户密码（无需验证码）

**接口地址**: `POST /api/admins/admin-reset-password`

**请求参数**:
```json
{
    "email": "admin@qq.com",
    "newPassword": "newpassword123"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "密码重置成功",
    "data": true
}
```

### 发送重置密码验证码

**接口地址**: `POST /api/admins/send-reset-code`

**请求参数**:
```json
{
    "email": "admin@qq.com"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "验证码已发送，请输入123456",
    "data": true
}
```

### 获取管理员统计信息

**接口地址**: `GET /api/admins/statistics`

**响应示例**:
```json
{
    "code": 200,
    "message": "统计信息获取成功",
    "data": {
        "totalAdmins": 5,
        "recentAdmins": 2,
        "activeAdmins": 4
    }
}
```

### 获取当前用户信息

**接口地址**: `GET /api/admins/info`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "admin",
        "email": "admin@qq.com",
        "status": "active",
        "lastLoginTime": "2024-01-15T14:30:00",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T14:30:00"
    }
}
```

### 更新当前用户信息

**接口地址**: `PUT /api/admins/info`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "username": "admin",
    "email": "admin@qq.com",
    "password": "newpassword"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "用户信息更新成功",
    "data": true
}
```

### 修改当前用户密码

**接口地址**: `PUT /api/admins/password`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "oldPassword": "123456",
    "newPassword": "newpassword"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "密码修改成功",
    "data": true
}
```

---

## 用户管理 API

### 获取用户列表

**接口地址**: `GET /api/users`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `keyword` (可选): 关键词
- `status` (可选): 状态

**响应示例**:
```json
{
    "code": 200,
    "message": "用户列表查询成功",
    "data": {
        "page": 1,
        "size": 10,
        "total": 1,
        "records": [
            {
                "id": "1",
                "username": "user1",
                "email": "user1@qq.com",
                "status": "active",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ]
    }
}
```

### 获取用户详情

**接口地址**: `GET /api/users/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": "1",
        "username": "user1",
        "email": "user1@qq.com",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 创建用户

**接口地址**: `POST /api/users`

**请求参数**:
```json
{
    "username": "newuser",
    "email": "newuser@qq.com",
    "passwordHash": "123456",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "用户创建成功",
    "data": true
}
```

### 更新用户

**接口地址**: `PUT /api/users/{id}`

**请求参数**:
```json
{
    "username": "updateduser",
    "email": "updateduser@qq.com",
    "passwordHash": "newpassword",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "用户更新成功",
    "data": true
}
```

### 删除用户

**接口地址**: `DELETE /api/users/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "用户删除成功",
    "data": true
}
```

### 重置用户密码

**接口地址**: `POST /api/users/reset-password`

**请求参数**:
```json
{
    "email": "user@qq.com",
    "newPassword": "newpassword123"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "密码重置成功",
    "data": true
}
```

---

## 卡密管理 API

### 获取卡密列表

**接口地址**: `GET /api/card-keys`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `status` (可选): 状态

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
                "specificationId": 1,
                "status": "未使用",
                "userEmail": null,
                "userId": null,
                "activateTime": null,
                "expireTime": null,
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 100,
        "size": 10,
        "current": 1,
        "pages": 10
    }
}
```

### 获取卡密列表（带详情）

**接口地址**: `GET /api/card-keys/with-details`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `keyword` (可选): 关键词
- `specificationId` (可选): 规格ID
- `status` (可选): 状态

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
                "specificationId": 1,
                "specificationName": "月卡",
                "productId": 1,
                "productName": "VIP会员",
                "status": "未使用",
                "price": 29.9,
                "durationDays": 30,
                "createdAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 100,
        "size": 10,
        "current": 1,
        "pages": 10
    }
}
```

### 搜索卡密

**接口地址**: `GET /api/card-keys/search`

**查询参数**:
- `cardKey` (必填): 卡密

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
        "specificationId": 1,
        "status": "未使用",
        "createdAt": "2024-01-01T00:00:00"
    }
}
```

### 验证卡密

**接口地址**: `GET /api/card-keys/verify/{cardKey}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
        "specificationId": 1,
        "status": "未使用",
        "specificationName": "月卡",
        "productName": "VIP会员",
        "productSpec": "VIP会员-月卡",
        "price": 29.9,
        "durationDays": 30
    }
}
```

### 激活卡密

**接口地址**: `POST /api/card-keys/activate`

**请求参数**:
```json
{
    "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密激活成功",
    "data": true
}
```

### 禁用卡密

**接口地址**: `POST /api/card-keys/disable`

**请求参数**:
```json
{
    "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密禁用成功",
    "data": true
}
```

### 删除卡密（通过ID）

**接口地址**: `DELETE /api/card-keys/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密删除成功",
    "data": true
}
```

### 删除卡密（通过卡密）

**接口地址**: `DELETE /api/card-keys/by-card-key/{cardKey}`

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密删除成功",
    "data": true
}
```

### 批量生成卡密

**接口地址**: `POST /api/card-keys/batch-generate`

**请求参数**:
```json
{
    "productId": "1",
    "quantity": 100,
    "prefix": "VIP"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "批量生成卡密成功",
    "data": true
}
```

### 创建卡密

**接口地址**: `POST /api/card-keys`

**请求参数**:
```json
{
    "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
    "specificationId": 1,
    "status": "未使用"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密创建成功",
    "data": true
}
```

### 切换卡密状态

**接口地址**: `POST /api/card-keys/{cardKey}/status`

**请求参数**:
```json
{
    "status": "已使用"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密状态更新成功",
    "data": true
}
```

### 批量删除已使用卡密

**接口地址**: `DELETE /api/card-keys/batch-delete-used`

**响应示例**:
```json
{
    "code": 200,
    "message": "已使用卡密批量删除成功",
    "data": true
}
```

### 获取卡密统计信息

**接口地址**: `GET /api/card-keys/statistics`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalCardKeys": 1000,
        "unusedCardKeys": 500,
        "usedCardKeys": 400,
        "disabledCardKeys": 100
    }
}
```

---

## 评论管理 API

### 获取评论列表

**接口地址**: `GET /api/boss-reviews`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `companyId` (可选): 公司ID
- `cardKey` (可选): 卡密

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
                "companyId": 1,
                "content": "服务非常好，推荐！",
                "createdAt": "2024-01-15T14:30:00"
            }
        ],
        "total": 100,
        "size": 10,
        "current": 1,
        "pages": 10
    }
}
```

### 获取评论详情

**接口地址**: `GET /api/boss-reviews/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
        "companyId": 1,
        "content": "服务非常好，推荐！",
        "createdAt": "2024-01-15T14:30:00"
    }
}
```

### 创建评论

**接口地址**: `POST /api/boss-reviews`

**请求参数**:
```json
{
    "cardKey": "vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh",
    "companyId": 1,
    "content": "服务非常好，推荐！"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "评论发布成功",
    "data": true
}
```

### 删除评论

**接口地址**: `DELETE /api/boss-reviews/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "评论删除成功",
    "data": true
}
```

---

## 公司管理 API

### 获取公司列表

**接口地址**: `GET /api/companies`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `name` (可选): 公司名称

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "name": "测试公司",
                "commentCount": 10,
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 100,
        "size": 10,
        "current": 1,
        "pages": 10
    }
}
```

### 获取公司详情

**接口地址**: `GET /api/companies/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "测试公司",
        "commentCount": 10,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 创建公司

**接口地址**: `POST /api/companies`

**请求参数**:
```json
{
    "name": "新公司",
    "commentCount": 0
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "公司创建成功",
    "data": true
}
```

### 更新公司

**接口地址**: `PUT /api/companies/{id}`

**请求参数**:
```json
{
    "name": "更新后的公司名",
    "commentCount": 10
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "公司更新成功",
    "data": true
}
```

### 删除公司

**接口地址**: `DELETE /api/companies/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "公司删除成功",
    "data": true
}
```

---

## 产品管理 API

### 分页查询产品列表

**接口地址**: `GET /api/products`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `category` (可选): 产品分类
- `status` (可选): 产品状态

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "name": "VIP会员",
                "description": "VIP会员专属权益，享受高级服务",
                "category": "virtual",
                "status": "active",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 5,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 根据ID查询产品

**接口地址**: `GET /api/products/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "VIP会员",
        "description": "VIP会员专属权益，享受高级服务",
        "category": "virtual",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 创建产品

**接口地址**: `POST /api/products`

**请求参数**:
```json
{
    "name": "新产品",
    "description": "新产品描述",
    "category": "virtual",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "产品创建成功",
    "data": true
}
```

### 更新产品

**接口地址**: `PUT /api/products/{id}`

**请求参数**:
```json
{
    "id": "1",
    "name": "更新后的产品名",
    "description": "更新后的描述",
    "category": "virtual",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "产品更新成功",
    "data": true
}
```

### 删除产品

**接口地址**: `DELETE /api/products/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "产品删除成功",
    "data": true
}
```

### 获取产品统计信息

**接口地址**: `GET /api/products/statistics`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalProducts": 10,
        "activeProducts": 8,
        "inactiveProducts": 2,
        "virtualProducts": 6,
        "physicalProducts": 4
    }
}
```

### 根据分类获取产品

**接口地址**: `GET /api/products/category/{category}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "VIP会员",
            "description": "VIP会员专属权益，享受高级服务",
            "category": "virtual",
            "status": "active",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00"
        }
    ]
}
```

---

## 规格管理 API

### 分页查询规格列表

**接口地址**: `GET /api/specifications`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `keyword` (可选): 关键词
- `productId` (可选): 产品ID

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "productId": 1,
                "name": "月卡",
                "description": "VIP会员专属月卡，享受专属权益",
                "durationDays": 30,
                "price": 29.9,
                "stockQuantity": 1000,
                "status": "active",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 8,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 根据ID查询规格

**接口地址**: `GET /api/specifications/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "productId": 1,
        "name": "月卡",
        "description": "VIP会员专属月卡，享受专属权益",
        "durationDays": 30,
        "price": 29.9,
        "stockQuantity": 1000,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 根据产品ID查询规格列表

**接口地址**: `GET /api/specifications/product/{productId}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "productId": 1,
            "name": "月卡",
            "description": "VIP会员专属月卡，享受专属权益",
            "durationDays": 30,
            "price": 29.9,
            "stockQuantity": 1000,
            "status": "active",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 根据状态查询规格列表

**接口地址**: `GET /api/specifications/status/{status}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "productId": 1,
            "name": "月卡",
            "description": "VIP会员专属月卡，享受专属权益",
            "durationDays": 30,
            "price": 29.9,
            "stockQuantity": 1000,
            "status": "active",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 创建规格

**接口地址**: `POST /api/specifications`

**请求参数**:
```json
{
    "productId": 1,
    "name": "季卡",
    "description": "VIP会员专属季卡，享受专属权益",
    "durationDays": 90,
    "price": 79.9,
    "stockQuantity": 500,
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "规格创建成功",
    "data": true
}
```

### 更新规格

**接口地址**: `PUT /api/specifications/{id}`

**请求参数**:
```json
{
    "id": "1",
    "productId": 1,
    "name": "更新后的规格名",
    "description": "更新后的描述",
    "durationDays": 60,
    "price": 49.9,
    "stockQuantity": 800,
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "规格更新成功",
    "data": true
}
```

### 删除规格

**接口地址**: `DELETE /api/specifications/{id}`

**响应示例**:
```json
{
    "code": 200,
    "message": "规格删除成功",
    "data": true
}
```

### 获取规格统计信息

**接口地址**: `GET /api/specifications/statistics`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalSpecifications": 15,
        "activeSpecifications": 12,
        "inactiveSpecifications": 3
    }
}
```

### 获取规格DTO列表

**接口地址**: `GET /api/specifications/dto`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "productId": 1,
            "productName": "VIP会员",
            "name": "月卡",
            "description": "VIP会员专属月卡",
            "durationDays": 30,
            "price": 29.9,
            "stockQuantity": 1000,
            "status": "active"
        }
    ]
}
```

### 分页获取规格DTO列表

**接口地址**: `GET /api/specifications/dto/pagination`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `keyword` (可选): 关键词
- `productId` (可选): 产品ID

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "productId": 1,
                "productName": "VIP会员",
                "name": "月卡",
                "description": "VIP会员专属月卡",
                "durationDays": 30,
                "price": 29.9,
                "stockQuantity": 1000,
                "status": "active"
            }
        ],
        "total": 15,
        "size": 10,
        "current": 1,
        "pages": 2
    }
}
```

---

## 操作日志管理 API

### 获取操作日志列表

**接口地址**: `GET /api/operation-logs`

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `startDate` (可选): 开始日期 (yyyy-MM-dd)
- `endDate` (可选): 结束日期 (yyyy-MM-dd)
- `operationType` (可选): 操作类型

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "operationType": "LOGIN",
                "description": "管理员登录成功",
                "ipAddress": "192.168.1.100",
                "createdAt": "2024-01-15T14:30:00"
            }
        ],
        "total": 100,
        "size": 10,
        "current": 1,
        "pages": 10
    }
}
```

### 获取日志统计信息

**接口地址**: `GET /api/operation-logs/stats`

**查询参数**:
- `startDate` (可选): 开始日期 (yyyy-MM-dd)
- `endDate` (可选): 结束日期 (yyyy-MM-dd)

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalCount": 150,
        "typeStats": {
            "LOGIN": 45,
            "CARD_KEY": 60,
            "PRODUCT": 20,
            "SPECIFICATION": 15,
            "USER": 8,
            "SYSTEM": 2
        }
    }
}
```

### 根据操作类型查询操作日志

**接口地址**: `GET /api/operation-logs/type/{operationType}`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "operationType": "LOGIN",
            "description": "管理员登录成功",
            "ipAddress": "192.168.1.100",
            "createdAt": "2024-01-15T14:30:00"
        }
    ]
}
```

### 导出操作日志

**接口地址**: `GET /api/operation-logs/export`

**查询参数**:
- `startDate` (可选): 开始日期 (yyyy-MM-dd)
- `endDate` (可选): 结束日期 (yyyy-MM-dd)

**响应**: 返回Excel文件下载

### 清空操作日志

**接口地址**: `DELETE /api/operation-logs`

**响应示例**:
```json
{
    "code": 200,
    "message": "日志清空成功",
    "data": true
}
```

### 记录操作日志

**接口地址**: `POST /api/operation-logs`

**请求参数**:
```json
{
    "operationType": "操作类型",
    "description": "操作描述",
    "ipAddress": "IP地址"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "操作日志记录成功",
    "data": true
}
```

---

## 仪表盘 API

### 获取仪表盘统计信息

**接口地址**: `GET /api/admin/stats`

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "dailySales": 10,
        "dailyRevenue": 299.0,
        "yesterdaySales": 8,
        "yesterdayRevenue": 239.2,
        "totalOrders": 1000,
        "totalRevenue": 29900.0,
        "monthlyRevenue": 5000.0,
        "lastMonthRevenue": 4500.0,
        "conversionRate": 0.0
    }
}
```

---

## 用户个人中心 API

### 获取存储信息

**接口地址**: `GET /api/user/storage`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "storageQuota": 1073741824,
        "usedStorage": 104857600,
        "availableStorage": 968884224,
        "usagePercentage": 10
    }
}
```

### 更新个人资料

**接口地址**: `PUT /api/user/profile`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "username": "admin",
    "email": "admin@qq.com"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "用户信息更新成功",
    "data": true
}
```

### 更新密码

**接口地址**: `PUT /api/user/password`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "oldPassword": "123456",
    "newPassword": "newpassword"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "密码更新成功",
    "data": true
}
```
