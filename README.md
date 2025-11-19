# LeafCard - 卡密管理系统

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafCard?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafCard/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafCard?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafCard/network/members)
[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafCard?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafCard/issues)
[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafCard?style=for-the-badge)](https://github.com/YangShengzhou03/LeafCard/blob/main/LICENSE)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

**一个现代化的卡密管理系统，采用前后端分离架构**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [在线演示](#-在线演示) • [API文档](API_DOCUMENTATION.md)

</div>

## ✨ 功能特性

- **🎯 卡密管理** - 完整的卡密生命周期管理，支持创建、验证、激活、禁用
- **📦 产品管理** - 产品信息管理，支持多规格配置
- **📋 规格管理** - 灵活的规格定义，支持不同时长和价格的卡密
- **👥 管理员管理** - 管理员账户管理，支持权限控制
- **📊 数据统计** - 可视化数据报表，实时监控系统使用情况
- **📝 操作日志** - 完整的操作审计日志，追踪系统操作记录
- **🔒 安全认证** - JWT Token认证机制，保障系统安全
- **📱 响应式设计** - 支持PC、平板、手机等多端访问
- **⚡ 高性能** - 基于Spring Boot 3和Vue 3的高性能架构

## 🚀 快速开始

## 📋 环境要求

### 开发环境
- **Node.js**: 16.0+ (前端开发)
- **Java**: 17.0+ (后端开发)  
- **MySQL**: 8.0+ (数据库)
- **Maven**: 3.6+ (后端构建)

### 生产环境
- **服务器**: Linux/Windows Server
- **内存**: 2GB+ RAM
- **存储**: 1GB+ 可用空间

## 🛠️ 安装部署

### 1. 克隆项目
```bash
git clone https://github.com/YangShengzhou03/LeafCard.git
cd leaf-card
```

### 2. 后端部署

#### 配置数据库
```sql
-- 创建数据库
CREATE DATABASE leaf_card CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户并授权
CREATE USER 'leafcard_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON leaf_card.* TO 'leafcard_user'@'%';
FLUSH PRIVILEGES;

-- 执行初始化脚本
USE leaf_card;
SOURCE data.sql;
```

#### 配置应用
编辑 `backend/src/main/resources/application.properties`：
```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/leaf_card
spring.datasource.username=leafcard_user
spring.datasource.password=your_password

# JWT配置
jwt.secret=your-jwt-secret-key
jwt.expiration=86400

# 服务器配置
server.port=8081
server.servlet.context-path=/api
```

#### 启动后端服务
```bash
cd backend

# 编译项目
mvn clean package

# 运行应用
java -jar target/leaf-card-backend-1.0.0.jar
```

### 3. 前端部署

#### 安装依赖
```bash
cd frontend
npm install
```

#### 配置环境变量
编辑 `frontend/.env.development`：
```env
VUE_APP_API_BASE_URL=http://localhost:8081/api
VUE_APP_TITLE=LeafCard - 卡密管理系统
```

#### 启动前端服务
```bash
# 开发模式
npm run serve

# 或生产构建
npm run build
```

## 🎯 快速使用

### 1. 访问系统
- 前端地址: http://localhost:8080
- 后端API: http://localhost:8081/api

### 2. 默认账号
- **管理员**: admin@qq.com / 123456

### 3. 核心功能

#### 卡密管理
- 创建卡密批次
- 验证卡密有效性
- 查看卡密使用状态
- 批量导入/导出卡密

#### 产品管理
- 产品信息维护
- 产品规格配置
- 产品状态管理

#### 规格管理
- 规格定义和配置
- 不同时长和价格的卡密规格
- 规格状态管理

#### 管理员管理
- 管理员账户管理
- 管理员信息维护
- 权限控制

#### 操作日志
- 完整的操作审计
- 日志查询和统计
- 系统操作追踪

#### 数据统计
- 卡密使用统计
- 产品和规格统计
- 操作日志分析

## 🏗️ 技术架构

### 系统架构图
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端界面层     │    │   后端服务层     │    │   数据存储层     │
│                 │    │                 │    │                 │
│  Vue 3 +        │◄──►│ Spring Boot 3   │◄──►│   MySQL 8.0     │
│  Element Plus   │    │ MyBatis Plus + JWT │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   用户交互层     │    │   业务逻辑层     │    │   数据持久层     │
│                 │    │                 │    │                 │
│  组件化开发     │    │  服务层封装     │    │  Repository     │
│  响应式设计     │    │  事务管理       │    │  数据映射       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术栈详情

#### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.4.0 | 渐进式JavaScript框架 |
| Element Plus | 2.4.0 | 基于Vue 3的UI组件库 |
| Vue Router | 4.2.0 | 官方路由管理器 |
| Axios | 1.6.0 | HTTP客户端库 |
| Sass | 1.69.0 | CSS预处理器 |

#### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 3.1.0 | Java企业级开发框架 |
| MyBatis Plus | 3.5.4.1 | 数据持久层框架 |
| MySQL | 8.0.33 | 关系型数据库 |
| Maven | 3.6+ | 项目构建工具 |
| Java | 17.0+ | 开发语言 |
| JWT | 0.11.5 | JSON Web Token认证 |
| Guava | 32.1.2 | Google核心库 |

### 项目结构

```
leaf-card/
├── frontend/                          # 前端项目
│   ├── public/                        # 静态资源
│   │   ├── index.html                 # HTML模板
│   │   └── favicon.ico                # 网站图标
│   ├── src/                           # 源代码
│   │   ├── components/                # 公共组件
│   │   │   ├── Layout/                # 布局组件
│   │   │   ├── Card/                  # 卡密相关组件
│   │   │   ├── Product/               # 产品相关组件
│   │   │   ├── Specification/         # 规格相关组件
│   │   │   └── User/                  # 用户相关组件
│   │   ├── views/                     # 页面组件
│   │   │   ├── Dashboard.vue          # 仪表板
│   │   │   ├── CardManagement.vue     # 卡密管理
│   │   │   ├── ProductManagement.vue  # 产品管理
│   │   │   ├── SpecificationManagement.vue # 规格管理
│   │   │   ├── OperationLog.vue       # 操作日志
│   │   │   └── UserManagement.vue     # 用户管理
│   │   ├── router/                    # 路由配置
│   │   ├── services/                  # API服务
│   │   ├── utils/                     # 工具函数
│   │   ├── assets/                    # 静态资源
│   │   ├── store/                     # 状态管理
│   │   └── App.vue                    # 根组件
│   ├── package.json                   # 依赖配置
│   └── vue.config.js                  # Vue配置
├── backend/                           # 后端项目
│   ├── src/main/java/                 # Java源代码
│   │   ├── controller/                # 控制器层
│   │   │   ├── AuthController.java    # 认证控制器
│   │   │   ├── ProductController.java # 产品控制器
│   │   │   ├── SpecificationController.java # 规格控制器
│   │   │   ├── CardKeyController.java # 卡密控制器
│   │   │   ├── OperationLogController.java # 操作日志控制器
│   │   │   └── AdminController.java # 管理员控制器
│   │   ├── service/                   # 服务层
│   │   ├── repository/                # 数据访问层
│   │   ├── entity/                    # 实体类
│   │   ├── dto/                       # 数据传输对象
│   │   ├── config/                    # 配置类
│   │   ├── interceptor/               # 拦截器
│   │   ├── annotation/                # 自定义注解
│   │   ├── enums/                     # 枚举类
│   │   └── utils/                     # 工具类
│   ├── src/main/resources/            # 资源文件
│   │   ├── application.properties     # 应用配置
│   │   └── data.sql                   # 初始数据
│   └── pom.xml                        # Maven配置
├── docs/                              # 文档目录
│   ├── API_DOCUMENTATION.md           # API文档
│   └── DEPLOYMENT.md                  # 部署文档
└── README.md                          # 项目说明
```

## 🔧 开发指南

### 前端开发
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run serve

# 构建生产版本
npm run build

# 运行测试
npm run test
```

### 后端开发
```bash
# 进入后端目录
cd backend

# 编译项目
mvn clean compile

# 运行应用
mvn spring-boot:run

# 打包部署
mvn clean package

# 运行测试
mvn test
```

### 数据库初始化
系统使用MyBatis Plus进行数据访问，首次启动时需要：
1. 创建数据库（见上文配置）
2. 执行项目根目录下的`data.sql`脚本初始化表结构和数据
3. 系统会自动创建所需的数据表和初始管理员账户

## 🔗 API接口

详细的API接口文档请参考：[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### 认证接口示例
```javascript
// 用户登录
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin@leafcard.com",
  "password": "123456"
}
```

### 卡密管理接口示例
```javascript
// 获取卡密列表
GET /api/cards?page=1&size=10&status=ACTIVE
Authorization: Bearer {token}

// 创建卡密批次
POST /api/cards/batch
Authorization: Bearer {token}
Content-Type: application/json

{
  "batchName": "VIP会员卡",
  "count": 100,
  "value": 100.00,
  "expireDays": 365
}
```

### API 使用示例

#### 卡密验证核销示例

**验证卡密有效性（无需认证）：**
```bash
# 验证卡密并自动激活
curl -X GET "http://120.55.50.51/api/public/card-keys/verify/vD2Sbh1OXLLKPFBfB49JnCaV0atSlyQh"
```

**成功响应：**
```json
{
    "code": 200,
    "message": "验证成功",
    "data": {
        "productName": "VIP会员",
        "specificationName": "月卡",
        "durationDays": 30,
        "status": "已激活",
        "activateTime": "2024-01-15T14:30:00",
        "expireTime": "2024-02-14T14:30:00"
    }
}
```

### 管理员登录获取令牌：
```bash
curl -X POST "http://localhost:8081/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@qq.com",
    "password": "123456"
  }'
