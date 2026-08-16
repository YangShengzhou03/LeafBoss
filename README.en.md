# LEAF-BOSS - Business Operation Support System

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/stargazers)&nbsp;[![GitHub forks](https://img.shields.io/github/forks/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/network/members)&nbsp;[![GitHub issues](https://img.shields.io/github/issues/YangShengzhou03/LeafBoss?style=for-the-badge&logo=github)](https://github.com/YangShengzhou03/LeafBoss/issues)&nbsp;[![GitHub license](https://img.shields.io/github/license/YangShengzhou03/LeafBoss?style=for-the-badge)](https://github.com/YangShengzhou03/LeafBoss/blob/main/LICENSE)&nbsp;[![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-42b883?style=for-the-badge&logo=vuedotjs)](https://vuejs.org/)&nbsp;[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.0-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)

**A modern business operation support system with separated frontend and backend architecture**

[Quick Start](#-quick-start) • [Features](#-features) • [Live Demo](#-live-demo) • [API Documentation](API_DOCUMENTATION.md)

</div>

## Features

LeafBoss is a comprehensive business operation support system that provides all-around business management capabilities. The system supports complete card key lifecycle management, including batch generation, export, verification, activation, and deactivation of card keys, making card key management simple and efficient. The product management module supports product information maintenance and multi-specification configuration, allowing flexible definition of different product attributes and characteristics. The specification management feature enables administrators to flexibly define various authorization schemes, supporting specification configurations with different durations and price combinations to meet diverse business needs.

The company management module provides complete maintenance of company information, including basic company information, status management, and comment statistics, helping enterprises better understand customer feedback. The comment management system supports viewing and managing user comments, where administrators can filter comments by company and card key, and can delete inappropriate comments. In terms of personnel management, the system provides two major modules: administrator account management and customer user management, supporting permission control, status management, and user query and filtering operations, ensuring system security and manageability.

The data statistics feature provides visualized data reports that can monitor system usage in real-time, including card key inventory distribution, daily sales statistics, monthly revenue comparison, and detailed operation log audits, providing data support for management decisions. The operation log module records all key operations in the system (login, card keys, products, specifications, users, etc.), providing complete operation audit functionality, supporting multi-dimensional queries and clearing management, ensuring system security. The system adopts JWT Token authentication mechanism to ensure secure verification of user identity, while supporting responsive design, allowing normal use on various devices such as PCs, tablets, and mobile phones. The modern architecture based on Spring Boot 3 and Vue 3 ensures system stability and response speed.

### System Interface Preview

![LEAF-BOSS Business Operation Support System](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Overview.png)

![LEAF-BOSS Login Page](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Login.png)

## Quick Start

The system provides a default administrator account with email admin@qq.com and password 123456. You can use this account to log in to the system and access all management features.

![LEAF-BOSS Admin Dashboard](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Dashboard.png)

![LEAF-BOSS Product Management](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Product-Management.png)

![LEAF-BOSS Admin Management](https://gitee.com/Yangshengzhou/leaf-boss/raw/master/assets/LEAF-BOSS-Admin-Management.png)

## System Architecture

LeafBoss adopts a classic three-tier architecture design, including frontend interface layer, backend service layer, and data storage layer. The frontend interface layer is built using Vue 3 and Element Plus, providing a friendly user interaction interface, supporting component-based development and responsive design, ensuring a good user experience on different devices. The backend service layer is based on the Spring Boot 3 framework, using MyBatis Plus for data access, adopting JWT Token for user authentication, providing complete business logic processing and transaction management functionality. The data storage layer uses MySQL 8.0 database, performing data mapping and persistence operations through the Repository pattern, ensuring data security and consistency.

The frontend technology stack includes Vue 3.4.0 as a progressive JavaScript framework, Element Plus 2.4.0 as a Vue 3-based UI component library, Vue Router 4.2.0 as the official router manager, Axios 1.6.0 as an HTTP client library, and Sass 1.69.0 as a CSS preprocessor. The backend technology stack includes Spring Boot 3.1.0 as a Java enterprise development framework, MyBatis Plus 3.5.4.1 as a data persistence layer framework, MySQL 8.0.33 as a relational database, Maven 3.6+ as a project build tool, Java 17.0+ as the development language, and JWT 0.11.5 as a JSON Web Token authentication tool.

The project structure is divided into two main parts: frontend and backend. The frontend project contains the public static resource directory and src source code directory. The src directory includes components for public components, views for page components, route for routing configuration, services for API services, and utils for utility functions. The backend project contains the src/main/java Java source code directory and src/main/resources resource files directory. The Java source code directory includes controller layer, service layer, mapper data access layer, entity classes, dto data transfer objects, config configuration classes, common classes, and utils utility classes. This clear layered architecture makes the system easy to maintain and extend.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Frontend Layer │    │  Backend Layer  │    │  Data Layer     │
│                 │    │                 │    │                 │
│  Vue 3 +        │◄──►│ Spring Boot 3   │◄──►│   MySQL 8.0     │
│  Element Plus   │    │ MyBatis Plus + JWT │    │                 │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ User Interaction│    │ Business Logic  │    │ Data Persistence│
│                 │    │                 │    │                 │
│ Component-based │    │ Service Layer   │    │ Repository      │
│ Responsive      │    │ Transaction Mgmt│    │ Data Mapping    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Development Guide

### Frontend Development

For frontend development, navigate to the frontend directory, first execute npm install to install project dependencies, then you can use npm run serve to start the development server. The development server supports hot reload functionality, automatically refreshing the page after code modifications. During development, you can use npm run lint for code checking to ensure code quality meets standards. After development is complete, execute npm run build to build the production version. The build results will be generated in the dist directory and can be deployed to the production environment. If the project includes test cases, you can also use npm run test to run tests.

### Backend Development

For backend development, navigate to the backend directory and use Maven for project management and building. Execute mvn clean compile to compile the project and check for compilation errors. Use mvn spring-boot:run to directly run the application, suitable for development and debugging. Execute mvn clean package to package the project, generating an executable jar file for production environment deployment. If the project includes test cases, you can use mvn test to run tests to ensure code quality. The system uses MyBatis Plus for data access. When starting for the first time, you need to create a database and execute initialization scripts. The system will automatically create the required data tables and initial administrator account.

### API Interface

LeafBoss provides complete RESTful API interfaces. For detailed API interface documentation, please refer to the API_DOCUMENTATION.md file. The authentication interface supports user login, submitting email and password through the POST /api/auth/login interface. After success, it returns a JWT Token, which needs to be carried in the request header for subsequent requests. The card key management interface includes functions such as getting card key list, creating card keys, and verifying card keys, supporting pagination queries and conditional filtering. The product management interface provides CRUD functionality for products, supporting complete management of product information.

The system also provides public interfaces that can be accessed without authentication. For example, the verify card key validity interface can be accessed through GET /api/public/card-keys/verify/{key}. The system will automatically verify and activate the card key, returning product information upon success. Administrator login to obtain a token can use the curl command to send a POST request to the /api/auth/login interface with email and password information. To get the product list, you need to first log in to obtain a Token, then add Authorization: Bearer YOUR_JWT_TOKEN in the request header, and access through the GET /api/products interface.

## Deployment Instructions

### Production Environment Deployment

Production environment deployment is divided into three parts: frontend deployment, backend deployment, and database deployment. All can be deployed directly through Docker.

### Docker Deployment

The system supports containerized deployment using Docker, which can simplify the deployment process and improve deployment efficiency. The frontend Dockerfile uses nginx:alpine as the base image, copying the built dist directory to nginx's html directory to provide static file services. The backend Dockerfile uses openjdk:17-alpine as the base image, copying the packaged jar file into the container and setting the startup command to run the application. Using Docker deployment ensures environment consistency, making it convenient to migrate and scale the system in different environments.

#### Deploy with Docker Compose (Recommended)

LeafBoss has published pre-built images on Docker Hub, which can be deployed directly using docker-compose with one click. Image repository address: `yangshengzhou/leafboss`.

```bash
curl -sSL https://gitee.com/Yangshengzhou/leaf-boss/raw/master/docker-compose.yml -o docker-compose.yml && docker-compose up -d && sleep 20 && curl -sSL https://gitee.com/Yangshengzhou/leaf-boss/raw/master/data.sql -o data.sql && docker exec -i leafboss-mysql mysql -uroot -p123456 < data.sql && docker ps
```

After deployment is complete, visit `http://SERVER_IP`, default account: `admin@qq.com`, password: `123456`.

To remove containers, execute the following command:

```bash
docker-compose down -v
```

#### Deploy with Docker Hub Images (Including HTTPS Configuration)

LeafBoss has published pre-built images on Docker Hub, which can be pulled directly for use. Image repository address: `yangshengzhou/leafboss`, including frontend, backend, and HTTPS proxy images.


### 1. Environment Preparation

#### 1.1 Pull Core Business Images

```bash
docker pull yangshengzhou/leafboss:frontend-v1
docker pull yangshengzhou/leafboss:backend-v1
docker pull yangshengzhou/leafboss:https-nginx-v1
curl -sSL https://gitee.com/Yangshengzhou/leaf-boss/raw/master/data.sql -o data.sql
```

#### 1.2 Create Dedicated Docker Network

Provide an isolated environment for inter-container communication and avoid port conflicts:

```bash
docker network create leafboss-network
```

### 2. Deploy Core Services

#### 2.1 Deploy MySQL Database

First navigate to the directory containing the `data.sql` initialization script, then start the container:

```bash
docker run -d \
  --name leafboss-mysql \
  --network leafboss-network \
  --restart always \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=leaf_boss \
  -p 3306:3306 \
  mysql:8.0
```

Wait 30 seconds (for MySQL to complete startup), then execute database initialization:

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

Frontend port 80 only takes effect within the container's internal network. Host ports 80/443 are exclusively used by the HTTPS proxy container:

```bash
docker run -d \
  --name leafboss-frontend \
  --network leafboss-network \
  --restart always \
  yangshengzhou/leafboss:frontend-v1
```

#### 2.4 Deploy HTTPS Proxy Service (Full-site Encryption Core)
```bash
mkdir -p /data/nginx/certs/
# Copy certificate leafboss.top_certificate.pem and private key file leafboss.top_private.key to /data/nginx/certs/ directory
cd /data/nginx/certs/
docker run -d \
  --name leafboss-https-nginx \
  --network leafboss-network \
  --restart always \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/leafboss.top_certificate.pem:/data/nginx/certs/leafboss.top_certificate.pem \
  -v $(pwd)/leafboss.top_private.key:/data/nginx/certs/leafboss.top_private.key \
  yangshengzhou/leafboss:https-nginx-v1
```

### 3. Verify Deployment Results

- Access method: Only supports `https://your-domain` (e.g., `https://leafboss.top`), `http://SERVER_IP` will automatically redirect to HTTPS;
- Default account: Email `admin@qq.com`, password `123456`;
- Check container status (all containers must be in `Up` status):
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

#### 4.2 Stop/Delete All Containers

```bash
# Stop containers (including HTTPS proxy container)
docker stop leafboss-https-nginx leafboss-frontend leafboss-backend leafboss-mysql
# Delete containers
docker rm leafboss-https-nginx leafboss-frontend leafboss-backend leafboss-mysql
```

#### 4.3 Delete Docker Network

```bash
docker network rm leafboss-network
```

### 5. Deployment Notes

1. If HTTPS access shows a certificate error, check if the SSL certificate file path matches the Nginx configuration;
2. The server needs to open ports 80/443 (firewall/security group), otherwise HTTPS service cannot be accessed.

#### Environment Variable Configuration

The backend service supports the following environment variable configurations:

| Environment Variable         | Description                  | Default Value                                 |
| ---------------------------- | ---------------------------- | --------------------------------------------- |
| SPRING_DATASOURCE_URL        | Database connection address  | jdbc:mysql://localhost:3306/leaf_boss         |
| SPRING_DATASOURCE_USERNAME   | Database username            | root                                          |
| SPRING_DATASOURCE_PASSWORD   | Database password            | 123456                                        |
| JWT_SECRET                   | JWT secret key               | leaf-boss-secret-key-for-jwt-token-generation |
| JWT_EXPIRATION               | JWT expiration time (ms)     | 86400000                                      |
| SERVER_PORT                  | Server port                  | 8081                                          |

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

Ensure the data.sql file is in the correct location and the MySQL container has permission to access the file.

### Contributing

We welcome any form of contribution, including code contributions, documentation improvements, and issue feedback. The contribution process includes: first Fork this repository to your own GitHub account, then create a new feature branch using the git checkout -b feature/AmazingFeature command. Develop on the branch, and when complete, commit the code using git commit -m 'Add some AmazingFeature'. The commit message should clearly describe the modifications made. Then push the branch to your own repository using git push origin feature/AmazingFeature, and finally create a new Pull Request on GitHub, waiting for project maintainers to review and merge the code. When contributing code, you should follow the project's code standards, write clear commit messages, add appropriate test cases, and update relevant documentation.

## Version History

### Release Overview

The LeafBoss project has undergone multiple version iterations, continuously improving and optimizing system functionality. Version v2.0.0 was released on 2026-01-18, with the main feature being the upgrade of LeafCard to LeafBoss business operation support system, refactoring the system architecture and expanding it into a comprehensive business operation support system. Version v1.0.0 was released on 2024-10-27, marking the official launch of the LeafCard business operation support system, providing basic user authentication, card key management, and data statistics functionality.

### Detailed Changelog

Version v2.0.0 (2026-01-18) is a major upgrade of the system. The system was upgraded from LeafCard to LeafBoss business operation support system, refactoring the system architecture and expanding it into a comprehensive business operation support system. All documentation and configuration files were updated, UI design was optimized, and user experience was improved. Security verification mechanisms were enhanced, a personnel management module was added supporting administrator and regular user management, and product specification management functionality was optimized, making the system more complete and user-friendly.

Version v1.0.0 (2024-10-27) is the first official release of the system. LeafCard business operation support system was officially launched, providing a complete user authentication system, basic card key management functionality, and basic data statistics functionality, providing users with basic business operation support capabilities.

### Development History

The development history of the LeafBoss project can be traced back to January 2024, when based on the analysis of existing business operation support systems, the concept of developing a lightweight, easy-to-use business operation support system was conceived. In February 2024, technology selection was conducted, determining to use the Vue 3 + Spring Boot 3 technology stack and beginning system architecture design. From March to July 2024, core development was carried out, completing frontend and backend core functionality development, including key management, user management, permission control, and other features. On October 27, 2024, LeafCard business operation support system was officially launched, beginning to provide services to users. On January 18, 2026, the system was upgraded to LeafBoss business operation support system, supporting comprehensive business operation needs.

## License

This project adopts the GNU Affero General Public License v3.0 license, which is an open-source license ensuring users can freely use, modify, and distribute the code. View the LICENSE file to understand the detailed terms and conditions of the license.

## Contact Information

If you encounter any problems while using LeafBoss, or have any suggestions and opinions, you are welcome to contact us through the following methods. The GitHub repository address is https://github.com/YangShengzhou03/LeafBoss, where you can view source code, submit issues, or participate in contributions. Issue feedback can be done through GitHub Issues, and we will reply and handle your issues in a timely manner. The email address is YangSZ03@foxmail.com, and you can contact us via email. The project homepage is also https://github.com/YangShengzhou03/LeafBoss, welcome to visit for more information.

## Project Statistics

![GitHub Last Commit](https://img.shields.io/github/last-commit/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Contributors](https://img.shields.io/github/contributors/YangShengzhou03/LeafBoss?style=flat-square)
![GitHub Repo Size](https://img.shields.io/github/repo-size/YangShengzhou03/LeafBoss?style=flat-square)

---

**Thank you for using LeafBoss!**

<div align="center">


</div>
