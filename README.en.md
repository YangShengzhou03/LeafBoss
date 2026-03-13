# LEAF-BOSS - Business Operation Support System

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/stargazers)&nbsp;[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/network/members)&nbsp;[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/issues)&nbsp;[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafBoss?style=for-the-badge)](https://github.com/YangShengzhou03/LeafBoss/blob/main/LICENSE)&nbsp;[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)&nbsp;[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

**A modern business operation support system with front-end and back-end separation architecture**

[Quick Start](#-quick-start) • [Key Features](#-key-features) • [Online Demo](#-online-demo) • [API Documentation](API_DOCUMENTATION.md)

</div>

## Key Features

LeafBoss is a comprehensive business operation support system providing full-scale management capabilities. The system supports full card key lifecycle management, including batch generation, export, verification, activation, and disabling, making card key management simple and efficient. The product management module supports product information maintenance and multi-specification configuration, allowing flexible definition of different product attributes. The specification management feature enables administrators to define various authorization schemes with different duration and price combinations to meet diverse business needs.

The company management module provides complete maintenance of company information, including basic profiles, status management, and comment statistics, helping businesses better understand customer feedback. The review management system supports viewing and managing user reviews, where administrators can filter reviews by company or card key and delete inappropriate comments. Regarding personnel management, the system provides two major modules: admin account management and customer user management, supporting access control, status management, and advanced filtering to ensure system security.

Data statistics provide visualized reports for real-time monitoring of system usage, including stock distribution, daily sales statistics, monthly revenue comparisons, and detailed operation log auditing to support data-driven decision-making. The operation log module records all critical actions (login, card keys, products, specifications, users, etc.) within the system, providing complete audit trails with multi-dimensional query and cleanup management. The system employs JWT Token authentication for secure identity verification and supports responsive design for seamless use on PCs, tablets, and mobile devices. Its modern architecture based on Spring Boot 3 and Vue 3 ensures system stability and responsiveness.

### System Preview

![LEAF-BOSS Business Operation Support System](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Overview.png)

![LEAF-BOSS Login Page](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Login.png)

## Quick Start

The system provides a default admin account with email admin@qq.com and password 123456. Use this account to log in to the system and access all management functions.

![LEAF-BOSS Admin Dashboard](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Dashboard.png)

![LEAF-BOSS Product Management](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Product-Management.png)

![LEAF-BOSS Personnel Management](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Admin-Management.png)

## System Architecture

LeafBoss adopts a classic three-tier architecture design, including frontend interface layer, backend service layer, and data storage layer. The frontend interface layer is built with Vue 3 and Element Plus, providing a friendly user interaction interface, supporting component-based development and responsive design to ensure good user experience across different devices. The backend service layer is based on Spring Boot 3 framework, using MyBatis Plus for data access, employing JWT Token for user authentication, and providing complete business logic processing and transaction management functions. The data storage layer uses MySQL 8.0 database, performing data mapping and persistence operations through Repository pattern to ensure data security and consistency.

The frontend technology stack includes Vue 3.4.0 as the progressive JavaScript framework, Element Plus 2.4.0 as the Vue 3-based UI component library, Vue Router 4.2.0 as the official router manager, Axios 1.6.0 as the HTTP client library, and Sass 1.69.0 as the CSS preprocessor. The backend technology stack includes Spring Boot 3.1.0 as the Java enterprise development framework, MyBatis Plus 3.5.4.1 as the data persistence framework, MySQL 8.0.33 as the relational database, Maven 3.6+ as the project build tool, Java 17.0+ as the development language, and JWT 0.11.5 as the JSON Web Token authentication tool.

The project structure is divided into two main parts: frontend and backend. The frontend project contains the public static resource directory and src source code directory. The src directory includes components common components, views page components, route routing configuration, services API services, and utils utility functions modules. The backend project contains src/main/java Java source code directory and src/main/resources resource files directory. The Java source code directory includes controller controller layer, service service layer, mapper data access layer, entity entity classes, dto data transfer objects, config configuration classes, common common classes, and utils utility classes modules. This clear layered architecture makes the system easy to maintain and extend.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Frontend Layer  │    │ Backend Layer   │    │ Data Layer      │
│                 │    │                 │    │                 │
│  Vue 3 +        │◄──►│ Spring Boot 3   │◄──►│   MySQL 8.0     │
│  Element Plus   │    │ MyBatis Plus + JWT │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Interface  │    │ Business Logic   │    │ Data Persistence│
│                 │    │                 │    │                 │
│  Component-based│    │  Service Layer  │    │  Repository     │
│  Responsive     │    │  Transaction Mgmt│    │  Data Mapping   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Development Guide

### Frontend Development

For frontend development, navigate to the frontend directory and first run npm install to install project dependencies. Then you can use npm run serve to start the development server, which supports hot reload functionality - the page will automatically refresh after code changes. During development, you can use npm run lint for code checking to ensure code quality meets standards. After development is complete, run npm run build to build the production version, and the build results will be generated in the dist directory for deployment to production environment. If the project includes test cases, you can also run npm run test to execute tests.

### Backend Development

For backend development, navigate to the backend directory and use Maven for project management and building. Run mvn clean compile to compile the project and check for compilation errors. Use mvn spring-boot:run to directly run the application, suitable for development and debugging. Run mvn clean package to package the project, generating an executable jar file for production environment deployment. If the project includes test cases, you can use mvn test to run tests to ensure code quality. The system uses MyBatis Plus for data access. On first startup, you need to create the database and execute the initialization script, and the system will automatically create required tables and the initial admin account.

### API Interfaces

LeafBoss provides complete RESTful API interfaces. For detailed API interface documentation, please refer to the API_DOCUMENTATION.md file. The authentication interface supports user login by submitting email and password through the POST /api/auth/login interface. Upon success, a JWT Token is returned, and subsequent requests need to carry this Token in the request header. Card key management interfaces include getting card key list, creating card keys, verifying card keys, etc., supporting paginated queries and conditional filtering. Product management interfaces provide CRUD operations for products, supporting complete management of product information.

The system also provides public interfaces that can be accessed without authentication. For example, the card key validity verification interface can be accessed via GET /api/public/card-keys/verify/{key}, and the system will automatically verify and activate the card key, returning product information upon success. Admin login to get token can use curl command to send POST request to /api/auth/login interface, carrying email and password information. To get product list, first login to get Token, then add Authorization: Bearer YOUR_JWT_TOKEN to the request header, and access GET /api/products interface to get product list.

## Deployment

### Production Environment Deployment

Production environment deployment is divided into three parts: frontend deployment, backend deployment, and database deployment. All can be deployed directly through Docker.

### Docker Deployment

The system supports containerized deployment using Docker, which can simplify the deployment process and improve deployment efficiency. The frontend Dockerfile uses nginx:alpine as the base image, copying the built dist directory to nginx's html directory to provide static file services. The backend Dockerfile uses openjdk:17-alpine as the base image, copying the packaged jar file into the container and setting the startup command to run the application. Using Docker for deployment ensures environment consistency and facilitates system migration and scaling across different environments.

#### Deploying with Docker Hub Images (Including HTTPS Configuration)

LeafBoss has published pre-built images on Docker Hub that can be pulled directly. Image repository address: `yangshengzhou/leafboss`, including frontend, backend, and HTTPS proxy images.

### 1. Environment Preparation

#### 1.1 Pull Core Business Images

```bash
docker pull yangshengzhou/leafboss:frontend-v1
docker pull yangshengzhou/leafboss:backend-v1
docker pull yangshengzhou/leafboss:https-nginx-v1
```

#### 1.2 Create Dedicated Docker Network

Provide an isolated environment for inter-container communication, avoiding port conflicts:

```bash
docker network create leafboss-network
```

### 2. Deploy Core Services

#### 2.1 Deploy MySQL Database

First navigate to the directory containing the `data.sql` initialization script, then start the container:

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

Wait 30-60 seconds (for MySQL startup to complete), then execute database initialization:

```bash
docker exec -i leafboss-mysql mysql -uroot -p123456 < data.sql
```

#### 2.2 Start Backend Service

```bash
docker run -d \
  --name leafboss-backend \
  --network leafboss-network \
  --restart always \
  -p 8081:8081 \
  yangshengzhou/leafboss:backend-v1
```

#### 2.3 Start Frontend Service

Frontend port 80 only works within the container network, while host ports 80/443 are exclusively used by the HTTPS proxy container:

```bash
docker run -d \
  --name leafboss-frontend \
  --network leafboss-network \
  --restart always \
  yangshengzhou/leafboss:frontend-v1
```

#### 2.4 Deploy HTTPS Proxy Service (Core for Full-Site Encryption)

Prepare SSL certificate files. Copy the certificate file (jasun.xyz_certificate.pem) and private key file (jasun.xyz_private.key) to the server's ~/ssl directory, then execute the following command:

```bash
cd ~/ssl
docker run -d \
  --name leafboss-https-nginx \
  --network leafboss-network \
  --restart always \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/jasun.xyz_certificate.pem:/etc/nginx/ssl/jasun.xyz_certificate.pem \
  -v $(pwd)/jasun.xyz_private.key:/etc/nginx/ssl/jasun.xyz_private.key \
  yangshengzhou/leafboss:https-nginx-v1
```

### 3. Verify Deployment Results

- Access method: Only supports `https://your-domain` (e.g., `https://jasun.xyz`), `http://server-IP` will automatically redirect to HTTPS;
- Default account: Email `admin@qq.com`, Password `123456`;
- Check container status (all containers should be in `Up` status):
  ```bash
  docker ps
  ```
  Example output:
  ```
  CONTAINER ID   IMAGE                                   COMMAND                  CREATED         STATUS         PORTS                                                                      NAMES
  6f9d9092fbdf   yangshengzhou/leafboss:https-nginx-v1   "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   leafboss-https-nginx
  b40859ed1f4c   yangshengzhou/leafboss:frontend-v1      "/docker-entrypoint.…"   6 minutes ago   Up 6 minutes   80/tcp                                                                     leafboss-frontend
  6a161ec18d37   yangshengzhou/leafboss:backend-v1       "java -jar /app/app.…"   7 minutes ago   Up 7 minutes   0.0.0.0:8081->8081/tcp, :::8081->8081/tcp                                  leafboss-backend
  a496bc249a22   mysql:8.0                               "docker-entrypoint.s…"   7 minutes ago   Up 7 minutes   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp                       leafboss-mysql
  ```

### 4. Common Operations Commands

#### 4.1 View Container Network Configuration

```bash
docker network inspect leafboss-network
```

#### 4.2 Stop/Remove All Containers

```bash
# Stop containers (including HTTPS proxy container)
docker stop leafboss-https-nginx leafboss-frontend leafboss-backend leafboss-mysql
# Remove containers
docker rm leafboss-https-nginx leafboss-frontend leafboss-backend leafboss-mysql
```

#### 4.3 Remove Docker Network

```bash
docker network rm leafboss-network
```

### 5. Deployment Notes

1. If HTTPS access shows certificate errors, check if SSL certificate file paths match Nginx configuration;
2. Server must open ports 80/443 (firewall/security group), otherwise HTTPS service cannot be accessed.

#### Environment Variable Configuration

The backend service supports the following environment variable configurations:

| Environment Variable | Description | Default Value |
|---------------------|-------------|---------------|
| SPRING_DATASOURCE_URL | Database connection URL | jdbc:mysql://localhost:3306/leaf_boss |
| SPRING_DATASOURCE_USERNAME | Database username | root |
| SPRING_DATASOURCE_PASSWORD | Database password | 123456 |
| JWT_SECRET | JWT secret key | leaf-boss-secret-key-for-jwt-token-generation |
| JWT_EXPIRATION | JWT expiration time (milliseconds) | 86400000 |
| SERVER_PORT | Server port | 8081 |

#### Troubleshooting

**MySQL Connection Failed**

Check if MySQL container is running normally:

```bash
docker logs leafboss-mysql
```

**Backend Startup Failed**

Check backend container logs:

```bash
docker logs leafboss-backend
```

**Frontend Cannot Access Backend**

Confirm all containers are in the same network:

```bash
docker network inspect leafboss-network
```

**Database Initialization Failed**

Ensure data.sql file is in the correct location and MySQL container has permission to access the file.

### Contributing

We welcome contributions in any form, including code contributions, documentation improvements, and issue feedback. The contribution process includes: first Fork this repository to your own GitHub account, then create a new feature branch using git checkout -b feature/AmazingFeature command. Develop on the branch, and after completion use git commit -m 'Add some AmazingFeature' to commit the code. The commit message should clearly describe the changes made. Then use git push origin feature/AmazingFeature to push the branch to your repository, and finally create a Pull Request on GitHub, waiting for the project maintainers to review and merge the code. When contributing code, you should follow the project's code standards, write clear commit messages, add appropriate test cases, and update relevant documentation.

## Version History

### Release Overview

The LeafBoss project has undergone multiple version iterations, continuously improving and optimizing system functionality. Version v2.0.0 was released on 2026-01-18, with the main feature being upgrading LeafCard to LeafBoss Business Operation Support System, refactoring the system architecture, and expanding it into a comprehensive business operation support system. Version v1.0.0 was released on 2024-10-27, marking the official launch of the LeafCard Business Operation Support System, providing basic user authentication, card key management, and data statistics functions.

### Detailed Changelog

Version v2.0.0 (2026-01-18) is a major system upgrade. The system was upgraded from LeafCard to LeafBoss Business Operation Support System, the system architecture was refactored, and it was expanded into a comprehensive business operation support system. All documentation and configuration files were updated, UI design was optimized, and user experience was improved. Security verification mechanisms were enhanced, a personnel management module was added supporting administrator and regular user management, and product specification management functionality was optimized, making the system more complete and easy to use.

Version v1.0.0 (2024-10-27) was the first official release of the system. The LeafCard Business Operation Support System was officially launched, providing complete user authentication system, basic card key management functionality, and basic data statistics functions, providing users with basic business operation support capabilities.

### Development History

The development history of the LeafBoss project can be traced back to January 2024, when based on the analysis of existing business operation support systems, the concept of developing a lightweight, easy-to-use business operation support system was conceived. In February 2024, technology selection was conducted, determining the use of Vue 3 + Spring Boot 3 technology stack, and system architecture design began. From March to July 2024, core development was carried out, completing frontend and backend core function development, including key management, user management, access control, and other functions. On October 27, 2024, the LeafCard Business Operation Support System was officially launched and began providing services to users. On January 18, 2026, the system was upgraded to LeafBoss Business Operation Support System, supporting comprehensive business operation needs.

## License

This project adopts the MIT License, which is a permissive open source license that allows users to freely use, modify, and distribute the code, whether for commercial or non-commercial purposes. View the LICENSE file to understand the detailed terms and conditions of the license. The MIT License encourages code sharing and reuse, promoting the development and innovation of the open source community.

## Contact

If you encounter any problems during using LeafBoss, or have any suggestions and opinions, you are welcome to contact us through the following ways. The GitHub repository address is https://github.com/YangShengzhou03/LeafBoss, where you can view source code, submit issues, or participate in contributions. Issue feedback can be done through GitHub Issues, and we will reply and handle your problems in a timely manner. The email address is YangSZ03@foxmail.com, and you can contact us via email. The project homepage is also https://github.com/YangShengzhou03/LeafBoss, welcome to visit to learn more information.

## Project Statistics

![GitHub Last Commit](https://img.shields.io/github/last-commit/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Contributors](https://img.shields.io/github/contributors/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Repo Size](https://img.shields.io/github/repo-size/YangShengzhou03/LeafBoss?style=flat-square)

---

**Thank you for using LeafBoss!**

<div align="center">

If this project helps you, please give it a Star to support us!

[![Star History Chart](https://api.star-history.com/svg?repos=YangShengzhou03/LeafBoss&type=Date)](https://star-history.com/#YangShengzhou03/LeafBoss&Date)

</div>