```

**获取产品列表（需要认证）：**
```bash
curl -X GET "http://localhost:8081/api/products" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**批量验证卡密脚本示例：**
```bash
#!/bin/bash
# 批量验证卡密
card_keys=("KEY1" "KEY2" "KEY3")
for key in "${card_keys[@]}"; do
  echo "验证卡密: $key"
  curl -s -X GET "http://120.55.50.51/api/public/card-keys/verify/$key"
  echo ""
  sleep 1

done
```

#### 开发指南

**前端开发：**
```bash
# 开发模式（带热重载）
npm run serve

# 代码检查
npm run lint

# 生产构建
npm run build
```

**后端开发：**
```bash
# 编译项目
mvn compile

# 运行测试
mvn test

# 打包部署
mvn clean package
```

#### 部署说明

**生产环境部署：**

1. **前端部署**
   - 执行 `npm run build` 生成 dist 目录
   - 配置 Nginx 指向 dist 目录
   - 设置 API 代理到后端服务

2. **后端部署**
   - 使用 `mvn clean package` 生成 jar 包
   - 使用 systemd 或 Docker 部署
   - 配置生产环境数据库连接

**Docker 部署（可选）：**
```dockerfile
# 前端 Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/

# 后端 Dockerfile
FROM openjdk:17-jre-slim
COPY target/leaf-card-backend-1.0.0.jar /app.jar
```

