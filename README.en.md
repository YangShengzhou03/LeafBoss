# LEAF-BOSS - 业务运营支撑系统

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/stargazers)&nbsp;[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/network/members)&nbsp;[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/issues)&nbsp;[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafBoss?style=for-the-badge)](https://github.com/YangShengzhou03/LeafBoss/blob/main/LICENSE)&nbsp;[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)&nbsp;[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

**一个现代化的业务运营支撑系统，采用前后端分离架构**

[快速开始](#-快速开始) • [功能特性](#-功能特性) • [在线演示](#-在线演示) • [API文档](API_DOCUMENTATION.md)

</div>

## 功能特性

LeafBoss 是一个功能完善的业务运营支撑系统，提供了全方位的业务管理功能。系统支持完整的卡密生命周期管理，包括卡密的创建、验证、激活和禁用等操作，让卡密管理变得简单高效。产品管理模块支持产品信息维护和多规格配置，可以灵活定义不同产品的属性和特性。规格管理功能允许管理员灵活定义各种授权方案，支持不同时长和价格组合的规格配置，满足多样化的业务需求。

公司管理模块提供了公司信息的完整维护功能，包括公司基本信息、状态管理以及评论统计等功能，帮助企业更好地了解客户反馈。评论管理系统支持用户评论的查看和管理，管理员可以按公司和卡密进行筛选评论，并可以对不当评论进行删除处理。人员管理方面，系统提供了管理员账户管理和客户用户管理两大模块，支持权限控制、状态管理以及用户查询和筛选等操作，确保系统的安全性和可管理性。

数据统计功能提供了可视化的数据报表，可以实时监控系统的使用情况，包括卡密使用统计、产品和规格统计以及操作日志分析等，为管理决策提供数据支持。操作日志模块记录了系统中的所有操作记录，提供完整的操作审计功能，支持日志查询和统计，帮助管理员追踪系统操作记录，保障系统的安全性。系统采用JWT Token认证机制，确保用户身份的安全验证，同时支持响应式设计，可以在PC、平板、手机等多种设备上正常使用，基于Spring Boot 3和Vue 3的高性能架构保证了系统的稳定性和响应速度。

### 系统界面预览

![LEAF-BOSS 业务运营支撑系统](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Overview.png)

![LEAF-BOSS 登录页面](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Login.png)

## 快速开始

### 环境要求

在开始使用 LeafBoss 之前，需要确保您的开发环境满足以下要求。开发环境方面，前端开发需要 Node.js 16.0 或更高版本，后端开发需要 Java 17.0 或更高版本，数据库使用 MySQL 8.0 或更高版本，后端构建需要 Maven 3.6 或更高版本。生产环境方面，服务器可以运行 Linux 系统，建议配置 2GB 或更多的内存，以及至少 1GB 的可用存储空间。确保这些环境要求满足后，就可以开始安装和部署 LeafBoss 系统了。

### 安装部署

安装部署 LeafBoss 系统需要按照以下步骤进行操作。首先需要克隆项目到本地，使用 `git clone https://github.com/YangShengzhou03/LeafBoss.git` 命令克隆仓库，然后进入项目目录。后端部署需要先配置数据库，创建名为 leaf_boss 的数据库，字符集设置为 utf8mb4，然后执行初始化脚本 data.sql。接着需要配置应用，编辑 backend/src/main/resources/application.yml 文件，设置数据库连接信息、JWT密钥和过期时间以及服务器端口等参数。最后启动后端服务，进入 backend 目录，执行 mvn clean package 编译项目，然后使用 java -jar target/leaf-boss-backend.jar 运行应用。

前端部署相对简单，首先进入 frontend 目录，执行 npm install 安装项目依赖。然后需要配置环境变量，编辑 frontend/.env.development 文件，设置 API 基础地址和应用标题等参数。最后启动前端服务，开发模式下执行 npm run serve 即可启动开发服务器，生产环境则执行 npm run build 构建生产版本。完成这些步骤后，系统就可以正常运行了。

### 快速使用

系统部署完成后，可以通过浏览器访问前端地址 http://localhost:8080 进入系统，后端 API 地址为 http://localhost:8081/api。系统默认提供了一个管理员账户，邮箱为 admin@qq.com，密码为 123456，使用这个账户可以登录系统并访问所有管理功能。登录成功后，管理员可以访问系统的各种功能模块，包括卡密管理、产品管理、规格管理、公司管理、评论管理、管理员管理、客户用户管理、操作日志和数据统计等核心功能。

卡密管理模块支持创建卡密批次、验证卡密有效性、查看卡密使用状态以及批量导入导出卡密等功能。产品管理模块提供产品信息维护、产品规格配置和产品状态管理等功能。规格管理模块支持规格定义和配置，可以设置不同时长和价格的授权方案，并管理规格状态。公司管理模块提供公司信息维护、公司评论统计和公司状态管理等功能。评论管理模块支持用户评论查看，可以按公司和卡密进行筛选评论，并支持评论删除管理。

管理员管理模块提供管理员账户管理、管理员信息维护和权限控制等功能。客户用户管理模块支持客户用户信息维护、用户状态管理以及用户查询和筛选等操作。操作日志模块提供完整的操作审计功能，支持日志查询和统计，帮助追踪系统操作记录。数据统计模块提供卡密使用统计、产品和规格统计以及操作日志分析等功能，为管理决策提供数据支持。系统还提供了直观的管理员仪表盘，可以快速查看系统的整体运行情况。

![LEAF-BOSS 管理员仪表盘](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Dashboard.png)

![LEAF-BOSS 商品管理](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Product-Management.png)

![LEAF-BOSS 管理人员](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Admin-Management.png)

## 系统架构

LeafBoss 采用经典的三层架构设计，包括前端界面层、后端服务层和数据存储层。前端界面层使用 Vue 3 和 Element Plus 构建，提供友好的用户交互界面，支持组件化开发和响应式设计，确保在不同设备上都有良好的用户体验。后端服务层基于 Spring Boot 3 框架，使用 MyBatis Plus 进行数据访问，采用 JWT Token 进行用户认证，提供完整的业务逻辑处理和事务管理功能。数据存储层使用 MySQL 8.0 数据库，通过 Repository 模式进行数据映射和持久化操作，确保数据的安全性和一致性。

前端技术栈包括 Vue 3.4.0 作为渐进式 JavaScript 框架，Element Plus 2.4.0 作为基于 Vue 3 的 UI 组件库，Vue Router 4.2.0 作为官方路由管理器，Axios 1.6.0 作为 HTTP 客户端库，Sass 1.69.0 作为 CSS 预处理器。后端技术栈包括 Spring Boot 3.1.0 作为 Java 企业级开发框架，MyBatis Plus 3.5.4.1 作为数据持久层框架，MySQL 8.0.33 作为关系型数据库，Maven 3.6+ 作为项目构建工具，Java 17.0+ 作为开发语言，JWT 0.11.5 作为 JSON Web Token 认证工具。

项目结构分为前端和后端两个主要部分。前端项目包含 public 静态资源目录和 src 源代码目录，src 目录下包含 components 公共组件、views 页面组件、route 路由配置、services API 服务和 utils 工具函数等模块。后端项目包含 src/main/java Java 源代码目录和 src/main/resources 资源文件目录，Java 源代码目录下包含 controller 控制器层、service 服务层、mapper 数据访问层、entity 实体类、dto 数据传输对象、config 配置类、common 公共类和 utils 工具类等模块。这种清晰的分层架构使得系统易于维护和扩展。

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

## 开发指南

### 前端开发

前端开发需要进入 frontend 目录，首先执行 npm install 安装项目依赖，然后可以使用 npm run serve 启动开发服务器，开发服务器支持热重载功能，修改代码后会自动刷新页面。开发过程中可以使用 npm run lint 进行代码检查，确保代码质量符合规范。开发完成后，执行 npm run build 构建生产版本，构建结果会生成在 dist 目录中，可以部署到生产环境。如果项目包含测试用例，还可以使用 npm run test 运行测试。

### 后端开发

后端开发需要进入 backend 目录，使用 Maven 进行项目管理和构建。执行 mvn clean compile 可以编译项目，检查代码是否有编译错误。使用 mvn spring-boot:run 可以直接运行应用程序，适合开发调试。执行 mvn clean package 可以打包项目，生成可执行的 jar 文件，用于生产环境部署。如果项目包含测试用例，可以使用 mvn test 运行测试，确保代码质量。系统使用 MyBatis Plus 进行数据访问，首次启动时需要创建数据库并执行初始化脚本，系统会自动创建所需的数据表和初始管理员账户。

### API接口

LeafBoss 提供了完整的 RESTful API 接口，详细的 API 接口文档请参考 API_DOCUMENTATION.md 文件。认证接口支持用户登录，通过 POST /api/auth/login 接口提交邮箱和密码，成功后返回 JWT Token，后续请求需要在请求头中携带该 Token。卡密管理接口包括获取卡密列表、创建卡密、验证卡密等功能，支持分页查询和条件筛选。产品管理接口提供产品的增删改查功能，支持产品信息的完整管理。

系统还提供了公共接口，无需认证即可访问。例如验证卡密有效性接口可以通过 GET /api/public/card-keys/verify/{key} 访问，系统会自动验证卡密并激活，成功后返回产品信息。管理员登录获取令牌可以使用 curl 命令发送 POST 请求到 /api/auth/login 接口，携带邮箱和密码信息。获取产品列表需要先登录获取 Token，然后在请求头中添加 Authorization: Bearer YOUR_JWT_TOKEN，通过 GET /api/products 接口获取产品列表。

## 部署说明

### 生产环境部署

生产环境部署分为前端部署、后端部署、数据库部署三个部分。均可通过docker直接进行部署。

### Docker 部署

系统支持使用 Docker 进行容器化部署，可以简化部署流程并提高部署效率。前端 Dockerfile 使用 nginx:alpine 作为基础镜像，将构建好的 dist 目录复制到 nginx 的 html 目录中，提供静态文件服务。后端 Dockerfile 使用 openjdk:17-alpine 作为基础镜像，将打包好的 jar 文件复制到容器中，设置启动命令运行应用程序。使用 Docker 部署可以确保环境的一致性，方便在不同环境中迁移和扩展系统。

#### 使用 Docker Hub 镜像部署

LeafBoss 已在 Docker Hub 上发布预构建的镜像，可以直接拉取使用。镜像仓库地址为 `yangshengzhou/leafboss`，提供前端和后端两个镜像。

**拉取镜像**

```bash
docker pull yangshengzhou/leafboss:frontend-v1
docker pull yangshengzhou/leafboss:backend-v1
```

**创建 Docker 网络**

为了确保容器之间能够正常通信，需要先创建一个 Docker 网络：

```bash
docker network create leafboss-network
```

**部署 MySQL 数据库**

首先需要进入包含 `data.sql` 文件的目录，然后启动 MySQL 容器：

```bash
cd ~/leaf-boss
docker run -d \
  --name leafboss-mysql \
  --network leafboss-network \
  --restart always \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=leaf_boss \
  -p 3306:3306 \
  mysql:8.0
```

等待 MySQL 容器启动完成（约 30-60 秒），然后执行初始化脚本：

```bash
docker exec -i leafboss-mysql mysql -uroot -p123456 < data.sql
```

启动后端容器：

```bash
docker run -d \
  --name leafboss-backend \
  --network leafboss-network \
  --restart always \
  -p 8081:8081 \
  yangshengzhou/leafboss:backend-v1
```

**部署前端服务**

启动前端容器：

```bash
docker run -d \
  --name leafboss-frontend \
  --network leafboss-network \
  --restart always \
  -p 80:80 \
  yangshengzhou/leafboss:frontend-v1
```

**验证部署**

部署完成后，可以通过浏览器访问 `http://服务器ip` 进入系统。默认管理员账号：
- 邮箱：admin@qq.com
- 密码：123456

**查看容器状态**

```bash
docker ps
```

示例输出：

```
IMAGE                                PORTS                                                    NAMES
yangshengzhou/leafboss:frontend-v1   0.0.0.0:80->80/tcp, [::]:80->80/tcp                      leafboss-frontend
yangshengzhou/leafboss:backend-v1    0.0.0.0:8081->8081/tcp, [::]:8081->8081/tcp              leafboss-backend
mysql:8.0                            0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp, 33060/tcp   leafboss-mysql
```

**查看网络信息**

```bash
docker network inspect leafboss-network
```

**停止和删除容器**

```bash
docker stop leafboss-frontend leafboss-backend leafboss-mysql
docker rm leafboss-frontend leafboss-backend leafboss-mysql
```

**删除网络**

```bash
docker network rm leafboss-network
```

#### 环境变量配置

后端服务支持以下环境变量配置：

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| SPRING_DATASOURCE_URL | 数据库连接地址 | jdbc:mysql://localhost:3306/leaf_boss |
| SPRING_DATASOURCE_USERNAME | 数据库用户名 | root |
| SPRING_DATASOURCE_PASSWORD | 数据库密码 | 123456 |
| JWT_SECRET | JWT 密钥 | leaf-boss-secret-key-for-jwt-token-generation |
| JWT_EXPIRATION | JWT 过期时间（毫秒） | 86400000 |
| SERVER_PORT | 服务器端口 | 8081 |

#### 故障排查

**MySQL 连接失败**

检查 MySQL 容器是否正常运行：
```bash
docker logs leafboss-mysql
```

**后端启动失败**

检查后端容器日志：
```bash
docker logs leafboss-backend
```

**前端无法访问后端**

确认所有容器都在同一个网络中：
```bash
docker network inspect leafboss-network
```

**数据库初始化失败**

确保 data.sql 文件在正确的位置，并且 MySQL 容器有权限访问该文件。

### 参与贡献

我们欢迎任何形式的贡献，包括代码贡献、文档改进、问题反馈等。参与贡献的流程包括：首先 Fork 本仓库到自己的 GitHub 账户，然后新建功能分支，使用 git checkout -b feature/AmazingFeature 命令创建分支。在分支上进行开发，完成后使用 git commit -m 'Add some AmazingFeature' 提交代码，提交信息应该清晰描述所做的修改。然后使用 git push origin feature/AmazingFeature 将分支推送到自己的仓库，最后在 GitHub 上新建 Pull Request，等待项目维护者审核和合并代码。贡献代码时应该遵循项目的代码规范，编写清晰的提交信息，添加适当的测试用例，并更新相关文档。

## 版本历史

### 发布概览

LeafBoss 项目经历了多次版本迭代，不断完善和优化系统功能。v2.0.0 版本于 2026-01-18 发布，主要特性是将 LeafCard 升级为 LeafBoss 业务运营支撑系统，重构了系统架构，扩展为全面的业务运营支撑系统。v1.0.0 版本于 2024-10-27 发布，标志着 LeafCard 业务运营支撑系统正式上线，提供了基础的用户认证、卡密管理和数据统计功能。

### 详细变更日志

v2.0.0 版本（2026-01-18）是系统的一次重大升级，系统从 LeafCard 升级为 LeafBoss 业务运营支撑系统，重构了系统架构，扩展为全面的业务运营支撑系统。更新了所有文档和配置文件，优化了 UI 设计，提升了用户体验。增强了安全验证机制，新增了人员管理模块，支持管理员和普通用户管理，优化了产品规格管理功能，使系统更加完善和易用。

v1.0.0 版本（2024-10-27）是系统的首次正式发布，LeafCard 业务运营支撑系统正式上线，提供了完整的用户认证系统、基础卡密管理功能和基础数据统计功能，为用户提供了基本的业务运营支撑能力。

### 开发历程

LeafBoss 项目的开发历程可以追溯到 2024 年 1 月，当时基于对现有业务运营支撑系统的分析，构思开发一个轻量级、易用的业务运营支撑系统。2024 年 2 月进行了技术选型，确定使用 Vue 3 + Spring Boot 3 的技术栈，开始系统架构设计。2024 年 3 月到 7 月进行了核心开发，完成了前后端核心功能开发，包括密钥管理、用户管理、权限控制等功能。2024 年 10 月 27 日 LeafCard 业务运营支撑系统正式上线，开始为用户提供服务。2026 年 1 月 18 日系统升级为 LeafBoss 业务运营支撑系统，支撑全面的业务运营需求。

## 许可证

本项目采用 MIT 许可证，这是一种宽松的开源许可证，允许用户自由使用、修改和分发代码，无论是商业用途还是非商业用途都可以使用本项目的代码。查看 LICENSE 文件可以了解许可证的详细条款和条件。MIT 许可证鼓励代码的共享和重用，促进了开源社区的发展和创新。

## 联系方式

如果您在使用 LeafBoss 过程中遇到任何问题，或者有任何建议和意见，欢迎通过以下方式联系我们。GitHub 仓库地址是 https://github.com/YangShengzhou03/LeafBoss，您可以在仓库中查看源代码、提交问题或参与贡献。问题反馈可以通过 GitHub Issues 进行，我们会及时回复和处理您的问题。邮箱地址是 dev@leafboss.com，您可以通过邮件与我们联系。项目主页也是 https://github.com/YangShengzhou03/LeafBoss，欢迎访问了解更多信息。

## 项目统计

![GitHub Release](https://img.shields.io/github/v/release/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Last Commit](https://img.shields.io/github/last-commit/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Contributors](https://img.shields.io/github/contributors/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Repo Size](https://img.shields.io/github/repo-size/YangShengzhou03/LeafBoss?style=flat-square)

---

**感谢使用 LeafBoss！**

<div align="center">

如果这个项目对您有帮助，请给个 Star 支持一下！

[![Star History Chart](https://api.star-history.com/svg?repos=YangShengzhou03/LeafBoss&type=Date)](https://star-history.com/#YangShengzhou03/LeafBoss&Date)

</div>
