-- 数据库初始化脚本
DROP DATABASE IF EXISTS leaf_boss;
CREATE DATABASE leaf_boss CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE leaf_boss;

-- 管理员表：存储后台管理人员信息
CREATE TABLE admins (
    id CHAR(36) PRIMARY KEY COMMENT '管理员唯一标识符 (UUID)',
    username VARCHAR(50) NOT NULL DEFAULT 'leafAdmin' COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    status VARCHAR(20) DEFAULT 'active' NOT NULL COMMENT '状态',
    last_login_time DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='管理员表';

-- 产品表：定义业务产品线
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '产品唯一标识符',
    name VARCHAR(100) NOT NULL COMMENT '产品名称',
    description TEXT COMMENT '产品描述',
    status VARCHAR(20) DEFAULT 'active' NOT NULL COMMENT '产品状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='产品表';

-- 规格表：定义产品的具体授权规格（如月卡、年卡）
CREATE TABLE specifications (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '规格唯一标识符',
    product_id INT NOT NULL COMMENT '所属产品ID',
    name VARCHAR(100) NOT NULL COMMENT '规格名称',
    description TEXT COMMENT '规格描述',
    duration_days INT DEFAULT 0 COMMENT '有效期（天）',
    price DECIMAL(10,2) DEFAULT 0.00 COMMENT '价格',
    stock_quantity INT DEFAULT 0 COMMENT '当前库存数量',
    status VARCHAR(20) DEFAULT 'active' NOT NULL COMMENT '状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='规格表';

-- 卡密表：存储生成的授权密钥
CREATE TABLE card_keys (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '卡密主键ID',
    card_key VARCHAR(100) UNIQUE NOT NULL COMMENT '卡密代码',
    specification_id INT NOT NULL COMMENT '所属规格ID',
    status VARCHAR(20) DEFAULT '未使用' NOT NULL COMMENT '卡密当前状态',
    user_email VARCHAR(100) COMMENT '激活用户的邮箱',
    user_id VARCHAR(100) COMMENT '激活用户的ID',
    activate_time DATETIME COMMENT '卡密激活时间',
    expire_time DATETIME COMMENT '卡密过期时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    FOREIGN KEY (specification_id) REFERENCES specifications(id) ON DELETE CASCADE,
    INDEX idx_card_key (card_key),
    INDEX idx_status (status),
    INDEX idx_specification_id (specification_id),
    INDEX idx_user_email (user_email),
    INDEX idx_activate_time (activate_time)
) ENGINE=InnoDB COMMENT='卡密表';

-- 操作日志表：记录系统关键操作
CREATE TABLE operation_logs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '日志ID',
    operation_type VARCHAR(30) NOT NULL COMMENT '操作类型',
    description TEXT COMMENT '详细描述',
    ip_address VARCHAR(50) COMMENT '操作者IP地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '记录时间',
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='操作日志表';

-- 用户表：存储前端注册用户（非管理人员）
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY COMMENT '用户唯一标识符 (UUID)',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    password VARCHAR(255) COMMENT '密码',
    status VARCHAR(20) DEFAULT 'active' NOT NULL COMMENT '账号状态',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '注册时间',
    last_login_time DATETIME COMMENT '最后登录时间',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='用户表';

-- 公司表：业务关联的公司实体
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '公司ID',
    name VARCHAR(100) NOT NULL COMMENT '公司名称',
    comment_count INT DEFAULT 0 COMMENT '关联的评论总数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    INDEX idx_name (name)
) ENGINE=InnoDB COMMENT='公司表';

-- Boss评论表：用户持卡密对公司的评价
CREATE TABLE boss_reviews (
    id CHAR(36) PRIMARY KEY COMMENT '评论唯一标识符 (UUID)',
    card_key VARCHAR(100) NOT NULL COMMENT '发表评论时验证的卡密',
    company_id INT NOT NULL COMMENT '所属公司ID',
    content TEXT NOT NULL COMMENT '评论内容',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '评论发表时间',
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_company_id (company_id),
    INDEX idx_card_key (card_key),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='Boss评论表';

-- 初始化默认管理员账号 (密码: 123456)
INSERT INTO admins (id, username, email, password, status) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', 'admin@qq.com', '123456', 'active');

COMMIT;