#### 参与贡献

我们欢迎任何形式的贡献！

1. **Fork 本仓库**
2. **新建功能分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **提交代码**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **新建 Pull Request**

**贡献指南：**
- 遵循代码规范
- 编写清晰的提交信息
- 添加适当的测试用例
- 更新相关文档

## 📋 版本历史

### 📊 发布概览

| 版本 | 发布日期 | 主要特性 |
|------|----------|----------|
| **v1.2.0** | 2024-03-15 | 优化前端性能，增强数据可视化功能 |
| **v1.1.0** | 2024-02-20 | 添加批量操作功能，改进用户界面 |
| **v1.0.0** | 2024-01-01 | 初始版本发布，基础卡管理和用户认证 |

### 📝 详细变更日志

#### v1.2.0 (2024-03-15)
- ✨ 新增数据可视化图表组件
- 🚀 优化前端打包体积，减少30%加载时间
- 🔧 改进API响应格式和错误处理
- 📱 增强移动端适配体验

#### v1.1.0 (2024-02-20)
- ✨ 新增批量卡管理功能
- 🎨 优化UI设计，提升用户体验
- 🔒 增强安全验证机制
- 📊 改进统计报表功能

#### v1.0.0 (2024-01-01)
- 🎉 初始版本发布
- 🔐 完整的用户认证系统
- 💳 基础卡管理功能
- 📈 基础数据统计功能

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- **GitHub 仓库**: [https://github.com/YangShengzhou03/LeafCard](https://github.com/YangShengzhou03/LeafCard)
- **问题反馈**: [GitHub Issues](https://github.com/YangShengzhou03/LeafCard/issues)
- **邮箱**: dev@leafcard.com
- **项目主页**: [https://github.com/YangShengzhou03/LeafCard](https://github.com/YangShengzhou03/LeafCard)

## 📊 项目统计

![GitHub Release](https://img.shields.io/github/v/release/YangShengzhou03/LeafCard?style=flat-square)
![GitHub Last Commit](https://img.shields.io/github/last-commit/YangShengzhou03/LeafCard?style=flat-square)
![GitHub Contributors](https://img.shields.io/github/contributors/YangShengzhou03/LeafCard?style=flat-square)
![GitHub Repo Size](https://img.shields.io/github/repo-size/YangShengzhou03/LeafCard?style=flat-square)

---

**感谢使用 LeafCard！** 🍁

<div align="center">

如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！

[![Star History Chart](https://api.star-history.com/svg?repos=YangShengzhou03/LeafCard&type=Date)](https://star-history.com/#YangShengzhou03/LeafCard&Date)

</div>
